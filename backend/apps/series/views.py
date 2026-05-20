from rest_framework import viewsets
from django.db.models import Prefetch

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
