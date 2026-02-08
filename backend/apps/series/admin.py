from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Series, Season, Episode

@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):
    list_display = ('title', 'season', 'episode_number', 'release_date')
    list_filter = ('season__series', 'season')
    search_fields = ('title', 'plot')
    autocomplete_fields = ['season']
    prepopulated_fields = {"slug": ("title",)}

    fieldsets = (
        ("Episode Information", {
            'fields': (('episode_number', 'title', 'slug'), 'plot', 'thumbnail'),
        }),
        ("Video Source", {
            'fields': ('source_type', 'video_file', 'external_url'),
        }),
        ("Metadata", {
            'fields': (('runtime', 'release_date'),),
        }),
    )

class EpisodeInline(admin.TabularInline):
    model = Episode
    extra = 0
    fields = ('episode_number', 'title', 'view_episode_link')
    readonly_fields = ('view_episode_link',)

    def view_episode_link(self, obj):
        if obj.id:
            url = reverse('admin:series_episode_change', args=[obj.id])
            return format_html('<a href="{}">Edit Full Episode</a>', url)
        return "-"

@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = ('season_label', 'series', 'episode_count_link')
    list_filter = ('series',)
    search_fields = ('title', 'description')
    autocomplete_fields = ['series']
    inlines = [EpisodeInline]
    prepopulated_fields = {"slug": ("season_number",)} # Simple slug for season

    def season_label(self, obj):
        return str(obj)
    season_label.short_description = 'Season'

    def episode_count_link(self, obj):
        count = obj.episodes.count()
        url = reverse('admin:series_episode_changelist') + f'?season__id__exact={obj.id}'
        return format_html('<a href="{}">{} Episodes</a>', url, count)
    episode_count_link.short_description = 'Episodes'

class SeasonInline(admin.TabularInline):
    model = Season
    extra = 0
    fields = ('season_number', 'title', 'view_season_link')
    readonly_fields = ('view_season_link',)

    def view_season_link(self, obj):
        if obj.id:
            url = reverse('admin:series_season_change', args=[obj.id])
            return format_html('<a href="{}">Edit Full Season</a>', url)
        return "-"

@admin.register(Series)
class SeriesAdmin(admin.ModelAdmin):
    list_display = ('title', 'first_air_date', 'rating', 'view_seasons_link')
    search_fields = ('title',)
    autocomplete_fields = ['categories']
    prepopulated_fields = {"slug": ("title",)}
    
    fieldsets = (
        ("Content Information", {
            'fields': (('title', 'slug'), 'description', 'categories'),
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

    def view_seasons_link(self, obj):
        count = obj.seasons.count()
        url = reverse('admin:series_season_changelist') + f'?series__id__exact={obj.id}'
        return format_html('<a href="{}">{} Seasons</a>', url, count)
    view_seasons_link.short_description = 'Seasons'
