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
        self.assertTrue(detail_response.data["download_available"])
        self.assertNotIn("video_file", detail_response.data)
        self.assertNotIn("external_url", detail_response.data)

    def test_movie_download_endpoint_returns_controlled_url(self):
        movie = self._movie("Published Movie", Movie.STATUS_PUBLISHED)

        response = self.client.post(reverse("movie-download", kwargs={"slug": movie.slug}))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["url"], "https://example.com/movie")
        self.assertEqual(response.data["source_type"], "external")

    def test_uploaded_movie_returns_a_temporary_protected_download_url(self):
        movie = Movie.objects.create(
            title="Uploaded Movie",
            slug="uploaded-movie",
            description="Movie description",
            poster="posters/movies/example.jpg",
            source_type="upload",
            video_file="videos/movies/uploaded.mp4",
            status=Movie.STATUS_PUBLISHED,
        )

        response = self.client.post(reverse("movie-download", kwargs={"slug": movie.slug}))

        self.assertEqual(response.status_code, 200)
        self.assertIn("/api/movies/uploaded-movie/download-file/?token=", response.data["url"])
        self.assertEqual(response.data["expires_in"], 900)

    def test_uploaded_movie_rejects_an_invalid_download_token(self):
        movie = Movie.objects.create(
            title="Uploaded Movie",
            slug="uploaded-movie",
            description="Movie description",
            poster="posters/movies/example.jpg",
            source_type="upload",
            video_file="videos/movies/uploaded.mp4",
            status=Movie.STATUS_PUBLISHED,
        )

        response = self.client.get(
            reverse("movie-download-file", kwargs={"slug": movie.slug}),
            {"token": "invalid"},
        )

        self.assertEqual(response.status_code, 403)

    def test_movie_list_allows_fifty_item_pages(self):
        for index in range(55):
            self._movie(f"Published Movie {index}", Movie.STATUS_PUBLISHED)

        response = self.client.get(reverse("movie-list"), {"page_size": 50})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 55)
        self.assertEqual(len(response.data["results"]), 50)
        self.assertIsNotNone(response.data["next"])

    def test_published_movie_requires_a_source(self):
        movie = self._movie("Incomplete Movie", Movie.STATUS_DRAFT, external_url="")
        movie.status = Movie.STATUS_PUBLISHED

        with self.assertRaisesMessage(ValidationError, "external source URL or uploaded video file"):
            movie.full_clean()
