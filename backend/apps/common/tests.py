import base64
import hashlib
from unittest.mock import patch

from django.test import SimpleTestCase, override_settings

from apps.common.bunny import BunnyStreamClient


@override_settings(
    VIDEO_PROVIDER="bunny_stream",
    BUNNY_STREAM_LIBRARY_ID="123",
    BUNNY_STREAM_CDN_HOSTNAME="example.b-cdn.net",
    BUNNY_STREAM_API_KEY="api-key",
    BUNNY_STREAM_TOKEN_AUTH_KEY="token-key",
)
class BunnyHlsUrlTests(SimpleTestCase):
    @patch("apps.common.bunny.time.time", return_value=1_000_000)
    def test_hls_url_signs_video_directory_in_path(self, _time):
        video_id = "abc-123"
        expires = 1_000_000 + 14400
        expected_token = base64.urlsafe_b64encode(
            hashlib.sha256(
                f"token-key/{video_id}/{expires}token_path=/{video_id}/".encode("utf-8")
            ).digest()
        ).decode("ascii").rstrip("=")

        url = BunnyStreamClient().hls_url(video_id)

        # The token lives in the path so relative sub-playlist and segment
        # requests made by the player stay authorized.
        self.assertEqual(
            url,
            f"https://example.b-cdn.net/bcdn_token={expected_token}&expires={expires}"
            f"&token_path=%2F{video_id}%2F/{video_id}/playlist.m3u8",
        )
