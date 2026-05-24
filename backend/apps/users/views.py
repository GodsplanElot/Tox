from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone
from datetime import timedelta
import requests
import secrets
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import PendingSignupVerification
from .serializers import (
    EmailOrUsernameTokenObtainPairSerializer,
    RegisterSerializer,
    ResendOtpSerializer,
    UserSerializer,
    VerifyEmailSerializer,
)


User = get_user_model()
GOOGLE_TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo"
RESEND_EMAIL_URL = "https://api.resend.com/emails"


def otp_expiry_delta():
    return timedelta(minutes=settings.OTP_EXPIRY_MINUTES)


def otp_resend_delta():
    return timedelta(seconds=settings.OTP_RESEND_COOLDOWN_SECONDS)


def generate_otp():
    return f"{secrets.randbelow(1_000_000):06d}"


def seconds_until(target):
    return max(0, int((target - timezone.now()).total_seconds()))


def fetch_google_tokeninfo(credential):
    session = requests.Session()
    session.trust_env = False
    return session.get(
        GOOGLE_TOKENINFO_URL,
        params={"id_token": credential},
        timeout=8,
    )


def token_response_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "user": UserSerializer(user).data,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


def send_signup_otp(email, otp):
    if not settings.RESEND_API_KEY:
        raise RuntimeError("Email verification is not configured.")

    response = requests.post(
        RESEND_EMAIL_URL,
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": [email],
            "subject": "Verify your ToxicWaste account",
            "html": (
                "<p>Your ToxicWaste verification code is:</p>"
                f"<h1 style='letter-spacing:4px'>{otp}</h1>"
                f"<p>This code expires in {settings.OTP_EXPIRY_MINUTES} minutes.</p>"
            ),
            "text": (
                f"Your ToxicWaste verification code is {otp}. "
                f"It expires in {settings.OTP_EXPIRY_MINUTES} minutes."
            ),
        },
        timeout=8,
    )
    response.raise_for_status()


def unique_username_from_email(email):
    base_username = email.split("@", 1)[0].strip().lower() or "google_user"
    base_username = "".join(
        character for character in base_username if character.isalnum() or character in "._-"
    )[:120] or "google_user"

    username = base_username
    counter = 1
    while User.objects.filter(username=username).exists():
        counter += 1
        suffix = f"-{counter}"
        username = f"{base_username[:150 - len(suffix)]}{suffix}"
    return username


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        email = data["email"]
        now = timezone.now()
        existing_pending = PendingSignupVerification.objects.filter(
            email=email,
            consumed_at__isnull=True,
        ).first()
        if existing_pending and existing_pending.resend_available_at > now:
            return Response(
                {
                    "detail": "Please wait before requesting another code.",
                    "email": email,
                    "resend_available_in": seconds_until(existing_pending.resend_available_at),
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )
        otp = generate_otp()

        pending, _created = PendingSignupVerification.objects.update_or_create(
            email=email,
            defaults={
                "username": data["username"],
                "password_hash": make_password(data["password"]),
                "otp_hash": make_password(otp),
                "expires_at": now + otp_expiry_delta(),
                "resend_available_at": now + otp_resend_delta(),
                "attempt_count": 0,
                "consumed_at": None,
            },
        )

        try:
            send_signup_otp(email, otp)
        except (RuntimeError, requests.RequestException):
            pending.delete()
            return Response(
                {"detail": "Unable to send verification email right now."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {
                "detail": "Verification code sent to your email.",
                "email": email,
                "expires_in": seconds_until(pending.expires_at),
                "resend_available_in": seconds_until(pending.resend_available_at),
            },
            status=status.HTTP_202_ACCEPTED,
        )


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        pending = PendingSignupVerification.objects.filter(
            email=email,
            consumed_at__isnull=True,
        ).first()
        if not pending:
            return Response(
                {"detail": "No pending verification was found for this email."},
                status=status.HTTP_404_NOT_FOUND,
            )

        now = timezone.now()
        if pending.expires_at <= now:
            pending.delete()
            return Response(
                {"detail": "Verification code has expired. Request a new code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if pending.attempt_count >= settings.OTP_MAX_ATTEMPTS:
            return Response(
                {"detail": "Too many incorrect attempts. Request a new code."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        if not check_password(otp, pending.otp_hash):
            pending.attempt_count += 1
            pending.save(update_fields=["attempt_count", "updated_at"])
            return Response(
                {"detail": "Verification code is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email__iexact=email).exists():
            pending.delete()
            return Response(
                {"detail": "A user with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username__iexact=pending.username).exists():
            return Response(
                {"detail": "A user with this username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User(
            username=pending.username,
            email=pending.email,
            password=pending.password_hash,
        )
        user.save()
        pending.consumed_at = now
        pending.save(update_fields=["consumed_at", "updated_at"])
        pending.delete()

        return Response(token_response_for_user(user), status=status.HTTP_201_CREATED)


class ResendOtpView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResendOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        pending = PendingSignupVerification.objects.filter(
            email=email,
            consumed_at__isnull=True,
        ).first()
        if not pending:
            return Response(
                {"detail": "No pending verification was found for this email."},
                status=status.HTTP_404_NOT_FOUND,
            )

        now = timezone.now()
        if pending.resend_available_at > now:
            return Response(
                {
                    "detail": "Please wait before requesting another code.",
                    "resend_available_in": seconds_until(pending.resend_available_at),
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        otp = generate_otp()
        pending.otp_hash = make_password(otp)
        pending.expires_at = now + otp_expiry_delta()
        pending.resend_available_at = now + otp_resend_delta()
        pending.attempt_count = 0
        pending.save(
            update_fields=[
                "otp_hash",
                "expires_at",
                "resend_available_at",
                "attempt_count",
                "updated_at",
            ]
        )

        try:
            send_signup_otp(email, otp)
        except (RuntimeError, requests.RequestException):
            return Response(
                {"detail": "Unable to send verification email right now."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {
                "detail": "Verification code resent.",
                "email": email,
                "expires_in": seconds_until(pending.expires_at),
                "resend_available_in": seconds_until(pending.resend_available_at),
            }
        )


class LoginView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        credential = request.data.get("credential")
        if not credential:
            return Response(
                {"detail": "Google credential is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client_id = settings.GOOGLE_OAUTH_CLIENT_ID
        if not client_id:
            return Response(
                {"detail": "Google OAuth is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            google_response = fetch_google_tokeninfo(credential)
            payload = google_response.json()
            google_response.raise_for_status()
        except requests.HTTPError:
            message = payload.get("error_description") or payload.get("error") or "Google credential is invalid."
            return Response(
                {"detail": f"Google credential verification failed: {message}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except requests.RequestException:
            return Response(
                {"detail": "Unable to reach Google to verify the credential."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError:
            return Response(
                {"detail": "Google returned an invalid verification response."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if payload.get("aud") != client_id:
            return Response(
                {"detail": "Google credential audience is invalid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if payload.get("email_verified") not in (True, "true", "True", "1"):
            return Response(
                {"detail": "Google account email is not verified."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = payload.get("email", "").strip().lower()
        if not email:
            return Response(
                {"detail": "Google credential did not include an email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            user = User.objects.create_user(
                username=unique_username_from_email(email),
                email=email,
                first_name=payload.get("given_name", ""),
                last_name=payload.get("family_name", ""),
            )
            user.set_unusable_password()
            user.save(update_fields=["password"])

        return Response(token_response_for_user(user), status=status.HTTP_200_OK)
