from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from apps.series.models import DraftSeries, PendingReviewSeries, PublishedSeries, Series


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
