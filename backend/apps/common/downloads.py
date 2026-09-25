from django.conf import settings
from django.core.cache import cache
from rest_framework.exceptions import Throttled


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
