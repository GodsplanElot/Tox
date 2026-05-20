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


class EpisodeSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = [
            'id', 'episode_number', 'title', 'slug', 'plot',
            'thumbnail', 'runtime', 'release_date',
            'source_type', 'video_file', 'external_url'
        ]

class SeasonSerializer(serializers.ModelSerializer):
    episodes = serializers.SerializerMethodField()
    
    class Meta:
        model = Season
        fields = ['id', 'season_number', 'title', 'slug', 'description', 'poster', 'episodes']

    def get_episodes(self, obj):
        episodes = getattr(obj, 'published_episodes', None)
        if episodes is None:
            episodes = obj.episodes.filter(status=Episode.STATUS_PUBLISHED)
        return EpisodeSummarySerializer(episodes, many=True, context=self.context).data

class SeriesSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    seasons = serializers.SerializerMethodField()

    class Meta:
        model = Series
        fields = [
            'id', 'title', 'slug', 'description', 'poster',
            'trailer_url', 'rating', 'first_air_date', 'categories',
            'seasons', 'created_at'
        ]

    def get_seasons(self, obj):
        seasons = getattr(obj, 'published_seasons', None)
        if seasons is None:
            seasons = obj.seasons.filter(status=Season.STATUS_PUBLISHED)
        return SeasonSerializer(seasons, many=True, context=self.context).data


class SeriesListSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Series
        fields = [
            'id', 'title', 'slug', 'description', 'poster',
            'trailer_url', 'rating', 'first_air_date', 'categories',
            'created_at'
        ]
