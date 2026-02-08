from django.contrib import admin

# Register your models here.
from .models import Movie

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_date', 'rating')
    search_fields = ('title',)
    autocomplete_fields = ['categories']
    prepopulated_fields = {"slug": ("title",)}
    
    fieldsets = (
        ("Content Information", {
            'fields': (('title', 'slug'), 'description', 'categories'),
        }),
        ("Video Source", {
            'fields': ('source_type', 'video_file', 'external_url'),
            'description': "Upload a file or provide an external link.",
        }),
        ("Media Assets", {
            'fields': (('poster', 'backdrop'),),
        }),
        ("Metadata", {
            'fields': (('rating', 'release_date', 'runtime'),),
        }),
    )

