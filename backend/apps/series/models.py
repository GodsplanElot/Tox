from django.db import models
from apps.categories.models import Category
from apps.media.models import VideoSource


class Series(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    poster = models.URLField(help_text="Poster image URL")

    rating = models.FloatField(null=True, blank=True)
    first_air_date = models.DateField(null=True, blank=True)

    categories = models.ManyToManyField(
        Category,
        related_name="series",
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Season(models.Model):
    series = models.ForeignKey(
        Series,
        related_name="seasons",
        on_delete=models.CASCADE
    )

    season_number = models.PositiveIntegerField()
    title = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ("series", "season_number")
        ordering = ["season_number"]

    def __str__(self):
        return f"{self.series.title} - Season {self.season_number}"


class Episode(models.Model):
    season = models.ForeignKey(
        Season,
        related_name="episodes",
        on_delete=models.CASCADE
    )

    episode_number = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    runtime = models.PositiveIntegerField(null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ("season", "episode_number")
        ordering = ["episode_number"]

    def __str__(self):
        return f"{self.season} - Episode {self.episode_number}"


class EpisodeVideo(models.Model):
    episode = models.ForeignKey(
        Episode,
        related_name="videos",
        on_delete=models.CASCADE
    )
    video_source = models.ForeignKey(
        VideoSource,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.episode} - {self.video_source}"

