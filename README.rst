django-spa-admin
=================

https://github.com/vovababay/django-spa-admin


Description
-----------

*Django SPA Admin*

В urls.py нужно добавить
```python
from django.urls import path, include
urlpatterns += [path('', include('django_spa_admin.urls')),]
```