from django.db import models
from apps.categories.models import Category


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
