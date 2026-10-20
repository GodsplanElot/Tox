from django.db.models import Count, Q
from rest_framework import viewsets

from apps.movies.models import Movie
from apps.series.models import Series
from .models import Category
from .serializers import CategoryWithCountsSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()  # lets the router derive the "category" basename
    serializer_class = CategoryWithCountsSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return (
            Category.objects.filter(is_active=True)
            .annotate(
                movie_count=Count(
                    "movies",
                    filter=Q(movies__status=Movie.STATUS_PUBLISHED),
                    distinct=True,
                ),
                series_count=Count(
                    "series",
                    filter=Q(series__status=Series.STATUS_PUBLISHED),
                    distinct=True,
                ),
            )
            .order_by('name')
        )
