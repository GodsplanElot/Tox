from rest_framework import serializers
from .models import Movie
from apps.categories.serializers import CategorySerializer

class MovieSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'slug', 'description', 'poster',
            'rating', 'release_date', 'runtime', 'categories',
            'source_type', 'video_file', 'external_url', 'created_at'
        ]
