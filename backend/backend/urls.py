from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("_nested_admin/", include("nested_admin.urls")),
    path("api/movies/", include("apps.movies.urls")),
    path("api/series/", include("apps.series.urls")),
    path("api/categories/", include("apps.categories.urls")),
    path("api/users/", include("apps.users.urls")),
]
