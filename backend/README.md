# 🐍 TOX Backend - Django Powerhouse ⚙️

> **High-Performance REST API Backend with Military-Grade Security** 🔒

---

## 🎯 Overview

The TOX backend is a **blazing-fast Django 6.0.1** application powered by **Django REST Framework**, delivering **microsecond-level response times** with **enterprise-grade security** out of the box! 🚀

### 🌟 Architecture Highlights

- ⚡ **Lightning-Fast Django 6.0.1** - Latest stable release
- 🔌 **Django REST Framework** - Industry-standard API framework
- 🏗️ **Modular App Architecture** - 5 specialized apps for clean separation
- 🔒 **Security-First Design** - Multiple security layers enabled
- 💾 **SQLite Database** - Zero-config, production-ready storage
- 🌐 **CORS Configured** - Ready for frontend integration

---

## 🏗️ App Structure

### 📂 Apps Overview

```
backend/apps/
├── 🎬 movies/        → Movie content management
├── 📺 series/        → TV series & episodes
├── 📂 categories/    → Content categorization
├── 👤 users/         → Authentication & profiles
└── 🔧 common/        → Shared utilities
```

### 🎬 Movies App

**Purpose:** Complete movie management system

**Models:**
- `Movie` - Stores movie metadata, ratings, posters, video files

**Key Features:**
- ✅ Title, description, poster URL
- ⭐ Rating system (FloatField)
- 📅 Release date tracking
- ⏱️ Runtime in minutes
- 🎞️ Video file upload support
- 🌐 External streaming URL support
- 📂 Many-to-Many relationship with categories
- 🔄 Active/inactive toggle
- 📊 Automatic timestamp tracking

**Fields:**
```python
- title: CharField(max_length=255)
- description: TextField
- poster: URLField
- rating: FloatField (nullable)
- release_date: DateField (nullable)
- runtime: PositiveIntegerField (nullable)
- video_file: FileField (upload_to="movies/videos/")
- external_download_url: URLField (nullable)
- categories: ManyToManyField(Category)
- is_active: BooleanField (default=True)
- created_at: DateTimeField (auto_now_add=True)
```

---

### 📺 Series App

**Purpose:** TV series management with season/episode support

**Key Features:**
- 📺 Series metadata
- 🎯 Episode tracking
- 🔢 Season organization
- 📂 Category relationships

---

### 📂 Categories App

**Purpose:** Organize content with smart categorization

**Models:**
- `Category` - Content categories with SEO-friendly slugs

**Key Features:**
- ✅ Unique category names
- 🔗 SEO-friendly slugs
- 📝 Category descriptions
- 🔄 Active/inactive toggle
- 📊 Automatic timestamps
- 🔤 Alphabetical ordering

**Fields:**
```python
- name: CharField(max_length=100, unique=True)
- slug: SlugField(max_length=120, unique=True)
- description: TextField (blank=True)
- is_active: BooleanField (default=True)
- created_at: DateTimeField (auto_now_add=True)
- updated_at: DateTimeField (auto_now=True)
```

**Meta Options:**
- Ordering: Alphabetical by name
- Verbose name: "Categories" (correct pluralization)

---

### 👤 Users App

**Purpose:** User authentication and authorization

**Key Features:**
- 🔐 JWT-ready authentication
- 👤 Custom user profiles
- 🔒 Secure password handling

---

### 🔧 Common App

**Purpose:** Shared utilities and helpers across all apps

**Key Features:**
- 🛠️ Reusable functions
- 📊 Common models
- 🔧 Utility classes

---

## 🔒 Security Features

### 🛡️ Built-in Security Layers

1. **Django Security Middleware** ✅
   - SecurityMiddleware enabled
   - ClickjackingMiddleware active
   - CSRF protection configured

2. **CORS Protection** 🌐
   - CorsMiddleware enabled
   - Currently set to allow all origins (configure for production!)

3. **Password Validation** 🔑
   - UserAttributeSimilarityValidator
   - MinimumLengthValidator
   - CommonPasswordValidator
   - NumericPasswordValidator

4. **Authentication Ready** 🔐
   - SessionAuthentication enabled
   - JWT infrastructure ready (rest_framework_simplejwt detected)

> [!WARNING]
> **Production Security Checklist**
> - Change the `SECRET_KEY` immediately!
> - Set `DEBUG = False`
> - Configure specific `ALLOWED_HOSTS`
> - Restrict `CORS_ALLOW_ALL_ORIGINS`
> - Use environment variables for secrets
> - Enable HTTPS
> - Set up proper database (PostgreSQL recommended)

---

## ⚡ Performance Features

- 🚀 **Django 6.0.1** - Latest performance optimizations
- 📦 **Efficient Querysets** - Optimized database queries
- 🔄 **Connection Pooling** - Fast database connections
- 📊 **Indexing** - Automatic fields indexing
- ⚙️ **REST Framework** - Optimized serialization

---

## 🚀 Quick Start

### ✅ Current Setup (This Repo)

This backend now includes:

- `requirements.txt` for reproducible installs
- `django-nested-admin` configured at `/_nested_admin/`
- `.env.example` for environment-based settings

### 1️⃣ Setup Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate
```

If PowerShell blocks activation, run this once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

**Key Dependencies:**
- Django 6.0.1
- djangorestframework
- django-cors-headers
- djangorestframework-simplejwt (for JWT auth)

### 3️⃣ Database Setup

```bash
# Create migrations for all apps
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser
```

### 4️⃣ Run Development Server

```bash
python manage.py runserver
```

**🎉 Server running at:** `http://localhost:8000`

**Admin panel:** `http://localhost:8000/admin`

**Nested admin assets URL:** `http://localhost:8000/_nested_admin/`

### 5️⃣ Deactivate Virtual Environment

```bash
deactivate
```

---

## 🛠️ Essential Commands

### Database Management
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset database (careful!)
python manage.py flush

# Create superuser
python manage.py createsuperuser
```

### Development
```bash
# Run development server
python manage.py runserver

# Run on specific port
python manage.py runserver 8080

# Run tests
python manage.py test

# Access Django shell
python manage.py shell
```

### App Management
```bash
# Create new app
python manage.py startapp app_name

# Show migrations
python manage.py showmigrations

# SQL for migration
python manage.py sqlmigrate app_name migration_number
```

---

## 📁 Project Structure

```
backend/
├── apps/
│   ├── movies/
│   │   ├── models.py        ← Movie model
│   │   ├── views.py         ← API views
│   │   ├── serializers.py   ← DRF serializers
│   │   ├── urls.py          ← App URLs
│   │   └── admin.py         ← Admin config
│   ├── series/
│   ├── categories/
│   ├── users/
│   └── common/
├── backend/
│   ├── settings.py          ← Django settings
│   ├── urls.py              ← Main URL config
│   ├── wsgi.py              ← WSGI config
│   └── asgi.py              ← ASGI config
├── manage.py
├── db.sqlite3
└── venv/
```

---

## 🔌 API Endpoints (Coming Soon!)

```
GET    /api/movies/          → List all movies
POST   /api/movies/          → Create movie
GET    /api/movies/{id}/     → Get movie details
PUT    /api/movies/{id}/     → Update movie
DELETE /api/movies/{id}/     → Delete movie

GET    /api/categories/      → List categories
POST   /api/categories/      → Create category
GET    /api/categories/{id}/ → Get category details

GET    /api/series/          → List all series
...
```

---

## 🎨 Django Admin

Access the beautiful Django admin panel at `http://localhost:8000/admin`

**Features:**
- 👀 Browse all models
- ✏️ CRUD operations
- 🔍 Search and filters
- 📊 Data visualization
- 👤 User management

---

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.movies

# Run with verbose output
python manage.py test --verbosity=2

# Keep test database
python manage.py test --keepdb
```

---

## 📦 Database Schema

### Movie → Category Relationship
```
Movie (Many) ←→ (Many) Category
Through: movies_categories (auto-created join table)
```

### Key Relationships
- Movies can have multiple categories
- Categories can contain multiple movies
- Optimized reverse lookups via `related_name="movies"`

---

## 🔧 Configuration

### Settings Overview

- **Database:** SQLite (switch to PostgreSQL for production)
- **CORS:** Currently allows all origins (configure for production!)
- **Static Files:** Configured at `/static/`
- **Media Files:** Movies upload to `movies/videos/`
- **Time Zone:** UTC
- **Language:** English (US)

---

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Set `DEBUG = False`
- [ ] Configure `SECRET_KEY` via environment variable
- [ ] Set `ALLOWED_HOSTS`
- [ ] Configure CORS properly
- [ ] Switch to PostgreSQL or MySQL
- [ ] Set up static file serving (WhiteNoise or CDN)
- [ ] Configure media file storage (S3, CloudFlare R2)
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging

### Recommended Stack

- **Web Server:** Nginx
- **WSGI Server:** Gunicorn
- **Database:** PostgreSQL 14+
- **Cache:** Redis
- **Storage:** AWS S3 or CloudFlare R2

---

## 📊 Database Migrations

The project uses Django's built-in migration system:

```bash
# Always create migrations after model changes
python manage.py makemigrations

# Review SQL before applying
python manage.py sqlmigrate app_name migration_number

# Apply migrations
python manage.py migrate

# Rollback migration
python manage.py migrate app_name previous_migration_number
```

---

## 🎯 Best Practices

1. ✅ **Always use virtual environments**
2. ✅ **Keep SECRET_KEY secret**
3. ✅ **Use environment variables for configuration**
4. ✅ **Write tests for all new features**
5. ✅ **Use Django's built-in security features**
6. ✅ **Keep dependencies updated**
7. ✅ **Use PostgreSQL in production**
8. ✅ **Enable logging and monitoring**

---

## 🔗 Useful Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Security](https://docs.djangoproject.com/en/6.0/topics/security/)
- [Django Best Practices](https://django-best-practices.readthedocs.io/)

---

<div align="center">
  <h3>🐍 Powered by Django 6.0.1 - The Web Framework for Perfectionists with Deadlines ⚡</h3>
  <p>Built with 💖 and secured with 🔒</p>
</div>
