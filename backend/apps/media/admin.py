from django.contrib import admin

# Register your models here.
from .models import VideoSource

@admin.register(VideoSource)
class VideoSourceAdmin(admin.ModelAdmin):
    list_display = ('label', 'source_type', 'movie', 'episode', 'created_at')
    search_fields = ('label', 'video_file', 'external_url')

