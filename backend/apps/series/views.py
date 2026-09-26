from django.conf import settings
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Prefetch

from apps.common.downloads import (
    build_download_url,
    build_local_download_url,
    download_rate_limit,
    local_video_download_response,
    uses_local_video_storage,
    validate_local_download_token,
)
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
        if episode.external_url:
            target_url = episode.external_url
            expires_in = None
        elif uses_local_video_storage(episode.video_file):
            target_url = build_local_download_url(
                request,
                "series-episode-download-file",
                {"slug": series.slug, "episode_slug": episode.slug},
                episode.video_file,
            )
            expires_in = settings.DOWNLOAD_LINK_EXPIRY_SECONDS
        else:
            target_url = build_download_url(episode.video_file)
            expires_in = settings.DOWNLOAD_LINK_EXPIRY_SECONDS

        return Response(
            {
                "title": episode.title,
                "url": target_url,
                "expires_in": expires_in,
                "source_type": episode.source_type,
            }
        )

    @action(
        detail=True,
        methods=["get"],
        url_path=r"episodes/(?P<episode_slug>[^/.]+)/download-file",
        url_name="episode-download-file",
    )
    def episode_download_file(self, request, slug=None, episode_slug=None):
        series = self.get_object()
        episode = Episode.objects.filter(
            season__series=series,
            slug=episode_slug,
            status=Episode.STATUS_PUBLISHED,
            season__status=Season.STATUS_PUBLISHED,
        ).first()

        if episode is None or not episode.video_file or not uses_local_video_storage(episode.video_file):
            return Response(
                {"detail": "No local video file is available for this episode."},
                status=status.HTTP_404_NOT_FOUND,
            )

        validate_local_download_token(request.query_params.get("token"), episode.video_file.name)
        download_rate_limit(request, f"episode:{episode.id}")
        return local_video_download_response(episode.video_file)
