from django.db import models
from apps.categories.models import Category
from apps.media.models import VideoSource


class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    # Single canonical image
    poster = models.URLField(help_text="Poster image URL")

    rating = models.FloatField(null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    runtime = models.PositiveIntegerField(null=True, blank=True)

    categories = models.ManyToManyField(
        Category,
        related_name="movies",
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class MovieVideo(models.Model):
    movie = models.ForeignKey(
        Movie,
        related_name="videos",
        on_delete=models.CASCADE
    )
    video_source = models.ForeignKey(
        VideoSource,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.movie.title} - {self.video_source}"

