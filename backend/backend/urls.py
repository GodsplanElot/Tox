from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("_nested_admin/", include("nested_admin.urls")),
    path("api/movies/", include("apps.movies.urls")),
    path("api/series/", include("apps.series.urls")),
    path("api/categories/", include("apps.categories.urls")),
    path("api/users/", include("apps.users.urls")),
    path("api/common/", include("apps.common.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
