import subprocess
import sys
import textwrap
import unittest


class MinimalInstallationTests(unittest.TestCase):
    def test_admin_page_loads_without_optional_django_apps(self):
        script = textwrap.dedent(
            """
            from django.conf import settings

            settings.configure(
                SECRET_KEY="test-secret-key",
                ROOT_URLCONF="django_spa_admin.urls",
                ALLOWED_HOSTS=["testserver"],
                INSTALLED_APPS=[
                    "django.contrib.admin",
                    "django.contrib.auth",
                    "django.contrib.contenttypes",
                    "django.contrib.sessions",
                    "django.contrib.messages",
                    "django.contrib.staticfiles",
                    "django_spa_admin",
                ],
                MIDDLEWARE=[],
                TEMPLATES=[
                    {
                        "BACKEND": "django.template.backends.django.DjangoTemplates",
                        "APP_DIRS": True,
                    }
                ],
                STATIC_URL="/static/",
            )

            import django

            django.setup()

            from django.test import Client

            response = Client().get("/django_spa/admin/")
            assert response.status_code == 200, response.status_code
            assert b'/static/django_spa_admin/js/bundle.js' in response.content

            api_response = Client(HTTP_ACCEPT="text/html").get(
                "/django_spa/api/side_bar/"
            )
            assert api_response.status_code == 406, api_response.status_code
            assert api_response.headers["Content-Type"].startswith("application/json")
            """
        )

        result = subprocess.run(
            [sys.executable, "-c", script],
            capture_output=True,
            text=True,
        )

        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
