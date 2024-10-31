from django.contrib import admin
from test_app.models import ArticleModel, Card


class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title',  'published', 'description')
    list_display_links = ('title', 'description')

class CardAdmin(admin.ModelAdmin):
    list_display = ('name', 'status')

admin.site.register(ArticleModel, ArticleAdmin)
admin.site.register(Card, CardAdmin)