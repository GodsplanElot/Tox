# 🎬 TOX - Lightning-Fast Movie & Series Platform ⚡

> **The Ultimate Entertainment Hub Built for Speed, Security & Performance** 🚀

[![Django](https://img.shields.io/badge/Django-6.0.1-green?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.6-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)

---

## 🌟 What is TOX?

**TOX** is a blazing-fast, ultra-secure full-stack web application for managing and streaming movies and TV series. Built with cutting-edge technologies, TOX delivers **instant load times**, **military-grade security**, and a **stunning user interface** that rivals major streaming platforms! 

### 💎 Why TOX Stands Out

- ⚡ **Lightning-Fast Performance** - Powered by Vite's HMR + Django REST Framework
- 🔒 **Fort Knox Security** - JWT authentication, CORS protection, Django security middleware
- 🎨 **Stunning UI** - Bootstrap 5.3 + Custom CSS with smooth animations
- 📱 **Fully Responsive** - Perfect on any device
- 🎯 **Type-Safe** - Full TypeScript coverage for zero runtime errors
- 🔥 **Modern Architecture** - Clean separation of concerns with Django apps

---

## 🏗️ Architecture Overview

```
TOX/
├── 🎨 frontend/          → React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   → Reusable UI components
│   │   ├── pages/        → Route-based pages
│   │   ├── layout/       → Navigation & layout components
│   │   ├── styles/       → Global styles & themes
│   │   └── types/        → TypeScript type definitions
│   └── package.json
│
└── ⚙️ backend/           → Django REST Framework
    ├── apps/
    │   ├── movies/       → Movie management
    │   ├── series/       → TV Series management
    │   ├── categories/   → Category system
    │   ├── users/        → User authentication
    │   └── common/       → Shared utilities
    └── backend/
        └── settings.py   → Django configuration
```

---

## 🚀 Quick Start

### Prerequisites

- 🐍 Python 3.10+ 
- 📦 Node.js 18+ & npm
- 💾 SQLite (included)

### ⚙️ Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# If you get an execution policy error, run:
# Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server 🚀
python manage.py runserver
```

**Backend will be running at:** `http://localhost:8000` ✅

Nested admin will be available at: `http://localhost:8000/_nested_admin/`

---

### 🎨 Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server ⚡
npm run dev
```

**Frontend will be running at:** `http://localhost:5173` ✅

---

## 🎯 Key Features

### 🎬 Movies & Series
- ✨ Browse movies and TV series
- 🔍 Advanced search functionality
- 📂 Category-based organization
- ⭐ Rating system
- 📅 Release date tracking
- ⏱️ Runtime information
- 🎞️ Video file support + external streaming links

### 🔐 Security Features
- 🛡️ CORS protection configured
- 🔒 Django security middleware enabled
- 🔑 JWT-ready authentication setup
- 👤 User management system
- 🚫 CSRF protection

### ⚡ Performance Features
- 🚀 Vite's lightning-fast HMR
- 📦 Optimized production builds
- 🎯 Code splitting
- 🔄 React 19 concurrent features
- ⚙️ Django REST Framework optimization

### 🎨 Frontend Features
- 💅 Bootstrap 5.3 + React Bootstrap
- 🎭 Custom animations
- 📱 Fully responsive design
- 🎯 TypeScript for type safety
- 🧭 React Router v7 for navigation

---

## 📚 Tech Stack

### Frontend 🎨
| Technology | Version | Purpose |
|------------|---------|---------|
| ⚛️ React | 19.1.1 | UI Framework |
| 📘 TypeScript | 5.8.3 | Type Safety |
| ⚡ Vite | 7.1.6 | Build Tool & Dev Server |
| 🎨 Bootstrap | 5.3.8 | Styling Framework |
| 🧭 React Router | 7.9.1 | Routing |
| 🎭 React Bootstrap | 2.10.10 | UI Components |

### Backend ⚙️
| Technology | Version | Purpose |
|------------|---------|---------|
| 🐍 Django | 6.0.1 | Web Framework |
| 🔌 Django REST Framework | - | API Framework |
| 🌐 CORS Headers | - | Cross-Origin Support |
| 💾 SQLite | - | Database |

---

## 📁 Project Structure

### Backend Apps

- **🎬 movies/** - Movie management with poster, rating, video files
- **📺 series/** - TV series with seasons and episodes
- **📂 categories/** - Category system with slug support
- **👤 users/** - User authentication and profiles
- **🔧 common/** - Shared utilities and helpers

### Frontend Pages

- **🏠 Home** - Landing page
- **🎬 Movies** - Browse movies
- **📺 Series** - Browse TV series
- **🎭 Animations** - Animated content
- **📂 Categories** - Browse by category
- **🔍 Search** - Advanced search
- **ℹ️ About** - About page
- **📧 Contact** - Contact form

---

## 🔧 Development

### Frontend Commands

```bash
npm run dev      # 🚀 Start dev server
npm run build    # 📦 Build for production
npm run preview  # 👀 Preview production build
npm run lint     # 🔍 Run ESLint
```

### Backend Commands

```bash
python manage.py runserver      # 🚀 Start dev server
python manage.py makemigrations # 📝 Create migrations
python manage.py migrate        # 🔄 Apply migrations
python manage.py createsuperuser # 👤 Create admin user
python manage.py test           # 🧪 Run tests
```

---

## 🔒 Security Best Practices

> [!IMPORTANT]
> **Production Deployment Checklist**
> - [ ] Change `SECRET_KEY` in `settings.py`
> - [ ] Set `DEBUG = False`
> - [ ] Configure `ALLOWED_HOSTS`
> - [ ] Use environment variables for secrets
> - [ ] Set up proper CORS origins
> - [ ] Use HTTPS in production
> - [ ] Enable Django security features

---

## 📖 Documentation

- 📘 [Backend Documentation](backend/README.md)
- 📗 [Frontend Documentation](frontend/README.md)
- 🏛️ [Architecture Guide](ARCHITECTURE.md)
- 👨‍💻 [Professional Review](PROFESSIONAL_REVIEW.md)

---

## 🎯 API Endpoints

The Django REST Framework backend provides RESTful APIs for:

- `/api/movies/` - Movie CRUD operations
- `/api/series/` - Series CRUD operations
- `/api/categories/` - Category management
- `/api/users/` - User management

*(Full API documentation coming soon!)*

---

## 🚀 Deployment

### Frontend
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend
```bash
# Collect static files
python manage.py collectstatic

# Use gunicorn or similar WSGI server
gunicorn backend.wsgi:application
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is built with love and caffeine ☕ by the TOX team!

---

## 🎉 Get Started Now!

```bash
# Clone the repository
git clone <your-repo-url>
cd TOX

# Setup backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate

# Setup frontend (in new terminal)
cd frontend && npm install && npm run dev
```

**That's it! You're ready to experience the fastest streaming platform ever built! 🚀⚡**

---

<div align="center">
  <h3>⭐ If you love TOX, give it a star! ⭐</h3>
  <p>Built with 💖 using Django 🐍 + React ⚛️ + TypeScript 📘 + Vite ⚡</p>
</div>
