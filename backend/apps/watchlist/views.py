from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import WatchlistItem
from .serializers import WatchlistItemSerializer, WatchlistCreateSerializer
from django.contrib.contenttypes.models import ContentType

class WatchlistViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return WatchlistCreateSerializer
        return WatchlistItemSerializer

    def get_queryset(self):
        return WatchlistItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Helper to check if item is in watchlist (for frontend toggle state)
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Optional filtering by content_type and object_id to check status
        content_type_id = request.query_params.get('content_type')
        object_id = request.query_params.get('object_id')
        
        if content_type_id and object_id:
            queryset = queryset.filter(content_type_id=content_type_id, object_id=object_id)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
