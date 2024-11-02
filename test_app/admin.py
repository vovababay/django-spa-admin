from typing import Any
from django.contrib import admin
from django.db.models.query import QuerySet
from test_app.models import ArticleModel, Card


class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title',  'published', 'description')
    list_display_links = ('title', 'description')
    search_fields = ('id', 'title')

class CardAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'article')
    search_fields = ('id', 'name', 'article__title')

admin.site.register(ArticleModel, ArticleAdmin)
admin.site.register(Card, CardAdmin)