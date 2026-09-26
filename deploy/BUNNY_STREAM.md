# Bunny Stream Video Delivery

ToxicReels keeps posters, thumbnails, and hero images in the existing S3 bucket.
Movie and episode video files upload directly from Django Admin to Bunny Stream.
The Lightsail server creates temporary upload signatures but never receives the
video bytes, so Cloudflare's proxied upload limit does not apply.

## Bunny library settings

Configure the Bunny Stream library before deployment:

- Token Authentication: enabled
- Embed View Token Authentication: enabled
- CDN Token Authentication: enabled
- Allowed domains: `toxicreels.com`, `www.toxicreels.com`
- Block direct URL file access: enabled
- Keep original files: disabled
- MP4 fallback: enabled
- Resolutions: 240p, 360p, 480p, 720p, 1080p
- Codec: H.264 only

## Environment

Add these backend-only values to `backend/.env` on Lightsail. Do not place the
API or token keys in Vercel environment variables.

```env
VIDEO_PROVIDER=bunny_stream
BUNNY_STREAM_LIBRARY_ID=your-library-id
BUNNY_STREAM_CDN_HOSTNAME=your-library.b-cdn.net
BUNNY_STREAM_API_KEY=your-library-api-key
BUNNY_STREAM_TOKEN_AUTH_KEY=your-library-token-authentication-key
BUNNY_STREAM_UPLOAD_EXPIRY_SECONDS=21600
```

## Deploy

```bash
cd /srv/toxicreels/Tox
git pull --ff-only origin main
docker compose --env-file backend/.env -f docker-compose.prod.yml config --quiet
docker compose --env-file backend/.env -f docker-compose.prod.yml build web
docker compose --env-file backend/.env -f docker-compose.prod.yml run --rm web python manage.py migrate
docker compose --env-file backend/.env -f docker-compose.prod.yml up -d web
docker compose --env-file backend/.env -f docker-compose.prod.yml exec web python manage.py check
```

## Upload a video

1. Create and save a movie draft or episode draft in Django Admin.
2. Reopen its edit page.
3. Use the **Bunny Stream video** panel beneath the form.
4. Choose an MP4 or another Bunny-supported video file.
5. Keep the page open while the progress bar uploads. If a chunk fails, it
   retries automatically. Bunny then reports encoding progress until the video
   is ready.
6. Submit for review or publish only after the panel says the video is ready.

Existing local files and external links continue to work. New Bunny video IDs
are stored in the database; permanent Bunny URLs are not stored.
