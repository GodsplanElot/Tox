# Local Docker Infrastructure

This project can run Postgres and MinIO locally with Docker while Django and
React continue running on the host machine.

## Services

- Postgres: `127.0.0.1:5433`
- MinIO S3 API: `http://127.0.0.1:9000`
- MinIO console: `http://127.0.0.1:9001`
- MinIO bucket: `tox-media`

MinIO console credentials:

```txt
Username: tox_minio_admin
Password: tox_minio_password
```

## Start Services

```powershell
docker compose up -d postgres minio minio-init
docker compose ps
```

The `minio-init` service creates the `tox-media` bucket and makes it readable
for local media previews.

## Enable Postgres and MinIO in Django

Update `backend/.env`:

```env
DB_ENGINE=postgres
POSTGRES_DB=tox_db
POSTGRES_USER=tox_user
POSTGRES_PASSWORD=tox_password
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5433

USE_S3=true
AWS_ACCESS_KEY_ID=tox_minio_admin
AWS_SECRET_ACCESS_KEY=tox_minio_password
AWS_STORAGE_BUCKET_NAME=tox-media
AWS_S3_REGION_NAME=us-east-1
AWS_S3_ENDPOINT_URL=http://127.0.0.1:9000
AWS_S3_ADDRESSING_STYLE=path
AWS_QUERYSTRING_AUTH=false
AWS_S3_FILE_OVERWRITE=true
AWS_S3_URL_PROTOCOL=http:
AWS_S3_CUSTOM_DOMAIN=127.0.0.1:9000/tox-media
```

Then run:

```powershell
cd backend
python manage.py migrate
python manage.py runserver
```

Uploaded media should be available at:

```txt
http://127.0.0.1:9000/tox-media/<object-path>
```

## Stop Services

```powershell
docker compose down
```

To delete local Docker data as well:

```powershell
docker compose down -v
```
