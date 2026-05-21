from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from apps.movies.models import DraftMovie, Movie, PendingReviewMovie, PublishedMovie


User = get_user_model()


class MovieAdminStatusPageTests(TestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="StrongPass123",
        )
        self.client.force_login(self.superuser)

        self.draft_movie = self._movie("Draft Movie", Movie.STATUS_DRAFT)
        self.pending_movie = self._movie("Pending Movie", Movie.STATUS_PENDING_REVIEW)
        self.published_movie = self._movie("Published Movie", Movie.STATUS_PUBLISHED)

    def _movie(self, title, status):
        return Movie.objects.create(
            title=title,
            slug=title.lower().replace(" ", "-"),
            description="Movie description",
            poster="posters/movies/example.jpg",
            source_type="external",
            external_url="https://example.com/movie",
            status=status,
        )

    def test_draft_movie_admin_only_lists_drafts(self):
        response = self.client.get(reverse("admin:movies_draftmovie_changelist"))

        self.assertEqual(response.status_code, 200)
        titles = [movie.title for movie in response.context["cl"].queryset]
        self.assertEqual(titles, [self.draft_movie.title])

    def test_pending_review_movie_admin_only_lists_pending_review(self):
        response = self.client.get(reverse("admin:movies_pendingreviewmovie_changelist"))

        self.assertEqual(response.status_code, 200)
        titles = [movie.title for movie in response.context["cl"].queryset]
        self.assertEqual(titles, [self.pending_movie.title])

    def test_published_movie_admin_only_lists_published(self):
        response = self.client.get(reverse("admin:movies_publishedmovie_changelist"))

        self.assertEqual(response.status_code, 200)
        titles = [movie.title for movie in response.context["cl"].queryset]
        self.assertEqual(titles, [self.published_movie.title])

    def test_status_proxy_models_do_not_create_separate_tables(self):
        self.assertEqual(DraftMovie.objects.count(), 3)
        self.assertEqual(PendingReviewMovie.objects.count(), 3)
        self.assertEqual(PublishedMovie.objects.count(), 3)
