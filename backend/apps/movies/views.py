from django.conf import settings
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from apps.common.downloads import (
    build_download_url,
    build_local_download_url,
    download_rate_limit,
    local_video_download_response,
    uses_local_video_storage,
    validate_local_download_token,
)
from apps.common.bunny import BunnyStreamClient, BunnyStreamError
from .models import Movie
from .serializers import MovieListSerializer, MovieSerializer

class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.all()
    lookup_field = 'slug'

    def get_queryset(self):
        return (
            Movie.objects.filter(status=Movie.STATUS_PUBLISHED)
            .prefetch_related("categories")
            .order_by('-created_at')
        )

    def get_serializer_class(self):
        if self.action == "list":
            return MovieListSerializer
        return MovieSerializer

    @action(detail=True, methods=["post"], url_path="download")
    def download(self, request, slug=None):
        movie = self.get_object()
        if not (movie.external_url or movie.video_file or movie.bunny_video_id):
            return Response(
                {"detail": "No download source is available for this movie."},
                status=status.HTTP_404_NOT_FOUND,
            )

        download_rate_limit(request, f"movie:{movie.id}")
        if movie.bunny_video_id and movie.bunny_status == "ready":
            try:
                target_url = BunnyStreamClient().download_url(
                    movie.bunny_video_id,
                    movie.bunny_available_resolutions,
                )
            except BunnyStreamError:
                return Response(
                    {"detail": "The video download service is unavailable."},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )
            expires_in = settings.DOWNLOAD_LINK_EXPIRY_SECONDS
        elif movie.external_url:
            target_url = movie.external_url
            expires_in = None
        elif uses_local_video_storage(movie.video_file):
            target_url = build_local_download_url(
                request,
                "movie-download-file",
                {"slug": movie.slug},
                movie.video_file,
            )
            expires_in = settings.DOWNLOAD_LINK_EXPIRY_SECONDS
        else:
            if movie.bunny_video_id:
                return Response(
                    {"detail": "This video is still processing."},
                    status=status.HTTP_409_CONFLICT,
                )
            target_url = build_download_url(movie.video_file)
            expires_in = settings.DOWNLOAD_LINK_EXPIRY_SECONDS

        return Response(
            {
                "title": movie.title,
                "url": target_url,
                "expires_in": expires_in,
                "source_type": movie.source_type,
            }
        )

    @action(detail=True, methods=["get"], url_path="download-file", url_name="download-file")
    def download_file(self, request, slug=None):
        movie = self.get_object()
        if not movie.video_file or not uses_local_video_storage(movie.video_file):
            return Response(
                {"detail": "No local video file is available for this movie."},
                status=status.HTTP_404_NOT_FOUND,
            )

        validate_local_download_token(request.query_params.get("token"), movie.video_file.name)
        download_rate_limit(request, f"movie:{movie.id}")
        return local_video_download_response(movie.video_file)
