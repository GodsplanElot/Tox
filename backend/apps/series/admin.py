from django.contrib import admin

# Register your models here.
from .models import Series
from .models import Season
from .models import Episode
from .models import EpisodeVideo

admin.site.register(Series)
admin.site.register(Season)
admin.site.register(Episode)
admin.site.register(EpisodeVideo)
