# django-spa-admin

SPA-интерфейс администрирования для моделей, зарегистрированных в стандартном
Django Admin. Backend построен на Django REST Framework, frontend — на React и
Ant Design.

## Требования

- Django 4.2 или новее;
- настроенные стандартные приложения Django Admin, auth, sessions и staticfiles.

`djangorestframework` устанавливается автоматически как зависимость пакета. Его
не нужно отдельно добавлять в `INSTALLED_APPS`. Пакеты `django-webpack-loader` и
`django-cors-headers` не требуются.

## Установка

Установите актуальную версию из GitHub:

```bash
python -m pip install git+https://github.com/vovababay/django-spa-admin.git
```

Добавьте приложение в `settings.py`. В стандартном Django-проекте достаточно
одной дополнительной записи:

```python
INSTALLED_APPS += [
    "django_spa_admin",
]
```

Подключите маршруты в корневом `urls.py` проекта:

```python
from django.urls import include, path

urlpatterns += [
    path("", include("django_spa_admin.urls")),
]
```

Примените миграции проекта и создайте пользователя, если этого ещё не делали:

```bash
python manage.py migrate
python manage.py createsuperuser
```

Запустите Django и откройте:

```text
http://127.0.0.1:8000/django_spa/admin/
```

Интерфейс показывает модели, зарегистрированные через `admin.site.register()`
или декоратор `@admin.register(...)`, и использует настройки соответствующего
`ModelAdmin`, включая `list_display`, `search_fields`, `readonly_fields`,
`inlines` и admin actions.

В production-среде соберите статику обычной командой Django:

```bash
python manage.py collectstatic
```

## Локальная разработка

Установите Python-пакет из рабочей копии:

```bash
python -m pip install -e .
```

Для frontend нужен Node.js 18. Установите зависимости и запустите webpack dev
server:

```bash
cd django_spa_admin/frontend
npm ci
npm run start
```

Production-сборка frontend записывает `bundle.js` в
`django_spa_admin/static/django_spa_admin/js/`:

```bash
npm run build
```

## Лицензия

[MIT](LICENSE)
