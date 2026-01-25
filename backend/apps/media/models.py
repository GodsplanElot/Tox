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
        help_text="e.g. 1080p, Download Mirror 1"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.label or self.source_type
