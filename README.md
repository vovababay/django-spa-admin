# django-spa-admin

В urls.py нужно добавить
```python
from django.urls import path, include
urlpatterns += [path('', include('django_spa_admin.urls')),]
```