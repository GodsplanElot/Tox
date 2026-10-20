from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']


class CategoryWithCountsSerializer(CategorySerializer):
    # Annotated by CategoryViewSet; only published titles are counted.
    movie_count = serializers.IntegerField(read_only=True, default=0)
    series_count = serializers.IntegerField(read_only=True, default=0)

    class Meta(CategorySerializer.Meta):
        fields = CategorySerializer.Meta.fields + ['movie_count', 'series_count']
