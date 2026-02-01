from django.contrib import admin
import nested_admin
from .models import Series, Season, Episode, EpisodeVideo
from apps.media.models import VideoSource

class VideoSourceInline(nested_admin.NestedTabularInline):
    model = VideoSource
    extra = 0
    fk_name = 'episode'
    fields = ('source_type', 'video_file', 'external_url', 'label')

class EpisodeInline(nested_admin.NestedTabularInline):
    model = Episode
    extra = 0
    inlines = [VideoSourceInline]
    sortable_field_name = "episode_number"

class SeasonInline(nested_admin.NestedTabularInline):
    model = Season
    extra = 0
    inlines = [EpisodeInline]
    sortable_field_name = "season_number"

@admin.register(Series)
class SeriesAdmin(nested_admin.NestedModelAdmin):
    inlines = [SeasonInline]
    list_display = ('title', 'first_air_date', 'rating')
    search_fields = ('title',)

# Unregister if previously registered via site.register
# admin.site.register(Season)
# admin.site.register(Episode)
# admin.site.register(EpisodeVideo)
