from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.utils.deconstruct import deconstructible


@deconstructible
class LocalVideoStorage(FileSystemStorage):
    """Store large video files on the Lightsail host, independent of image storage."""

    def __init__(self):
        super().__init__(
            location=settings.LOCAL_VIDEO_ROOT,
            base_url=settings.LOCAL_VIDEO_URL,
        )


local_video_storage = LocalVideoStorage()
