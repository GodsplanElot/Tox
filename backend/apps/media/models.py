from django.db import models


class VideoSource(models.Model):
    SOURCE_TYPE_CHOICES = (
        ("upload", "Uploaded File"),
        ("external", "External Link"),
    )

    source_type = models.CharField(
        max_length=20,
        choices=SOURCE_TYPE_CHOICES
    )

    # Used if source_type == "upload"
    video_file = models.FileField(
        upload_to="videos/",
        blank=True,
        null=True
    )

    # Used if source_type == "external"
    external_url = models.URLField(
        blank=True,
        null=True
    )

    label = models.CharField(
        max_length=100,
        blank=True,
        help_text="e.g. 1080p, 720p, Download Mirror 1"
    )

    # 🔗 CONTENT LINKS
    movie = models.ForeignKey(
        "movies.Movie",
        related_name="video_sources",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    episode = models.ForeignKey(
        "series.Episode",
        related_name="video_sources",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def clean(self):
        """
        Enforce that a VideoSource belongs to either
        a Movie or an Episode, but not both.
        """
        from django.core.exceptions import ValidationError

        if self.movie and self.episode:
            raise ValidationError(
                "VideoSource can belong to either a Movie or an Episode, not both."
            )

        if not self.movie and not self.episode:
            raise ValidationError(
                "VideoSource must be linked to a Movie or an Episode."
            )

        if self.source_type == "upload" and not self.video_file:
            raise ValidationError(
                "Uploaded source requires a video file."
            )

        if self.source_type == "external" and not self.external_url:
            raise ValidationError(
                "External source requires an external URL."
            )

    def __str__(self):
        target = self.movie or self.episode
        return f"{target} - {self.label or self.source_type}"
