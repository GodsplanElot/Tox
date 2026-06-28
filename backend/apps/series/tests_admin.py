from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.admin.sites import AdminSite
from django.core.exceptions import ValidationError
from django.test import RequestFactory, TestCase
from django.urls import reverse

from apps.common.admin_roles import EDITOR_GROUP, WORKER_GROUP
from apps.series.admin import EpisodeInline, SeasonAdmin, SeasonInline, SeriesAdmin
from apps.series.models import DraftSeries, Episode, PendingReviewSeries, PublishedSeries, Season, Series


User = get_user_model()


class SeriesAdminStatusPageTests(TestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="StrongPass123",
        )
        self.client.force_login(self.superuser)

        self.draft_series = self._series("Draft Series", Series.STATUS_DRAFT)
        self.pending_series = self._series("Pending Series", Series.STATUS_PENDING_REVIEW)
        self.published_series = self._series("Published Series", Series.STATUS_PUBLISHED)

    def _series(self, title, status):
        return Series.objects.create(
            title=title,
            slug=title.lower().replace(" ", "-"),
            description="Series description",
            poster="posters/series/example.jpg",
            status=status,
        )

    def test_draft_series_admin_only_lists_drafts(self):
        response = self.client.get(reverse("admin:series_draftseries_changelist"))

        self.assertEqual(response.status_code, 200)
        titles = [series.title for series in response.context["cl"].queryset]
        self.assertEqual(titles, [self.draft_series.title])

    def test_pending_review_series_admin_only_lists_pending_review(self):
        response = self.client.get(reverse("admin:series_pendingreviewseries_changelist"))

        self.assertEqual(response.status_code, 200)
        titles = [series.title for series in response.context["cl"].queryset]
        self.assertEqual(titles, [self.pending_series.title])

    def test_published_series_admin_only_lists_published(self):
        response = self.client.get(reverse("admin:series_publishedseries_changelist"))

        self.assertEqual(response.status_code, 200)
        titles = [series.title for series in response.context["cl"].queryset]
        self.assertEqual(titles, [self.published_series.title])

    def test_status_proxy_models_do_not_create_separate_tables(self):
        self.assertEqual(DraftSeries.objects.count(), 3)
        self.assertEqual(PendingReviewSeries.objects.count(), 3)
        self.assertEqual(PublishedSeries.objects.count(), 3)


class SeriesAdminRolePermissionTests(TestCase):
    def setUp(self):
        self.editor_group = Group.objects.create(name=EDITOR_GROUP)
        self.worker_group = Group.objects.create(name=WORKER_GROUP)

        self.editor = User.objects.create_user(
            username="editor",
            email="editor@example.com",
            password="StrongPass123",
            is_staff=True,
        )
        self.editor.groups.add(self.editor_group)

        self.worker = User.objects.create_user(
            username="worker",
            email="worker@example.com",
            password="StrongPass123",
            is_staff=True,
        )
        self.worker.groups.add(self.worker_group)

        self.other_worker = User.objects.create_user(
            username="otherworker",
            email="otherworker@example.com",
            password="StrongPass123",
            is_staff=True,
        )
        self.other_worker.groups.add(self.worker_group)

        self.worker_series = self._series("Worker Series", Series.STATUS_DRAFT, self.worker)
        self.other_series = self._series("Other Series", Series.STATUS_DRAFT, self.other_worker)
        self.pending_series = self._series("Pending Series", Series.STATUS_PENDING_REVIEW, self.other_worker)
        self.pending_season = Season.objects.create(
            series=self.pending_series,
            season_number=1,
            slug="pending-series-season-1",
            status=Season.STATUS_PENDING_REVIEW,
            uploaded_by=self.other_worker,
        )
        Episode.objects.create(
            season=self.pending_season,
            episode_number=1,
            slug="pending-series-s1e1",
            title="Episode 1",
            source_type="external",
            external_url="https://example.com/episode",
            status=Episode.STATUS_PENDING_REVIEW,
            uploaded_by=self.other_worker,
        )

    def _series(self, title, status, uploaded_by):
        return Series.objects.create(
            title=title,
            slug=title.lower().replace(" ", "-"),
            description="Series description",
            poster="posters/series/example.jpg",
            status=status,
            uploaded_by=uploaded_by,
        )

    def test_worker_only_sees_own_series_uploads(self):
        self.client.force_login(self.worker)

        response = self.client.get(reverse("admin:series_series_changelist"))

        self.assertEqual(response.status_code, 200)
        titles = [series.title for series in response.context["cl"].queryset]
        self.assertEqual(titles, [self.worker_series.title])

    def test_worker_cannot_access_another_workers_series(self):
        self.client.force_login(self.worker)

        response = self.client.get(
            reverse("admin:series_series_change", args=[self.other_series.id])
        )

        self.assertNotEqual(response.status_code, 200)

    def test_editor_can_approve_pending_series_and_ready_children(self):
        self.client.force_login(self.editor)

        response = self.client.post(
            reverse("admin:series_pendingreviewseries_changelist"),
            {
                "action": "approve_selected",
                "_selected_action": [self.pending_series.id],
            },
        )

        self.assertEqual(response.status_code, 302)
        self.pending_series.refresh_from_db()
        self.pending_season.refresh_from_db()
        self.assertEqual(self.pending_series.status, Series.STATUS_PUBLISHED)
        self.assertEqual(self.pending_season.status, Season.STATUS_PUBLISHED)
        self.assertEqual(self.pending_series.reviewed_by, self.editor)


class SeriesCreationWorkflowAdminTests(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.request = RequestFactory().get("/admin/")
        self.request.user = User.objects.create_superuser(
            username="workflow-admin",
            email="workflow-admin@example.com",
            password="StrongPass123",
        )
        self.series_admin = SeriesAdmin(Series, self.site)
        self.season_admin = SeasonAdmin(Season, self.site)
        self.series = Series.objects.create(
            title="Workflow Series",
            slug="workflow-series",
            description="Series description",
            poster="posters/series/example.jpg",
        )

    def test_new_series_and_season_forms_only_offer_draft_status(self):
        series_form = self.series_admin.get_form(self.request)
        season_form = self.season_admin.get_form(self.request)

        self.assertEqual(
            list(series_form.base_fields["status"].choices),
            [(Series.STATUS_DRAFT, "Draft")],
        )
        self.assertEqual(
            list(season_form.base_fields["status"].choices),
            [(Season.STATUS_DRAFT, "Draft")],
        )

    def test_existing_series_form_retains_publication_statuses(self):
        series_form = self.series_admin.get_form(self.request, obj=self.series)
        status_values = [value for value, _label in series_form.base_fields["status"].choices]

        self.assertIn(Series.STATUS_PUBLISHED, status_values)

    def test_creation_inlines_start_with_one_draft_child(self):
        season_inline = SeasonInline(Series, self.site)
        episode_inline = EpisodeInline(Season, self.site)

        self.assertEqual(season_inline.extra, 1)
        self.assertNotIn("status", season_inline.fields)
        self.assertEqual(episode_inline.extra, 1)
        self.assertNotIn("status", episode_inline.fields)
        self.assertIn("external_url", episode_inline.fields)
        self.assertIn("video_file", episode_inline.fields)

    def test_draft_parents_can_exist_before_children_are_added(self):
        self.series.full_clean()
        season = Season(series=self.series, season_number=1)

        season.full_clean()

    def test_incomplete_parents_still_cannot_be_published(self):
        self.series.status = Series.STATUS_PUBLISHED
        with self.assertRaisesMessage(
            ValidationError,
            "A published series needs at least one ready season with one ready episode.",
        ):
            self.series.full_clean()

        season = Season.objects.create(series=self.series, season_number=1)
        season.status = Season.STATUS_PUBLISHED
        with self.assertRaisesMessage(
            ValidationError,
            "A published season needs at least one ready episode.",
        ):
            season.full_clean()
