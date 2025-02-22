from django.apps import AppConfig
from django.conf import settings
from importlib.resources import files


class DjangoSpaAdminConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'django_spa_admin'
    verbose_name = 'Django SPA Admin'

    def setup_webpack(self):
        # Добавление статической директории
        static_dir = files('django_spa_admin').joinpath('static', 'django_spa_admin', 'js')
        if static_dir not in settings.STATICFILES_DIRS:
            settings.STATICFILES_DIRS.append(static_dir)

        # Настройка webpack_loader
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

    def ready(self):
        required_apps = [
            "rest_framework",
            "webpack_loader",
            "corsheaders",
        ]
        missing_apps = [app for app in required_apps if app not in settings.INSTALLED_APPS]
        if missing_apps:
            raise RuntimeError(f"Необходимо добавить в INSTALLED_APPS: {', '.join(missing_apps)}")

        self.setup_webpack()
