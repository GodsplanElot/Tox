from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ConfirmPasswordResetView,
    GoogleLoginView,
    LoginView,
    MeView,
    RegisterView,
    RequestPasswordResetView,
    ResendOtpView,
    VerifyEmailView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify_email"),
    path("resend-otp/", ResendOtpView.as_view(), name="resend_otp"),
    path("login/", LoginView.as_view(), name="token_obtain_pair"),
    path("password-reset/", RequestPasswordResetView.as_view(), name="password_reset"),
    path("password-reset/confirm/", ConfirmPasswordResetView.as_view(), name="password_reset_confirm"),
    path("google/", GoogleLoginView.as_view(), name="google_login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="me"),
]
