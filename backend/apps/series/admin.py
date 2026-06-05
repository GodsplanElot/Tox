from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.db.models import Count
from django.urls import reverse
from django.utils.html import format_html

from apps.common.admin_roles import ContentRoleAdminMixin
from apps.common.tmdb import TMDBService
from .models import DraftSeries, Episode, PendingReviewSeries, PublishedSeries, Season, Series


@admin.register(Episode)
class EpisodeAdmin(ContentRoleAdminMixin, admin.ModelAdmin):
    list_display = (
        "title",
        "status",
        "uploaded_by",
        "reviewed_by",
        "parent_season_link",
        "episode_number",
        "release_date",
        "source_type",
    )
    list_filter = ("status", "source_type", "uploaded_by", "reviewed_by", "season__series", "season")
    list_select_related = ("season", "season__series")
    list_per_page = 50
    search_fields = ("title", "plot", "external_url", "uploaded_by__username")
    autocomplete_fields = ["season"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("uploaded_by", "reviewed_by", "submitted_at", "published_at")
    actions = ["submit_for_review", "approve_selected", "reject_selected", "move_to_draft"]

    fieldsets = (
        (
            "Episode Information",
            {
                "fields": (
                    "season",
                    ("episode_number", "title", "slug"),
                    "plot",
                    "thumbnail",
                ),
            },
        ),
        (
            "Video Source",
            {
                "fields": ("source_type", "video_file", "external_url"),
                "description": "Prefer an external legal download/source link. Upload only when the file should be hosted by this app.",
            },
        ),
        (
            "Metadata",
            {
                "fields": (
                    ("runtime", "release_date"),
                    "status",
                    ("uploaded_by", "reviewed_by"),
                    ("submitted_at", "published_at"),
                ),
            },
        ),
    )

    def _save_with_validation(self, request, obj, success_count):
        try:
            obj.full_clean()
            obj.save()
            return success_count + 1
        except ValidationError as exc:
            self.message_user(request, f"{obj}: {exc}", messages.ERROR)
            return success_count

    @admin.action(description="Submit selected episodes for review")
    def submit_for_review(self, request, queryset):
        count = 0
        for episode in queryset:
            episode.submit_for_review()
            episode.save(update_fields=["status", "submitted_at"])
            count += 1
        self.message_user(request, f"Submitted {count} episodes for review.", messages.SUCCESS)

    @admin.action(description="Approve selected episodes")
    def approve_selected(self, request, queryset):
        count = 0
        for episode in queryset:
            episode.mark_published(request.user)
            count = self._save_with_validation(request, episode, count)
        self.message_user(request, f"Approved {count} episodes.", messages.SUCCESS)

    @admin.action(description="Reject selected episodes")
    def reject_selected(self, request, queryset):
        count = 0
        for episode in queryset:
            episode.mark_rejected(request.user)
            episode.save(update_fields=["status", "reviewed_by"])
            count += 1
        self.message_user(request, f"Rejected {count} episodes.", messages.WARNING)

    @admin.action(description="Move selected episodes back to draft")
    def move_to_draft(self, request, queryset):
        count = queryset.update(status=Episode.STATUS_DRAFT)
        self.message_user(request, f"Moved {count} episodes back to draft.", messages.SUCCESS)

    def parent_season_link(self, obj):
        url = reverse("admin:series_season_change", args=[obj.season.id])
        return format_html('<a href="{}">{}</a>', url, obj.season)

    parent_season_link.short_description = "Season"


class EpisodeInline(admin.TabularInline):
    model = Episode
    extra = 0
    fields = ("episode_number", "title", "status", "view_episode_link")
    readonly_fields = ("view_episode_link",)

    def view_episode_link(self, obj):
        if obj.id:
            url = reverse("admin:series_episode_change", args=[obj.id])
            return format_html('<a href="{}">Edit episode</a>', url)
        return "-"


@admin.register(Season)
class SeasonAdmin(ContentRoleAdminMixin, admin.ModelAdmin):
    list_display = ("season_label", "status", "uploaded_by", "reviewed_by", "parent_series_link", "episode_count_link")
    list_filter = ("status", "uploaded_by", "reviewed_by", "series")
    list_select_related = ("series",)
    list_per_page = 50
    search_fields = ("title", "description", "uploaded_by__username")
    autocomplete_fields = ["series"]
    inlines = [EpisodeInline]
    prepopulated_fields = {"slug": ("season_number",)}
    readonly_fields = ("uploaded_by", "reviewed_by", "submitted_at", "published_at")
    actions = ["submit_for_review", "approve_selected", "reject_selected", "move_to_draft"]

    fieldsets = (
        (
            "Season Information",
            {
                "fields": (
                    "series",
                    ("season_number", "slug"),
                    "title",
                    "description",
                    "poster",
                    "status",
                    ("uploaded_by", "reviewed_by"),
                    ("submitted_at", "published_at"),
                ),
            },
        ),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(admin_episode_count=Count("episodes"))

    def season_label(self, obj):
        return str(obj)

    season_label.short_description = "Season"

    def parent_series_link(self, obj):
        url = reverse("admin:series_series_change", args=[obj.series.id])
        return format_html('<a href="{}">{}</a>', url, obj.series.title)

    parent_series_link.short_description = "Series"

    def episode_count_link(self, obj):
        count = getattr(obj, "admin_episode_count", obj.episodes.count())
        url = reverse("admin:series_episode_changelist") + f"?season__id__exact={obj.id}"
        return format_html('<a href="{}">{} episodes</a>', url, count)

    episode_count_link.short_description = "Episodes"

    def _save_with_validation(self, request, obj, success_count):
        try:
            obj.full_clean()
            obj.save()
            return success_count + 1
        except ValidationError as exc:
            self.message_user(request, f"{obj}: {exc}", messages.ERROR)
            return success_count

    def _approve_ready_episodes(self, request, season):
        count = 0
        for episode in season.episodes.filter(status__in=[Episode.STATUS_DRAFT, Episode.STATUS_PENDING_REVIEW]):
            if not (episode.external_url or episode.video_file):
                continue
            episode.mark_published(request.user)
            count = self._save_with_validation(request, episode, count)
        return count

    @admin.action(description="Submit selected seasons for review")
    def submit_for_review(self, request, queryset):
        count = 0
        for season in queryset:
            season.submit_for_review()
            season.save(update_fields=["status", "submitted_at"])
            count += 1
        self.message_user(request, f"Submitted {count} seasons for review.", messages.SUCCESS)

    @admin.action(description="Approve selected seasons and ready episodes")
    def approve_selected(self, request, queryset):
        season_count = 0
        episode_count = 0
        for season in queryset:
            episode_count += self._approve_ready_episodes(request, season)
            season.mark_published(request.user)
            season_count = self._save_with_validation(request, season, season_count)
        self.message_user(
            request,
            f"Approved {season_count} seasons and {episode_count} ready episodes.",
            messages.SUCCESS,
        )

    @admin.action(description="Reject selected seasons")
    def reject_selected(self, request, queryset):
        count = 0
        for season in queryset:
            season.mark_rejected(request.user)
            season.save(update_fields=["status", "reviewed_by"])
            count += 1
        self.message_user(request, f"Rejected {count} seasons.", messages.WARNING)

    @admin.action(description="Move selected seasons back to draft")
    def move_to_draft(self, request, queryset):
        count = queryset.update(status=Season.STATUS_DRAFT)
        self.message_user(request, f"Moved {count} seasons back to draft.", messages.SUCCESS)


class SeasonInline(admin.TabularInline):
    model = Season
    extra = 0
    fields = ("season_number", "title", "status", "view_season_link")
    readonly_fields = ("view_season_link",)

    def view_season_link(self, obj):
        if obj.id:
            url = reverse("admin:series_season_change", args=[obj.id])
            return format_html('<a href="{}">Open season</a>', url)
        return "-"


class SeriesWorkflowAdmin(ContentRoleAdminMixin, admin.ModelAdmin):
    list_display = ("title", "status", "uploaded_by", "reviewed_by", "view_seasons_link", "rating", "first_air_date")
    list_filter = ("status", "uploaded_by", "reviewed_by", "categories", "first_air_date")
    list_per_page = 50
    search_fields = ("title", "description", "uploaded_by__username")
    autocomplete_fields = ["categories"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("uploaded_by", "reviewed_by", "submitted_at", "published_at")
    actions = ["submit_for_review", "approve_selected", "reject_selected", "move_to_draft", "sync_from_tmdb"]

    fieldsets = (
        (
            "Content Information",
            {
                "fields": (("title", "slug", "tmdb_id"), "description", "categories"),
            },
        ),
        (
            "Media Assets",
            {
                "fields": ("poster", "hero_image", "trailer_url"),
                "description": "Upload a vertical poster, optional wide hero artwork, and provide a trailer link.",
            },
        ),
        (
            "Metadata",
            {
                "fields": (
                    ("rating", "first_air_date"),
                    "status",
                    ("uploaded_by", "reviewed_by"),
                    ("submitted_at", "published_at"),
                ),
            },
        ),
    )

    inlines = [SeasonInline]

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(admin_season_count=Count("seasons"))

    def _save_with_validation(self, request, obj, success_count):
        try:
            obj.full_clean()
            obj.save()
            return success_count + 1
        except ValidationError as exc:
            self.message_user(request, f"{obj}: {exc}", messages.ERROR)
            return success_count

    def _approve_ready_children(self, request, series):
        season_count = 0
        episode_count = 0
        for season in series.seasons.all():
            for episode in season.episodes.filter(status__in=[Episode.STATUS_DRAFT, Episode.STATUS_PENDING_REVIEW]):
                if not (episode.external_url or episode.video_file):
                    continue
                episode.mark_published(request.user)
                episode_count = self._save_with_validation(request, episode, episode_count)

            if season.episodes.filter(status=Episode.STATUS_PUBLISHED).exists():
                season.mark_published(request.user)
                season_count = self._save_with_validation(request, season, season_count)

        return season_count, episode_count

    @admin.action(description="Submit selected series for review")
    def submit_for_review(self, request, queryset):
        count = 0
        for series in queryset:
            series.submit_for_review()
            series.save(update_fields=["status", "submitted_at"])
            count += 1
        self.message_user(request, f"Submitted {count} series for review.", messages.SUCCESS)

    @admin.action(description="Approve selected series and ready children")
    def approve_selected(self, request, queryset):
        series_count = 0
        season_count = 0
        episode_count = 0
        for series in queryset:
            approved_seasons, approved_episodes = self._approve_ready_children(request, series)
            season_count += approved_seasons
            episode_count += approved_episodes
            series.mark_published(request.user)
            series_count = self._save_with_validation(request, series, series_count)
        self.message_user(
            request,
            f"Approved {series_count} series, {season_count} seasons, and {episode_count} ready episodes.",
            messages.SUCCESS,
        )

    @admin.action(description="Reject selected series")
    def reject_selected(self, request, queryset):
        count = 0
        for series in queryset:
            series.mark_rejected(request.user)
            series.save(update_fields=["status", "reviewed_by"])
            count += 1
        self.message_user(request, f"Rejected {count} series.", messages.WARNING)

    @admin.action(description="Move selected series back to draft")
    def move_to_draft(self, request, queryset):
        count = queryset.update(status=Series.STATUS_DRAFT)
        self.message_user(request, f"Moved {count} series back to draft.", messages.SUCCESS)

    @admin.action(description="Sync metadata from TMDB")
    def sync_from_tmdb(self, request, queryset):
        service = TMDBService()
        success_count = 0
        for series in queryset:
            if series.tmdb_id:
                data = service.fetch_series_data(series.tmdb_id)
                if data:
                    series.title = data["title"]
                    series.description = data["description"]
                    series.poster = data["poster"]
                    series.rating = data["rating"]
                    series.first_air_date = data["first_air_date"]
                    series.save()
                    success_count += 1
        self.message_user(
            request,
            f"Successfully synced {success_count} series.",
            messages.SUCCESS,
        )

    def view_seasons_link(self, obj):
        count = getattr(obj, "admin_season_count", obj.seasons.count())
        url = reverse("admin:series_season_changelist") + f"?series__id__exact={obj.id}"
        return format_html('<a href="{}">{} seasons</a>', url, count)

    view_seasons_link.short_description = "Seasons"


@admin.register(Series)
class SeriesAdmin(SeriesWorkflowAdmin):
    pass


class StatusSeriesAdmin(SeriesWorkflowAdmin):
    status_filter = None
    list_filter = ("categories", "first_air_date")

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if self.status_filter is None:
            return queryset
        return queryset.filter(status=self.status_filter)

    def has_add_permission(self, request):
        return False


@admin.register(DraftSeries)
class DraftSeriesAdmin(StatusSeriesAdmin):
    status_filter = Series.STATUS_DRAFT
    actions = ["submit_for_review"]


@admin.register(PendingReviewSeries)
class PendingReviewSeriesAdmin(StatusSeriesAdmin):
    status_filter = Series.STATUS_PENDING_REVIEW
    actions = ["approve_selected", "reject_selected", "move_to_draft"]


@admin.register(PublishedSeries)
class PublishedSeriesAdmin(StatusSeriesAdmin):
    status_filter = Series.STATUS_PUBLISHED
    actions = ["move_to_draft", "reject_selected"]
