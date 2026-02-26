from django.contrib import admin, messages
from django.utils.html import format_html
from django.urls import reverse
from .models import Series, Season, Episode
from apps.common.tmdb import TMDBService

@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):
    list_display = ('title', 'parent_season_link', 'episode_number', 'release_date')
    list_filter = ('season__series', 'season')
    search_fields = ('title', 'plot')
    autocomplete_fields = ['season']
    prepopulated_fields = {"slug": ("title",)}

    fieldsets = (
        ("Episode Information", {
            'fields': ('season', ('episode_number', 'title', 'slug'), 'plot', 'thumbnail'),
        }),
        ("Video Source", {
            'fields': ('source_type', 'video_file', 'external_url'),
        }),
        ("Metadata", {
            'fields': (('runtime', 'release_date'),),
        }),
    )

    def parent_season_link(self, obj):
        url = reverse('admin:series_season_change', args=[obj.season.id])
        return format_html('<a href="{}">📂 {}</a>', url, obj.season)
    parent_season_link.short_description = 'Season (Back)'

    def has_module_permission(self, request):
        return False  # Hide from Admin Index


class EpisodeInline(admin.TabularInline):
    model = Episode
    extra = 0
    fields = ('episode_number', 'title', 'view_episode_link')
    readonly_fields = ('view_episode_link',)

    def view_episode_link(self, obj):
        if obj.id:
            url = reverse('admin:series_episode_change', args=[obj.id])
            return format_html('<a href="{}">⚙️ Edit Episode Settings</a>', url)
        return "-"


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = ('season_label', 'parent_series_link', 'episode_count_link')
    list_filter = ('series',)
    search_fields = ('title', 'description')
    autocomplete_fields = ['series']
    inlines = [EpisodeInline]
    prepopulated_fields = {"slug": ("season_number",)}

    def season_label(self, obj):
        return str(obj)
    season_label.short_description = 'Season'

    def parent_series_link(self, obj):
        url = reverse('admin:series_series_change', args=[obj.series.id])
        return format_html('<a href="{}">🏢 {}</a>', url, obj.series.title)
    parent_series_link.short_description = 'Series (Back)'

    def episode_count_link(self, obj):
        count = obj.episodes.count()
        url = reverse('admin:series_episode_changelist') + f'?season__id__exact={obj.id}'
        return format_html('<a href="{}">📽️ {} Episodes (Open Folder)</a>', url, count)
    episode_count_link.short_description = 'Episodes'

    def has_module_permission(self, request):
        return False  # Hide from Admin Index


class SeasonInline(admin.TabularInline):
    model = Season
    extra = 0
    fields = ('season_number', 'title', 'view_season_link')
    readonly_fields = ('view_season_link',)

    def view_season_link(self, obj):
        if obj.id:
            url = reverse('admin:series_season_change', args=[obj.id])
            return format_html('<a href="{}">📂 Open Season Folder</a>', url)
        return "-"


@admin.register(Series)
class SeriesAdmin(admin.ModelAdmin):
    list_display = ('title', 'view_seasons_link', 'rating', 'first_air_date')
    search_fields = ('title',)
    autocomplete_fields = ['categories']
    prepopulated_fields = {"slug": ("title",)}
    actions = ['sync_from_tmdb']
    
    fieldsets = (
        ("Content Information", {
            'fields': (('title', 'slug', 'tmdb_id'), 'description', 'categories'),
        }),
        ("Media Assets", {
            'fields': ('poster', 'trailer_url'),
            'description': "Upload a poster and provide a trailer link.",
        }),
        ("Metadata", {
            'fields': (('rating', 'first_air_date'),),
        }),
    )
    
    inlines = [SeasonInline]

    @admin.action(description="Sync metadata from TMDB")
    def sync_from_tmdb(self, request, queryset):
        service = TMDBService()
        success_count = 0
        for series in queryset:
            if series.tmdb_id:
                data = service.fetch_series_data(series.tmdb_id)
                if data:
                    series.title = data['title']
                    series.description = data['description']
                    series.poster = data['poster']
                    series.backdrop = data['backdrop']
                    series.rating = data['rating']
                    series.first_air_date = data['first_air_date']
                    series.save()
                    success_count += 1
        self.message_user(request, f"Successfully synced {success_count} series.", messages.SUCCESS)

    def view_seasons_link(self, obj):
        count = obj.seasons.count()
        url = reverse('admin:series_season_changelist') + f'?series__id__exact={obj.id}'
        return format_html('<a href="{}">🗂️ {} Seasons (Open Folder)</a>', url, count)
    view_seasons_link.short_description = 'Seasons Folder'
