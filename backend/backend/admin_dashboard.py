from types import MethodType

from django.contrib import admin
from django.contrib.admin.models import LogEntry
from django.template.response import TemplateResponse
from django.urls import reverse

from apps.common.admin_roles import is_worker


def _safe_count(model, **filters):
    try:
        return model.objects.filter(**filters).count()
    except Exception:
        return 0


def _dashboard_context(request):
    from apps.movies.models import Movie
    from apps.series.models import Episode, Series

    movie_scope = Movie.objects.all()
    series_scope = Series.objects.all()
    episode_scope = Episode.objects.all()
    dashboard_title = "Global Review Queue"
    if is_worker(request.user):
        movie_scope = movie_scope.filter(uploaded_by=request.user)
        series_scope = series_scope.filter(uploaded_by=request.user)
        episode_scope = episode_scope.filter(uploaded_by=request.user)
        dashboard_title = "Your Upload Queue"

    return {
        "tox_dashboard_title": dashboard_title,
        "tox_stat_cards": [
            {
                "label": "Draft Movies",
                "value": movie_scope.filter(status=Movie.STATUS_DRAFT).count(),
                "url": reverse("admin:movies_draftmovie_changelist"),
                "tone": "muted",
            },
            {
                "label": "Movies Pending",
                "value": movie_scope.filter(status=Movie.STATUS_PENDING_REVIEW).count(),
                "url": reverse("admin:movies_pendingreviewmovie_changelist"),
                "tone": "warning",
            },
            {
                "label": "Published Movies",
                "value": movie_scope.filter(status=Movie.STATUS_PUBLISHED).count(),
                "url": reverse("admin:movies_publishedmovie_changelist"),
                "tone": "success",
            },
            {
                "label": "Draft Series",
                "value": series_scope.filter(status=Series.STATUS_DRAFT).count(),
                "url": reverse("admin:series_draftseries_changelist"),
                "tone": "muted",
            },
            {
                "label": "Series Pending",
                "value": series_scope.filter(status=Series.STATUS_PENDING_REVIEW).count(),
                "url": reverse("admin:series_pendingreviewseries_changelist"),
                "tone": "warning",
            },
            {
                "label": "Episodes Pending",
                "value": episode_scope.filter(status=Episode.STATUS_PENDING_REVIEW).count(),
                "url": reverse("admin:series_episode_changelist") + "?status__exact=pending_review",
                "tone": "danger",
            },
        ],
        "tox_quick_actions": [
            {
                "label": "Add Movie",
                "url": reverse("admin:movies_movie_add"),
                "icon": "plus",
            },
            {
                "label": "Add Series",
                "url": reverse("admin:series_series_add"),
                "icon": "stack",
            },
            {
                "label": "Review Series",
                "url": reverse("admin:series_pendingreviewseries_changelist"),
                "icon": "review",
            },
            {
                "label": "Review Movies",
                "url": reverse("admin:movies_pendingreviewmovie_changelist"),
                "icon": "review",
            },
            {
                "label": "MinIO Console",
                "url": "http://127.0.0.1:9001",
                "icon": "storage",
                "external": True,
            },
        ],
        "tox_workflow_groups": [
            {
                "title": "Content Queue",
                "links": [
                    {"label": "Draft Movies", "url": reverse("admin:movies_draftmovie_changelist")},
                    {"label": "Movies Pending Review", "url": reverse("admin:movies_pendingreviewmovie_changelist")},
                    {"label": "Published Movies", "url": reverse("admin:movies_publishedmovie_changelist")},
                    {"label": "Draft Series", "url": reverse("admin:series_draftseries_changelist")},
                    {"label": "Series Pending Review", "url": reverse("admin:series_pendingreviewseries_changelist")},
                    {"label": "Published Series", "url": reverse("admin:series_publishedseries_changelist")},
                ],
            },
            {
                "title": "Library",
                "links": [
                    {"label": "Movies", "url": reverse("admin:movies_movie_changelist")},
                    {"label": "Series", "url": reverse("admin:series_series_changelist")},
                    {"label": "Seasons", "url": reverse("admin:series_season_changelist")},
                    {"label": "Episodes", "url": reverse("admin:series_episode_changelist")},
                    {"label": "Categories", "url": reverse("admin:categories_category_changelist")},
                ],
            },
        ],
        "recent_actions": LogEntry.objects.select_related("content_type", "user")[:8],
    }


def tox_admin_index(site, request, extra_context=None):
    app_list = site.get_app_list(request)
    context = {
        **site.each_context(request),
        "title": site.index_title,
        "subtitle": None,
        "app_list": app_list,
        **_dashboard_context(request),
        **(extra_context or {}),
    }
    request.current_app = site.name
    return TemplateResponse(
        request,
        site.index_template or "admin/index.html",
        context,
    )


def configure_admin_dashboard():
    admin.site.site_header = "TOX Studio"
    admin.site.site_title = "TOX Studio"
    admin.site.index_title = "Content Command"
    admin.site.index = MethodType(tox_admin_index, admin.site)
