from rest_framework import viewsets
from .models import Series
from .serializers import SeriesSerializer

class SeriesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Series.objects.all().order_by('-created_at')
    serializer_class = SeriesSerializer
    lookup_field = 'slug'
