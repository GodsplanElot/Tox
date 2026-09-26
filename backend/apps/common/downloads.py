from pathlib import Path
from urllib.parse import quote, urlencode

from django.conf import settings
from django.core.cache import cache
from django.core import signing
from django.http import FileResponse, HttpResponse
from django.urls import reverse
from django.utils.http import content_disposition_header
from rest_framework.exceptions import NotFound, PermissionDenied, Throttled

from .storage import LocalVideoStorage


LOCAL_DOWNLOAD_TOKEN_SALT = "toxicreels.local-video-download"


def get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip()
    return request.META.get("REMOTE_ADDR", "unknown")


def download_rate_limit(request, scope):
    limit = getattr(settings, "DOWNLOAD_LINK_RATE_LIMIT", 20)
    window_seconds = getattr(settings, "DOWNLOAD_LINK_RATE_WINDOW_SECONDS", 3600)
    if limit <= 0:
        return

    ip_address = get_client_ip(request)
    cache_key = f"download-link:{scope}:{ip_address}"
    current = cache.get(cache_key, 0)
    if current >= limit:
        raise Throttled(
            detail="Too many download link requests. Please try again later.",
            wait=window_seconds,
        )

    cache.set(cache_key, current + 1, timeout=window_seconds)


def build_download_url(file_field):
    if not file_field:
        return ""

    storage = file_field.storage
    expires_in = getattr(settings, "DOWNLOAD_LINK_EXPIRY_SECONDS", 900)
    try:
        return storage.url(file_field.name, expire=expires_in)
    except TypeError:
        return file_field.url


def uses_local_video_storage(file_field):
    return bool(file_field and isinstance(file_field.storage, LocalVideoStorage))


def build_local_download_url(request, url_name, url_kwargs, file_field):
    token = signing.dumps(
        {"file_name": file_field.name},
        salt=LOCAL_DOWNLOAD_TOKEN_SALT,
        compress=True,
    )
    endpoint = reverse(url_name, kwargs=url_kwargs)
    return request.build_absolute_uri(f"{endpoint}?{urlencode({'token': token})}")


def validate_local_download_token(token, expected_file_name):
    if not token:
        raise PermissionDenied("A download token is required.")

    try:
        payload = signing.loads(
            token,
            salt=LOCAL_DOWNLOAD_TOKEN_SALT,
            max_age=settings.DOWNLOAD_LINK_EXPIRY_SECONDS,
        )
    except signing.SignatureExpired as exc:
        raise PermissionDenied("This download link has expired.") from exc
    except signing.BadSignature as exc:
        raise PermissionDenied("This download link is invalid.") from exc

    if payload.get("file_name") != expected_file_name:
        raise PermissionDenied("This download link does not match the requested file.")


def local_video_download_response(file_field):
    try:
        file_path = Path(file_field.path)
    except NotImplementedError as exc:
        raise NotFound("The requested video is not stored locally.") from exc

    if not file_path.is_file():
        raise NotFound("The requested video file is unavailable.")

    filename = Path(file_field.name).name
    if settings.DEBUG:
        return FileResponse(
            file_path.open("rb"),
            as_attachment=True,
            filename=filename,
        )

    response = HttpResponse()
    response["Content-Disposition"] = content_disposition_header("attachment", filename)
    response["X-Accel-Redirect"] = f"/media/{quote(file_field.name, safe='/')}"
    response["X-Content-Type-Options"] = "nosniff"
    return response
