from django.conf import settings
from django.contrib.auth import get_user_model
import requests
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    EmailOrUsernameTokenObtainPairSerializer,
    RegisterSerializer,
    UserSerializer,
)


User = get_user_model()
GOOGLE_TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo"


def token_response_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "user": UserSerializer(user).data,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


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
        user = serializer.save()
        return Response(token_response_for_user(user), status=status.HTTP_201_CREATED)


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
            google_response = requests.get(
                GOOGLE_TOKENINFO_URL,
                params={"id_token": credential},
                timeout=8,
            )
            google_response.raise_for_status()
            payload = google_response.json()
        except requests.RequestException:
            return Response(
                {"detail": "Unable to verify Google credential."},
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
