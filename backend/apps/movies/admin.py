from django.contrib import admin, messages
from .models import Movie
from apps.common.tmdb import TMDBService

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_date', 'rating')
    search_fields = ('title',)
    autocomplete_fields = ['categories']
    prepopulated_fields = {"slug": ("title",)}
    actions = ['sync_from_tmdb']
    
    fieldsets = (
        ("Content Information", {
            'fields': (('title', 'slug', 'tmdb_id'), 'description', 'categories'),
        }),
        ("Video Source", {
            'fields': ('source_type', 'video_file', 'external_url'),
            'description': "Upload a file or provide an external link.",
        }),
        ("Media Assets", {
            'fields': ('poster',),
        }),
        ("Metadata", {
            'fields': (('rating', 'release_date', 'runtime'),),
        }),
    )

    @admin.action(description="Sync metadata from TMDB")
    def sync_from_tmdb(self, request, queryset):
        service = TMDBService()
        success_count = 0
        for movie in queryset:
            if movie.tmdb_id:
                data = service.fetch_movie_data(movie.tmdb_id)
                if data:
                    movie.title = data['title']
                    movie.description = data['description']
                    movie.poster = data['poster']
                    movie.backdrop = data['backdrop']
                    movie.rating = data['rating']
                    movie.release_date = data['release_date']
                    movie.runtime = data['runtime']
                    movie.save()
                    success_count += 1
        self.message_user(request, f"Successfully synced {success_count} movies.", messages.SUCCESS)

