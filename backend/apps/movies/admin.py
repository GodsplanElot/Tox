from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from .models import Movie
from apps.common.tmdb import TMDBService

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'release_date', 'rating', 'source_type')
    list_filter = ('status', 'source_type', 'categories', 'release_date')
    list_per_page = 50
    search_fields = ('title', 'description', 'external_url')
    autocomplete_fields = ['categories']
    prepopulated_fields = {"slug": ("title",)}
    actions = ['submit_for_review', 'approve_selected', 'reject_selected', 'move_to_draft', 'sync_from_tmdb']
    
    fieldsets = (
        ("Content Information", {
            'fields': (('title', 'slug', 'tmdb_id'), 'description', 'categories'),
        }),
        ("Video Source", {
            'fields': ('source_type', 'video_file', 'external_url'),
            'description': "Prefer an external legal download/source link. Upload only when the file should be hosted by this app.",
        }),
        ("Media Assets", {
            'fields': ('poster',),
        }),
        ("Metadata", {
            'fields': (('rating', 'release_date', 'runtime'), 'status'),
        }),
    )

    def _save_with_validation(self, request, obj, success_count):
        try:
            obj.full_clean()
            obj.save()
            return success_count + 1
        except ValidationError as exc:
            self.message_user(request, f"{obj}: {exc}", messages.ERROR)
            return success_count

    @admin.action(description="Submit selected movies for review")
    def submit_for_review(self, request, queryset):
        count = 0
        for movie in queryset:
            movie.submit_for_review()
            movie.save(update_fields=["status", "submitted_at"])
            count += 1
        self.message_user(request, f"Submitted {count} movies for review.", messages.SUCCESS)

    @admin.action(description="Approve selected movies")
    def approve_selected(self, request, queryset):
        count = 0
        for movie in queryset:
            movie.mark_published(request.user)
            count = self._save_with_validation(request, movie, count)
        self.message_user(request, f"Approved {count} movies.", messages.SUCCESS)

    @admin.action(description="Reject selected movies")
    def reject_selected(self, request, queryset):
        count = 0
        for movie in queryset:
            movie.mark_rejected(request.user)
            movie.save(update_fields=["status", "reviewed_by"])
            count += 1
        self.message_user(request, f"Rejected {count} movies.", messages.WARNING)

    @admin.action(description="Move selected movies back to draft")
    def move_to_draft(self, request, queryset):
        count = queryset.update(status=Movie.STATUS_DRAFT)
        self.message_user(request, f"Moved {count} movies back to draft.", messages.SUCCESS)

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
                    movie.rating = data['rating']
                    movie.release_date = data['release_date']
                    movie.runtime = data['runtime']
                    movie.save()
                    success_count += 1
        self.message_user(request, f"Successfully synced {success_count} movies.", messages.SUCCESS)

