import boto3
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from apps.movies.models import Movie
from apps.series.models import Episode

def get_presigned_url(request, content_type, object_id):
    """
    Generates a pre-signed URL for a movie or episode video.
    """
    if content_type == "movie":
        obj = get_object_or_404(Movie, pk=object_id)
        file_field = obj.video_file
    elif content_type == "episode":
        obj = get_object_or_404(Episode, pk=object_id)
        file_field = obj.video_file
    else:
        return JsonResponse({"error": "Invalid content type"}, status=400)

    if not file_field:
        return JsonResponse({"error": "No video file found"}, status=404)

    # If it's an external URL, just return it
    if hasattr(obj, 'source_type') and obj.source_type == 'external':
        return JsonResponse({"url": obj.external_url})

    # Generate pre-signed URL for S3
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )
        
        # Get the relative path (key) from the FileField
        file_key = file_field.name 
        
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                'Key': file_key
            },
            ExpiresIn=3600  # 1 hour
        )
        return JsonResponse({"url": url})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
