# django-spa-admin

### В settings.py нужно добавить
```python
INSTALLED_APPS += [
    'rest_framework',
    'webpack_loader',
    'corsheaders',
    'django_spa_admin',
]
```


### В urls.py нужно добавить эту настройку
```python
from django.urls import path, include
urlpatterns += [path('', include('django_spa_admin.urls')),]
```

# develop

###  !!! use npm v18
### Запуск фронта в hot-reload
```commandline
npx webpack serve
```