from django.urls import path
from . import views

urlpatterns = [
    path('presigned-url/<str:content_type>/<int:object_id>/', views.get_presigned_url, name='get_presigned_url'),
]
