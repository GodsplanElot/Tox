"""Reusable Django Admin controls for secure Bunny Stream uploads."""

import json

from django.conf import settings
from django.http import Http404, JsonResponse
from django.urls import path, reverse

from .bunny import BunnyStreamClient, BunnyStreamError, bunny_is_configured, bunny_video_is_ready


class BunnyVideoAdminMixin:
    change_form_template = "admin/common/bunny_change_form.html"

    class Media:
        js = ("admin/js/bunny_upload.js",)
        css = {"all": ("admin/css/bunny_upload.css",)}

    def bunny_stream_video(self, obj):
        if not obj or not obj.bunny_video_id:
            return "Save this draft, then use the Bunny Stream upload panel below."
        progress = f" ({obj.bunny_encode_progress}%)" if obj.bunny_status else ""
        return f"{obj.bunny_status or 'created'}{progress}"

    bunny_stream_video.short_description = "Bunny Stream status"

    def get_urls(self):
        urls = super().get_urls()
        opts = self.model._meta
        custom_urls = [
            path(
                "<path:object_id>/bunny-upload-session/",
                self.admin_site.admin_view(self.bunny_upload_session),
                name=f"{opts.app_label}_{opts.model_name}_bunny_upload_session",
            ),
            path(
                "<path:object_id>/bunny-upload-status/",
                self.admin_site.admin_view(self.bunny_upload_status),
                name=f"{opts.app_label}_{opts.model_name}_bunny_upload_status",
            ),
        ]
        return custom_urls + urls

    def _bunny_object(self, request, object_id):
        obj = self.get_object(request, object_id)
        if obj is None:
            raise Http404
        if not self.has_change_permission(request, obj):
            raise Http404
        return obj

    def _sync_bunny_status(self, obj):
        payload = BunnyStreamClient().get_video(str(obj.bunny_video_id))
        progress = max(0, min(100, int(payload.get("encodeProgress") or 0)))
        obj.bunny_encode_progress = progress
        obj.bunny_status = "ready" if bunny_video_is_ready(payload) else "processing"
        obj.bunny_available_resolutions = payload.get("availableResolutions") or ""
        obj.save(
            update_fields=[
                "bunny_encode_progress",
                "bunny_status",
                "bunny_available_resolutions",
            ]
        )
        return obj

    def bunny_upload_session(self, request, object_id):
        if request.method != "POST":
            return JsonResponse({"detail": "POST is required."}, status=405)
        if not bunny_is_configured():
            return JsonResponse({"detail": "Bunny Stream is not configured."}, status=503)

        obj = self._bunny_object(request, object_id)
        try:
            session = BunnyStreamClient().create_upload_session(str(obj))
        except BunnyStreamError as exc:
            return JsonResponse({"detail": str(exc)}, status=502)

        obj.bunny_video_id = session.video_id
        obj.bunny_status = "uploading"
        obj.bunny_encode_progress = 0
        obj.source_type = "upload"
        obj.save(update_fields=["bunny_video_id", "bunny_status", "bunny_encode_progress", "source_type"])
        return JsonResponse(
            {
                "endpoint": session.endpoint,
                "headers": session.headers,
                "expires_at": session.expires_at,
                "video_id": session.video_id,
            }
        )

    def bunny_upload_status(self, request, object_id):
        if request.method != "GET":
            return JsonResponse({"detail": "GET is required."}, status=405)
        obj = self._bunny_object(request, object_id)
        if not obj.bunny_video_id:
            return JsonResponse({"status": "not_uploaded", "progress": 0})
        try:
            obj = self._sync_bunny_status(obj)
        except BunnyStreamError as exc:
            return JsonResponse({"detail": str(exc)}, status=502)
        return JsonResponse(
            {
                "status": obj.bunny_status,
                "progress": obj.bunny_encode_progress,
                "video_id": str(obj.bunny_video_id),
            }
        )

    def render_change_form(self, request, context, add=False, change=False, form_url="", obj=None):
        if obj and bunny_is_configured() and self.has_change_permission(request, obj):
            opts = self.model._meta
            context["bunny_upload_config"] = {
                "sessionUrl": reverse(
                    f"admin:{opts.app_label}_{opts.model_name}_bunny_upload_session",
                    args=[obj.pk],
                ),
                "statusUrl": reverse(
                    f"admin:{opts.app_label}_{opts.model_name}_bunny_upload_status",
                    args=[obj.pk],
                ),
                "status": obj.bunny_status or "not_uploaded",
                "progress": obj.bunny_encode_progress,
            }
        return super().render_change_form(request, context, add, change, form_url, obj)
