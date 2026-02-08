from rest_framework import serializers
from .models import Series, Season, Episode
from apps.categories.serializers import CategorySerializer

class EpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = [
            'id', 'episode_number', 'title', 'slug', 'plot',
            'thumbnail', 'runtime', 'release_date',
            'source_type', 'video_file', 'external_url'
        ]

class SeasonSerializer(serializers.ModelSerializer):
    episodes = EpisodeSerializer(many=True, read_only=True)
    
    class Meta:
        model = Season
        fields = ['id', 'season_number', 'title', 'slug', 'description', 'poster', 'episodes']

class SeriesSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    seasons = SeasonSerializer(many=True, read_only=True)

    class Meta:
        model = Series
        fields = [
            'id', 'title', 'slug', 'description', 'poster', 'backdrop',
            'trailer_url', 'rating', 'first_air_date', 'categories',
            'seasons', 'created_at'
        ]
