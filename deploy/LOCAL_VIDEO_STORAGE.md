# Local Video Storage on Lightsail

This deployment stores only movie and episode files on the Lightsail SSD.
Posters, thumbnails, and hero images continue to use the existing S3 storage.

## Prepare the host directory

Run on Lightsail:

```bash
sudo mkdir -p /srv/toxicreels/media/videos/movies
sudo mkdir -p /srv/toxicreels/media/videos/episodes
sudo chown -R ubuntu:www-data /srv/toxicreels/media
sudo chmod -R 775 /srv/toxicreels/media
```

## Update the production environment

Keep `USE_S3=true` so image fields continue to use the existing S3 bucket.
Restore the existing AWS S3 endpoint, region, bucket, and rotated credentials.
Do not use MinIO values for these settings.

Add these values to `backend/.env`:

```env
LOCAL_VIDEO_HOST_PATH=/srv/toxicreels/media
LOCAL_VIDEO_ROOT=/app/media
LOCAL_VIDEO_URL=/media/
```

## Configure Nginx

Copy the snippet:

```bash
sudo cp deploy/nginx/api-local-media.conf /etc/nginx/snippets/toxicreels-local-media.conf
```

Inside the existing `api.toxicreels.com` `server` block, add:

```nginx
include /etc/nginx/snippets/toxicreels-local-media.conf;
```

Then validate and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

The `/media/videos/` path is internal, so Nginx will only serve it after a
valid Django download endpoint sends `X-Accel-Redirect`.

## Deploy the application

```bash
git pull --ff-only origin main
docker compose --env-file backend/.env -f docker-compose.prod.yml config --quiet
docker compose --env-file backend/.env -f docker-compose.prod.yml up -d --build web
docker compose --env-file backend/.env -f docker-compose.prod.yml exec web python manage.py migrate
docker compose --env-file backend/.env -f docker-compose.prod.yml exec web python manage.py collectstatic --noinput
```

## Verify

```bash
docker compose --env-file backend/.env -f docker-compose.prod.yml ps
docker compose --env-file backend/.env -f docker-compose.prod.yml exec web python manage.py check
df -h /srv/toxicreels/media
```

Upload a small test MP4 in Django Admin. It should appear under
`/srv/toxicreels/media/videos/movies/` or
`/srv/toxicreels/media/videos/episodes/`.

Existing videos stored in another provider are not copied automatically. Move
or re-upload them before switching any existing published title to local video
storage.
