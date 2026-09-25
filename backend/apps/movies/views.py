from django.conf import settings
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from apps.common.downloads import build_download_url, download_rate_limit
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
        if not (movie.external_url or movie.video_file):
            return Response(
                {"detail": "No download source is available for this movie."},
                status=status.HTTP_404_NOT_FOUND,
            )

        download_rate_limit(request, f"movie:{movie.id}")
        target_url = movie.external_url or build_download_url(movie.video_file)
        return Response(
            {
                "title": movie.title,
                "url": target_url,
                "expires_in": None if movie.external_url else settings.DOWNLOAD_LINK_EXPIRY_SECONDS,
                "source_type": movie.source_type,
            }
        )
