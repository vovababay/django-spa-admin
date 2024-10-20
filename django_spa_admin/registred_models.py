from django.contrib import admin
from django.apps import apps

registered_models = admin.site._registry

converted_dict = {
        (
            model._meta.app_label, 
            model._meta.model_name if not hasattr(admin_class, 'model_name') else admin_class.model_name,

            ): {
            'model': model,
            'admin': admin_class
            }
            for model, admin_class in registered_models.items()
            }

def get_app_verbose_names():
    app_verbose_names = {}
    for app_config in apps.get_app_configs():
        app_verbose_names[app_config.label] = app_config.verbose_name
    return app_verbose_names

app_verbose_names = get_app_verbose_names()