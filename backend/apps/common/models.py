from django.conf import settings
from django.db import models
from django.utils import timezone


class PublishableModel(models.Model):
    STATUS_DRAFT = "draft"
    STATUS_PENDING_REVIEW = "pending_review"
    STATUS_PUBLISHED = "published"
    STATUS_REJECTED = "rejected"

    STATUS_CHOICES = (
        (STATUS_DRAFT, "Draft"),
        (STATUS_PENDING_REVIEW, "Pending Review"),
        (STATUS_PUBLISHED, "Published"),
        (STATUS_REJECTED, "Rejected"),
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_DRAFT,
        db_index=True,
    )
    submitted_at = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="reviewed_%(class)ss",
    )

    class Meta:
        abstract = True

    @property
    def is_published(self):
        return self.status == self.STATUS_PUBLISHED

    def submit_for_review(self):
        self.status = self.STATUS_PENDING_REVIEW
        self.submitted_at = timezone.now()

    def mark_published(self, reviewer=None):
        self.status = self.STATUS_PUBLISHED
        self.published_at = timezone.now()
        if reviewer is not None:
            self.reviewed_by = reviewer

    def mark_rejected(self, reviewer=None):
        self.status = self.STATUS_REJECTED
        if reviewer is not None:
            self.reviewed_by = reviewer

# Create your models here.
