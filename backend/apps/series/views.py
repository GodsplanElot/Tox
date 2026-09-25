from django.conf import settings
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Prefetch

from apps.common.downloads import build_download_url, download_rate_limit
from .models import Series
from .models import Episode, Season
from .serializers import SeriesListSerializer, SeriesSerializer

class SeriesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Series.objects.all()
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = (
            Series.objects.filter(status=Series.STATUS_PUBLISHED)
            .prefetch_related("categories")
            .order_by('-created_at')
        )

        if self.action == "retrieve":
            published_episodes = Episode.objects.filter(
                status=Episode.STATUS_PUBLISHED
            ).order_by("episode_number")
            published_seasons = (
                Season.objects.filter(status=Season.STATUS_PUBLISHED)
                .prefetch_related(
                    Prefetch(
                        "episodes",
                        queryset=published_episodes,
                        to_attr="published_episodes",
                    )
                )
                .order_by("season_number")
            )
            queryset = queryset.prefetch_related(
                Prefetch("seasons", queryset=published_seasons, to_attr="published_seasons")
            )

        return queryset

    def get_serializer_class(self):
        if self.action == "list":
            return SeriesListSerializer
        return SeriesSerializer

    @action(
        detail=True,
        methods=["post"],
        url_path=r"episodes/(?P<episode_slug>[^/.]+)/download",
    )
    def episode_download(self, request, slug=None, episode_slug=None):
        series = self.get_object()
        episode = Episode.objects.filter(
            season__series=series,
            slug=episode_slug,
            status=Episode.STATUS_PUBLISHED,
            season__status=Season.STATUS_PUBLISHED,
        ).first()

        if episode is None:
            return Response(
                {"detail": "Episode not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not (episode.external_url or episode.video_file):
            return Response(
                {"detail": "No download source is available for this episode."},
                status=status.HTTP_404_NOT_FOUND,
            )

        download_rate_limit(request, f"episode:{episode.id}")
        target_url = episode.external_url or build_download_url(episode.video_file)
        return Response(
            {
                "title": episode.title,
                "url": target_url,
                "expires_in": None
                if episode.external_url
                else settings.DOWNLOAD_LINK_EXPIRY_SECONDS,
                "source_type": episode.source_type,
            }
        )
