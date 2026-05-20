from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = "TOX Admin"
admin.site.site_title = "TOX Admin"
admin.site.index_title = "Content Management"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/movies/", include("apps.movies.urls")),
    path("api/series/", include("apps.series.urls")),
    path("api/categories/", include("apps.categories.urls")),
    path("api/users/", include("apps.users.urls")),
    path("api/watchlist/", include("apps.watchlist.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
