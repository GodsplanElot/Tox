from django.db import models
from django.utils.text import slugify
from apps.categories.models import Category

class Movie(models.Model):
    SOURCE_TYPE_CHOICES = (
        ("upload", "Uploaded File"),
        ("external", "External Link"),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    tmdb_id = models.IntegerField(null=True, blank=True, help_text="TMDB ID for metadata sync")
    description = models.TextField()

    # Image Assets
    poster = models.ImageField(
        upload_to="posters/movies/",
        help_text="Recommended size: 600x900px (2:3 aspect ratio)"
    )

    # Video Source Fields (Moved directly into model for easier upload)
    source_type = models.CharField(
        max_length=20,
        choices=SOURCE_TYPE_CHOICES,
        default="upload"
    )
    video_file = models.FileField(
        upload_to="videos/movies/",
        blank=True,
        null=True,
        help_text="Upload raw MP4 file here"
    )
    external_url = models.URLField(
        blank=True,
        null=True,
        help_text="Link to external stream if source_type is External"
    )

    rating = models.FloatField(
        null=True, 
        blank=True,
        help_text="Scale: 0.0 to 10.0"
    )
    release_date = models.DateField(null=True, blank=True)
    runtime = models.PositiveIntegerField(
        null=True, 
        blank=True,
        help_text="Duration in minutes"
    )

    categories = models.ManyToManyField(
        Category,
        related_name="movies",
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

