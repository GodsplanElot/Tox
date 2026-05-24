from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TestCase
from django.urls import reverse

from apps.common.admin_roles import EDITOR_GROUP, WORKER_GROUP
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
