from rest_framework import serializers
from .models import WatchlistItem
from apps.movies.models import Movie
from apps.series.models import Series
from django.contrib.contenttypes.models import ContentType

class WatchlistItemSerializer(serializers.ModelSerializer):
    content_object_detail = serializers.SerializerMethodField()
    content_type_name = serializers.SlugRelatedField(
        source='content_type',
        slug_field='model',
        read_only=True
    )

    class Meta:
        model = WatchlistItem
        fields = ['id', 'content_type', 'content_type_name', 'object_id', 'content_object_detail', 'added_at']
        read_only_fields = ['user', 'added_at']

    def get_content_object_detail(self, obj):
        content_object = obj.content_object
        if isinstance(content_object, Movie):
            return {
                "title": content_object.title,
                "slug": content_object.slug,
                "poster": content_object.poster.url if content_object.poster else None,
                "type": "movie"
            }
        elif isinstance(content_object, Series):
            return {
                "title": content_object.title,
                "slug": content_object.slug,
                "poster": content_object.poster.url if content_object.poster else None,
                "type": "series"
            }
        return None

class WatchlistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchlistItem
        fields = ['content_type', 'object_id']

    def validate(self, data):
        # Ensure the object exists
        content_type = data['content_type']
        object_id = data['object_id']
        model_class = content_type.model_class()
        
        if not model_class.objects.filter(id=object_id).exists():
            raise serializers.ValidationError("Object does not exist.")
            
        return data
