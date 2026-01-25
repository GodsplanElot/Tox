# apps/movies/models.py
from django.db import models
from apps.categories.models import Category

class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    poster = models.URLField()  # single image

    rating = models.FloatField(null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    runtime = models.PositiveIntegerField(null=True, blank=True)

    # VIDEO / DOWNLOAD OPTIONS
    video_file = models.FileField(
        upload_to="movies/videos/",
        blank=True,
        null=True
    )

    external_download_url = models.URLField(
        blank=True,
        null=True,
        help_text="External download or streaming link"
    )

    categories = models.ManyToManyField(
        Category,
        related_name="movies",
        blank=True
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
