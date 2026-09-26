from rest_framework import serializers
from .models import Movie
from apps.categories.serializers import CategorySerializer

class MovieSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    download_available = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'slug', 'description', 'poster', 'hero_image',
            'rating', 'release_date', 'runtime', 'categories',
            'source_type', 'download_available', 'created_at'
        ]

    def get_download_available(self, obj):
        return bool(obj.external_url or obj.video_file or obj.bunny_video_id)


class MovieListSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'slug', 'description', 'poster', 'hero_image',
            'rating', 'release_date', 'runtime', 'categories', 'created_at'
        ]
