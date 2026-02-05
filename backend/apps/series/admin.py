from django.contrib import admin
import nested_admin
from .models import Series, Season, Episode, EpisodeVideo
from apps.media.models import VideoSource

class EpisodeVideoInline(nested_admin.NestedTabularInline):
    model = EpisodeVideo
    extra = 1
    autocomplete_fields = ['video_source']
    verbose_name = "Linked Media"
    verbose_name_plural = "Linked Media (Assign from Library)"

class EpisodeInline(nested_admin.NestedStackedInline):
    model = Episode
    extra = 0
    sortable_field_name = "episode_number"
    fieldsets = (
        (None, {
            'fields': (('episode_number', 'title'), 'plot', ('runtime', 'release_date'), 'thumbnail'),
        }),
    )
    inlines = [EpisodeVideoInline]

class SeasonInline(nested_admin.NestedStackedInline):
    model = Season
    extra = 0
    sortable_field_name = "season_number"
    fieldsets = (
        (None, {
            'fields': (('season_number', 'title'), 'description', 'poster'),
        }),
    )
    inlines = [EpisodeInline]

@admin.register(Series)
class SeriesAdmin(nested_admin.NestedModelAdmin):
    list_display = ('title', 'first_air_date', 'rating')
    search_fields = ('title',)
    autocomplete_fields = ['categories']
    
    fieldsets = (
        ("Content Information", {
            'fields': ('title', 'description', 'categories'),
        }),
        ("Media Assets", {
            'fields': (('poster', 'backdrop'), 'trailer_url'),
            'description': "Links to images and trailer content",
        }),
        ("Metadata", {
            'fields': (('rating', 'first_air_date'),),
        }),
    )
    
    inlines = [SeasonInline]

# Keep existing standalone registrations commented out or remove them
# to avoid clutter, as they are now managed within Series.
