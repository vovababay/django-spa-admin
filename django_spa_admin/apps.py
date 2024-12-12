from django.apps import AppConfig
from django.conf import settings
import os
from importlib.resources import files


class DjangoSpaAdminConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'django_spa_admin'
    verbose_name = 'Django SPA Admin'

    def ready(self):
    #     print("django_spa_admin ready() called")
    #     # Добавление приложений в INSTALLED_APPS
    #     default_apps = [
    #         'rest_framework',
    #         'webpack_loader',
    #         'corsheaders',
    #     ]
    #     new_default_apps = []
    # #
    #     for app in default_apps:
    #         if app not in settings.INSTALLED_APPS:
    #             new_default_apps.append(app)
    #
    #     settings.INSTALLED_APPS =  new_default_apps + settings.INSTALLED_APPS
    #     print('ready(): INSTALLED_APPS: {}'.format(settings.INSTALLED_APPS))
    #     settings.INSTALLED_APPS = ['12112312312']
    #     # Добавление middleware
    #     middleware = 'corsheaders.middleware.CorsMiddleware'
    #     if middleware not in settings.MIDDLEWARE:
    #         settings.MIDDLEWARE.insert(0, middleware)  # Вставляем в начало списка
    #
    #     # Добавление статической директории
        static_dir = files('django_spa_admin').joinpath('static', 'django_spa_admin', 'js')
        if static_dir not in settings.STATICFILES_DIRS:
            settings.STATICFILES_DIRS.append(static_dir)
    #
    #     # Настройка webpack_loader
        if not hasattr(settings, 'WEBPACK_LOADER'):

            settings.WEBPACK_LOADER = {
                'DEFAULT': {
                    'CACHE': not settings.DEBUG,
                    'BUNDLE_DIR_NAME': settings.STATIC_ROOT,
                    'STATS_FILE': files('django_spa_admin').joinpath('frontend', 'webpack-stats.json'),
                    'POLL_INTERVAL': 0.1,
                    'TIMEOUT': None,
                }
            }

