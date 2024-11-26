import os
from django.conf import settings

# Добавляем приложения в INSTALLED_APPS
DEFAULT_APPS = [
    'rest_framework',
    'webpack_loader',
    'corsheaders',
]

for app in DEFAULT_APPS:
    if app not in settings.INSTALLED_APPS:
        settings.INSTALLED_APPS.append(app)

# Добавляем middleware
DEFAULT_MIDDLEWARE = 'corsheaders.middleware.CorsMiddleware'
if DEFAULT_MIDDLEWARE not in settings.MIDDLEWARE:
    settings.MIDDLEWARE.insert(0, DEFAULT_MIDDLEWARE)  # Важно добавить CORS в начало

# Добавляем статические директории
STATICFILES_DIR = os.path.join(settings.BASE_DIR, settings.STATIC_ROOT, 'django_spa_admin/js/')
if STATICFILES_DIR not in settings.STATICFILES_DIRS:
    settings.STATICFILES_DIRS.append(STATICFILES_DIR)

# Конфигурация webpack_loader
if not hasattr(settings, 'WEBPACK_LOADER'):
    settings.WEBPACK_LOADER = {
        'DEFAULT': {
            'CACHE': not settings.DEBUG,
            'BUNDLE_DIR_NAME': settings.STATIC_ROOT,
            'STATS_FILE': os.path.join(settings.BASE_DIR, 'django_spa_admin', 'frontend', 'webpack-stats.json'),
            'POLL_INTERVAL': 0.1,
            'TIMEOUT': None,
        }
    }
