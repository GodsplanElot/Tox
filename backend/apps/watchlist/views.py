from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import WatchlistItem
from .serializers import WatchlistItemSerializer, WatchlistCreateSerializer

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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item, created = WatchlistItem.objects.get_or_create(
            user=request.user,
            content_type=serializer.validated_data["content_type"],
            object_id=serializer.validated_data["object_id"],
        )
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(WatchlistItemSerializer(item).data, status=status_code)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Helper to check if item is in watchlist (for frontend toggle state)
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Optional filtering by content_type model name and object_id to check status
        content_type_model = request.query_params.get('content_type')
        object_id = request.query_params.get('object_id')
        
        if content_type_model and object_id:
            queryset = queryset.filter(content_type__model=content_type_model, object_id=object_id)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
