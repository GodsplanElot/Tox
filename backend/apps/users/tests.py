from django.contrib.auth import get_user_model
from django.test import override_settings
from unittest.mock import Mock, patch
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class AuthApiTests(APITestCase):
    def test_register_returns_tokens_and_user(self):
        response = self.client.post(
            "/api/users/register/",
            {
                "username": "toxuser",
                "email": "tox@example.com",
                "password": "StrongPass123",
                "password_confirm": "StrongPass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["email"], "tox@example.com")
        self.assertTrue(User.objects.filter(username="toxuser").exists())

    def test_register_rejects_password_mismatch(self):
        response = self.client.post(
            "/api/users/register/",
            {
                "username": "toxuser",
                "email": "tox@example.com",
                "password": "StrongPass123",
                "password_confirm": "WrongPass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password_confirm", response.data)

    def test_login_accepts_email_and_me_requires_token(self):
        User.objects.create_user(
            username="toxuser",
            email="tox@example.com",
            password="StrongPass123",
        )

        login_response = self.client.post(
            "/api/users/login/",
            {"username": "tox@example.com", "password": "StrongPass123"},
            format="json",
        )

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_response.data)

        anonymous_response = self.client.get("/api/users/me/")
        self.assertEqual(anonymous_response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}"
        )
        me_response = self.client.get("/api/users/me/")

        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data["username"], "toxuser")

    @override_settings(GOOGLE_OAUTH_CLIENT_ID="google-client-id")
    @patch("apps.users.views.requests.get")
    def test_google_login_creates_user_and_returns_tokens(self, mock_get):
        google_response = Mock()
        google_response.json.return_value = {
            "aud": "google-client-id",
            "email": "googleuser@example.com",
            "email_verified": "true",
            "given_name": "Google",
            "family_name": "User",
        }
        google_response.raise_for_status.return_value = None
        mock_get.return_value = google_response

        response = self.client.post(
            "/api/users/google/",
            {"credential": "google-id-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["email"], "googleuser@example.com")
        self.assertTrue(
            User.objects.filter(email="googleuser@example.com", first_name="Google").exists()
        )

    @override_settings(GOOGLE_OAUTH_CLIENT_ID="google-client-id")
    @patch("apps.users.views.requests.get")
    def test_google_login_reuses_existing_user(self, mock_get):
        existing_user = User.objects.create_user(
            username="existing",
            email="googleuser@example.com",
            password="StrongPass123",
        )
        google_response = Mock()
        google_response.json.return_value = {
            "aud": "google-client-id",
            "email": "googleuser@example.com",
            "email_verified": "true",
        }
        google_response.raise_for_status.return_value = None
        mock_get.return_value = google_response

        response = self.client.post(
            "/api/users/google/",
            {"credential": "google-id-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["id"], existing_user.id)
        self.assertEqual(User.objects.filter(email="googleuser@example.com").count(), 1)

    @override_settings(GOOGLE_OAUTH_CLIENT_ID="google-client-id")
    @patch("apps.users.views.requests.get")
    def test_google_login_rejects_invalid_audience(self, mock_get):
        google_response = Mock()
        google_response.json.return_value = {
            "aud": "wrong-client-id",
            "email": "googleuser@example.com",
            "email_verified": "true",
        }
        google_response.raise_for_status.return_value = None
        mock_get.return_value = google_response

        response = self.client.post(
            "/api/users/google/",
            {"credential": "google-id-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(email="googleuser@example.com").exists())
