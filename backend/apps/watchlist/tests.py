from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.movies.models import Movie
from apps.watchlist.models import WatchlistItem


User = get_user_model()


class WatchlistApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="watcher",
            email="watcher@example.com",
            password="StrongPass123",
        )
        self.movie = Movie.objects.create(
            title="Watchable Movie",
            slug="watchable-movie",
            description="Movie description",
            poster="posters/movies/example.jpg",
            source_type="external",
            external_url="https://example.com/movie",
            status=Movie.STATUS_PUBLISHED,
        )

    def test_watchlist_requires_authentication(self):
        response = self.client.post(
            reverse("watchlist-list"),
            {"content_type_model": "movie", "object_id": self.movie.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_can_add_movie_and_get_item_id(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("watchlist-list"),
            {"content_type_model": "movie", "object_id": self.movie.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("id", response.data)
        self.assertEqual(response.data["object_id"], self.movie.id)
        self.assertEqual(response.data["content_type_name"], "movie")
        self.assertEqual(response.data["content_object_detail"]["title"], self.movie.title)
        self.assertEqual(WatchlistItem.objects.filter(user=self.user).count(), 1)

    def test_adding_same_movie_again_returns_existing_item(self):
        self.client.force_authenticate(self.user)

        first_response = self.client.post(
            reverse("watchlist-list"),
            {"content_type_model": "movie", "object_id": self.movie.id},
            format="json",
        )
        second_response = self.client.post(
            reverse("watchlist-list"),
            {"content_type_model": "movie", "object_id": self.movie.id},
            format="json",
        )

        self.assertEqual(second_response.status_code, status.HTTP_200_OK)
        self.assertEqual(second_response.data["id"], first_response.data["id"])
        self.assertEqual(WatchlistItem.objects.filter(user=self.user).count(), 1)

    def test_filter_and_delete_watchlist_item(self):
        self.client.force_authenticate(self.user)
        item = WatchlistItem.objects.create(
            user=self.user,
            content_type=ContentType.objects.get_for_model(Movie),
            object_id=self.movie.id,
        )

        list_response = self.client.get(
            reverse("watchlist-list"),
            {"content_type": "movie", "object_id": self.movie.id},
        )
        delete_response = self.client.delete(
            reverse("watchlist-detail", kwargs={"pk": item.id})
        )

        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(list_response.data[0]["id"], item.id)
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(WatchlistItem.objects.filter(id=item.id).exists())
