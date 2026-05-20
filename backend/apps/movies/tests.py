from django.core.exceptions import ValidationError
from django.urls import reverse
from rest_framework.test import APITestCase

from apps.categories.models import Category
from apps.movies.models import Movie


class MovieApiVisibilityTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Action", slug="action")

    def _movie(self, title, status, external_url="https://example.com/movie"):
        movie = Movie.objects.create(
            title=title,
            slug=title.lower().replace(" ", "-"),
            description="Movie description",
            poster="posters/movies/example.jpg",
            source_type="external",
            external_url=external_url,
            status=status,
        )
        movie.categories.add(self.category)
        return movie

    def test_movie_list_only_returns_published_items(self):
        movie = self._movie("Published Movie", Movie.STATUS_PUBLISHED)
        self._movie("Draft Movie", Movie.STATUS_DRAFT)

        response = self.client.get(reverse("movie-list"))

        self.assertEqual(response.status_code, 200)
        titles = [item["title"] for item in response.data["results"]]
        self.assertEqual(titles, ["Published Movie"])

        detail_response = self.client.get(reverse("movie-detail", kwargs={"slug": movie.slug}))
        self.assertEqual(detail_response.status_code, 200)
        self.assertEqual(detail_response.data["title"], "Published Movie")

    def test_published_movie_requires_a_source(self):
        movie = self._movie("Incomplete Movie", Movie.STATUS_DRAFT, external_url="")
        movie.status = Movie.STATUS_PUBLISHED

        with self.assertRaisesMessage(ValidationError, "external source URL or uploaded video file"):
            movie.full_clean()
