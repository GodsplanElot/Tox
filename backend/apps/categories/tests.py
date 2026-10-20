from django.urls import reverse
from rest_framework.test import APITestCase

from apps.categories.models import Category
from apps.movies.models import Movie
from apps.series.models import Series


class CategoryCountTests(APITestCase):
    def setUp(self):
        self.action = Category.objects.create(name="Action", slug="action")
        self.drama = Category.objects.create(name="Drama", slug="drama")

        # More published movies than one API page (24) to catch client-side counting.
        for index in range(30):
            movie = Movie.objects.create(
                title=f"Action Movie {index}",
                slug=f"action-movie-{index}",
                description="Description",
                poster="posters/movies/example.jpg",
                source_type="external",
                external_url="https://example.com/movie",
                status=Movie.STATUS_PUBLISHED,
            )
            movie.categories.add(self.action)

        draft = Movie.objects.create(
            title="Draft Movie",
            slug="draft-movie",
            description="Description",
            poster="posters/movies/example.jpg",
            source_type="external",
            external_url="https://example.com/draft",
            status=Movie.STATUS_DRAFT,
        )
        draft.categories.add(self.action)

        for slug, status in (("published-show", Series.STATUS_PUBLISHED), ("draft-show", Series.STATUS_DRAFT)):
            show = Series.objects.create(
                title=slug,
                slug=slug,
                description="Description",
                poster="posters/series/example.jpg",
                status=status,
            )
            show.categories.add(self.action, self.drama)

    def _category(self, slug):
        response = self.client.get(reverse("category-list"))
        self.assertEqual(response.status_code, 200)
        results = response.data["results"] if isinstance(response.data, dict) else response.data
        return next(item for item in results if item["slug"] == slug)

    def test_counts_include_only_published_movies_and_series(self):
        action = self._category("action")
        self.assertEqual(action["movie_count"], 30)
        self.assertEqual(action["series_count"], 1)

        drama = self._category("drama")
        self.assertEqual(drama["movie_count"], 0)
        self.assertEqual(drama["series_count"], 1)

    def test_movie_and_series_lists_filter_by_category(self):
        movies = self.client.get(reverse("movie-list"), {"category": "drama"})
        self.assertEqual(movies.data["count"], 0)

        movies = self.client.get(reverse("movie-list"), {"category": "action"})
        self.assertEqual(movies.data["count"], 30)

        series = self.client.get(reverse("series-list"), {"category": "drama"})
        self.assertEqual(series.data["count"], 1)
        self.assertEqual(series.data["results"][0]["slug"], "published-show")
