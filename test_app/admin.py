from django.contrib import admin
from test_app.models import ArticleModel, Card


class ArticleAdmin(admin.ModelAdmin):
    model_name = 'article'


admin.site.register(ArticleModel, ArticleAdmin)
admin.site.register(Card)