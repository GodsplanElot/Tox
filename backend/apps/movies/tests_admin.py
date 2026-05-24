from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.urls import reverse
from django.test import TestCase

from apps.common.admin_roles import EDITOR_GROUP, WORKER_GROUP
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


class MovieAdminRolePermissionTests(TestCase):
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

        self.worker_movie = self._movie("Worker Draft", Movie.STATUS_DRAFT, self.worker)
        self.other_movie = self._movie("Other Draft", Movie.STATUS_DRAFT, self.other_worker)
        self.pending_movie = self._movie("Pending Movie", Movie.STATUS_PENDING_REVIEW, self.other_worker)

    def _movie(self, title, status, uploaded_by):
        return Movie.objects.create(
            title=title,
            slug=title.lower().replace(" ", "-"),
            description="Movie description",
            poster="posters/movies/example.jpg",
            source_type="external",
            external_url="https://example.com/movie",
            status=status,
            uploaded_by=uploaded_by,
        )

    def test_worker_only_sees_own_uploads(self):
        self.client.force_login(self.worker)

        response = self.client.get(reverse("admin:movies_movie_changelist"))

        self.assertEqual(response.status_code, 200)
        titles = [movie.title for movie in response.context["cl"].queryset]
        self.assertEqual(titles, [self.worker_movie.title])

    def test_worker_cannot_access_another_workers_movie(self):
        self.client.force_login(self.worker)

        response = self.client.get(
            reverse("admin:movies_movie_change", args=[self.other_movie.id])
        )

        self.assertNotEqual(response.status_code, 200)

    def test_worker_cannot_publish_via_admin_action(self):
        self.client.force_login(self.worker)

        response = self.client.post(
            reverse("admin:movies_movie_changelist"),
            {
                "action": "approve_selected",
                "_selected_action": [self.worker_movie.id],
            },
        )

        self.assertEqual(response.status_code, 302)
        self.worker_movie.refresh_from_db()
        self.assertEqual(self.worker_movie.status, Movie.STATUS_DRAFT)

    def test_editor_can_approve_pending_movie(self):
        self.client.force_login(self.editor)

        response = self.client.post(
            reverse("admin:movies_pendingreviewmovie_changelist"),
            {
                "action": "approve_selected",
                "_selected_action": [self.pending_movie.id],
            },
        )

        self.assertEqual(response.status_code, 302)
        self.pending_movie.refresh_from_db()
        self.assertEqual(self.pending_movie.status, Movie.STATUS_PUBLISHED)
        self.assertEqual(self.pending_movie.reviewed_by, self.editor)

    def test_editor_cannot_access_user_management_without_auth_permissions(self):
        self.client.force_login(self.editor)

        response = self.client.get(reverse("admin:auth_user_changelist"))

        self.assertEqual(response.status_code, 403)
