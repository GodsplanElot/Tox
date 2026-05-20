from django.urls import reverse
from rest_framework.test import APITestCase

from apps.series.models import Episode, Season, Series


class SeriesApiVisibilityTests(APITestCase):
    def setUp(self):
        self.series = Series.objects.create(
            title="Published Series",
            slug="published-series",
            description="Series description",
            poster="posters/series/example.jpg",
            status=Series.STATUS_PUBLISHED,
        )
        self.season = Season.objects.create(
            series=self.series,
            season_number=1,
            slug="published-series-season-1",
            status=Season.STATUS_PUBLISHED,
        )
        Episode.objects.create(
            season=self.season,
            episode_number=1,
            slug="published-series-s1e1",
            title="Published Episode",
            source_type="external",
            external_url="https://example.com/episode",
            status=Episode.STATUS_PUBLISHED,
        )
        Episode.objects.create(
            season=self.season,
            episode_number=2,
            slug="published-series-s1e2",
            title="Draft Episode",
            source_type="external",
            external_url="https://example.com/draft",
            status=Episode.STATUS_DRAFT,
        )
        Series.objects.create(
            title="Draft Series",
            slug="draft-series",
            description="Draft description",
            poster="posters/series/draft.jpg",
            status=Series.STATUS_DRAFT,
        )

    def test_series_list_is_lightweight_and_only_published(self):
        response = self.client.get(reverse("series-list"))

        self.assertEqual(response.status_code, 200)
        item = response.data["results"][0]
        self.assertEqual(item["title"], "Published Series")
        self.assertNotIn("seasons", item)
        self.assertEqual(len(response.data["results"]), 1)

    def test_series_detail_only_includes_published_children(self):
        response = self.client.get(reverse("series-detail", kwargs={"slug": self.series.slug}))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["seasons"]), 1)
        episodes = response.data["seasons"][0]["episodes"]
        self.assertEqual(len(episodes), 1)
        self.assertEqual(episodes[0]["title"], "Published Episode")
        self.assertEqual(episodes[0]["external_url"], "https://example.com/episode")
