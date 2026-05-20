from rest_framework import viewsets
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
