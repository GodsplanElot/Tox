from rest_framework import serializers
from .models import Movie
from apps.categories.serializers import CategorySerializer

class MovieSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    download_available = serializers.SerializerMethodField()
    bunny_ready = serializers.SerializerMethodField()
    has_external_url = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'slug', 'description', 'poster', 'hero_image',
            'rating', 'release_date', 'runtime', 'categories',
            'source_type', 'download_available', 'bunny_ready', 'has_external_url',
            'created_at',
        ]

    def get_download_available(self, obj):
        return bool(obj.external_url or obj.video_file or obj.bunny_video_id)

    def get_bunny_ready(self, obj):
        return bool(obj.bunny_video_id and obj.bunny_status == "ready")

    def get_has_external_url(self, obj):
        return bool(obj.external_url)


class MovieListSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'slug', 'description', 'poster', 'hero_image',
            'rating', 'release_date', 'runtime', 'categories', 'created_at'
        ]
