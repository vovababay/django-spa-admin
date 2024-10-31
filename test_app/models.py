from django.db import models



class ArticleModel(models.Model):
    title = models.CharField(verbose_name='Навзание', max_length=255, help_text='До 255 символов')
    description = models.TextField(verbose_name='Описание')
    published = models.BooleanField(default=False, verbose_name='Опубликовано')

    class Meta:
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'

class Card(models.Model):
    name = models.CharField(verbose_name='Навзание', max_length=255, help_text='До 255 символов')
    params = models.JSONField(verbose_name='Параметры')
    status = models.BooleanField(null=True)
    class Meta:
        verbose_name = 'Карточка'
        verbose_name_plural = 'Карточки'