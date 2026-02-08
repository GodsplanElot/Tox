from django.db import models
from django.utils.text import slugify
from apps.categories.models import Category

class Series(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    tmdb_id = models.IntegerField(null=True, blank=True, help_text="TMDB ID for metadata sync")
    description = models.TextField()

    poster = models.ImageField(
        upload_to="posters/series/",
        help_text="Recommended size: 600x900px (2:3 aspect ratio)"
    )
    trailer_url = models.URLField(help_text="Link to YouTube/Vimeo trailer", null=True, blank=True)

    rating = models.FloatField(
        null=True, 
        blank=True,
        help_text="Scale: 0.0 to 10.0"
    )
    first_air_date = models.DateField(null=True, blank=True)

    categories = models.ManyToManyField(
        Category, 
        related_name="series",
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Season(models.Model):
    series = models.ForeignKey(
        Series,
        related_name="seasons",
        on_delete=models.CASCADE
    )

    season_number = models.PositiveIntegerField()
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    title = models.CharField(max_length=255, blank=True, help_text="e.g. 'The Beginning' or leave blank")
    description = models.TextField(blank=True, help_text="Summary for this specific season")
    poster = models.ImageField(
        upload_to="posters/seasons/",
        null=True, 
        blank=True, 
        help_text="Per-season poster image"
    )

    class Meta:
        unique_together = ("series", "season_number")
        ordering = ["season_number"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.series.title}-season-{self.season_number}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.series.title} - Season {self.season_number}"


class Episode(models.Model):
    SOURCE_TYPE_CHOICES = (
        ("upload", "Uploaded File"),
        ("external", "External Link"),
    )

    season = models.ForeignKey(
        Season,
        related_name="episodes",
        on_delete=models.CASCADE
    )

    episode_number = models.PositiveIntegerField()
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    title = models.CharField(max_length=255)
    plot = models.TextField(blank=True, help_text="Narrative summary of the episode")
    thumbnail = models.ImageField(
        upload_to="thumbnails/episodes/",
        null=True, 
        blank=True, 
        help_text="Preview image for the episode"
    )

    # Video Source Fields (Moved directly into model for easier upload)
    source_type = models.CharField(
        max_length=20,
        choices=SOURCE_TYPE_CHOICES,
        default="upload"
    )
    video_file = models.FileField(
        upload_to="videos/episodes/",
        blank=True,
        null=True,
        help_text="Upload raw MP4 file here"
    )
    external_url = models.URLField(
        blank=True,
        null=True,
        help_text="Link to external stream if source_type is External"
    )

    runtime = models.PositiveIntegerField(
        null=True, 
        blank=True, 
        help_text="Duration in minutes"
    )
    release_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ("season", "episode_number")
        ordering = ["episode_number"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.season.series.title}-s{self.season.season_number}e{self.episode_number}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.season} - Episode {self.episode_number}"

