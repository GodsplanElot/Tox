from django.contrib import admin

# Register your models here.
from apps.common.admin_roles import is_content_staff
from .models import Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

    def has_module_permission(self, request):
        return request.user.is_superuser or is_content_staff(request.user)

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or is_content_staff(request.user)

    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
