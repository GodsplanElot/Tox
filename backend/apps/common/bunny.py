"""Backend-only Bunny Stream integration helpers."""

import base64
import hashlib
import time
from dataclasses import dataclass
from urllib.parse import urlencode

import requests
from django.conf import settings


class BunnyStreamError(Exception):
    """A Bunny Stream API request could not be completed."""


@dataclass(frozen=True)
class BunnyUploadSession:
    video_id: str
    endpoint: str
    headers: dict[str, str]
    expires_at: int


def bunny_is_configured():
    return bool(
        settings.VIDEO_PROVIDER == "bunny_stream"
        and settings.BUNNY_STREAM_LIBRARY_ID
        and settings.BUNNY_STREAM_API_KEY
        and settings.BUNNY_STREAM_CDN_HOSTNAME
        and settings.BUNNY_STREAM_TOKEN_AUTH_KEY
    )


class BunnyStreamClient:
    api_base_url = "https://video.bunnycdn.com"
    tus_endpoint = "https://video.bunnycdn.com/tusupload"

    def __init__(self):
        if not bunny_is_configured():
            raise BunnyStreamError("Bunny Stream is not configured on this server.")
        self.library_id = settings.BUNNY_STREAM_LIBRARY_ID
        self.api_key = settings.BUNNY_STREAM_API_KEY
        self.cdn_hostname = settings.BUNNY_STREAM_CDN_HOSTNAME
        self.token_auth_key = settings.BUNNY_STREAM_TOKEN_AUTH_KEY

    @property
    def request_headers(self):
        return {"AccessKey": self.api_key, "Content-Type": "application/json"}

    def _request(self, method, path, **kwargs):
        try:
            response = requests.request(
                method,
                f"{self.api_base_url}{path}",
                headers=self.request_headers,
                timeout=20,
                **kwargs,
            )
        except requests.RequestException as exc:
            raise BunnyStreamError("Could not connect to Bunny Stream.") from exc

        if not response.ok:
            raise BunnyStreamError("Bunny Stream rejected the request.")
        return response.json() if response.content else {}

    def create_video(self, title):
        return self._request(
            "POST",
            f"/library/{self.library_id}/videos",
            json={"title": title},
        )

    def get_video(self, video_id):
        return self._request(
            "GET",
            f"/library/{self.library_id}/videos/{video_id}",
        )

    def create_upload_session(self, title):
        video = self.create_video(title)
        video_id = video.get("guid")
        if not video_id:
            raise BunnyStreamError("Bunny Stream did not return a video ID.")

        expires_at = int(time.time()) + settings.BUNNY_STREAM_UPLOAD_EXPIRY_SECONDS
        signature = hashlib.sha256(
            f"{self.library_id}{self.api_key}{expires_at}{video_id}".encode("utf-8")
        ).hexdigest()
        return BunnyUploadSession(
            video_id=video_id,
            endpoint=self.tus_endpoint,
            headers={
                "AuthorizationSignature": signature,
                "AuthorizationExpire": str(expires_at),
                "VideoId": video_id,
                "LibraryId": self.library_id,
            },
            expires_at=expires_at,
        )

    def signed_cdn_url(self, path, expires_in=None):
        expires = int(time.time()) + (expires_in or settings.DOWNLOAD_LINK_EXPIRY_SECONDS)
        token = base64.urlsafe_b64encode(
            hashlib.sha256(f"{self.token_auth_key}{path}{expires}".encode("utf-8")).digest()
        ).decode("ascii").rstrip("=")
        return f"https://{self.cdn_hostname}{path}?{urlencode({'token': token, 'expires': expires})}"

    def download_url(self, video_id, available_resolutions=""):
        heights = []
        for resolution in available_resolutions.split(","):
            value = resolution.strip().lower().removesuffix("p")
            if value.isdigit():
                heights.append(int(value))
        height = max(heights) if heights else 1080
        return self.signed_cdn_url(f"/{video_id}/play_{height}p.mp4")


def bunny_video_is_ready(payload):
    return bool(payload.get("hasMP4Fallback") and payload.get("encodeProgress") == 100)
