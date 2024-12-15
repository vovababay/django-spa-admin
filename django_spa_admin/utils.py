from typing import Union, Tuple, Type, Dict, Any

from django.contrib.admin import ModelAdmin
from django.db.models import Model
from rest_framework.exceptions import ValidationError

from django_spa_admin.registred_models import converted_dict


def to_bool(value: Union[str | int | bool]) -> bool:
    if value in ['false', 'False', 0, False]:
        return False
    return True


def get_model_data(**kwargs: Any) -> Tuple[Type[Model], Type[ModelAdmin]]:
    app_label = kwargs.get('app_label')
    model_name = kwargs.get('model_name')

    model_data: Dict[str, Any] = converted_dict.get((app_label, model_name))

    if not model_data:
        raise ValidationError({'error': [f'model {model_name} in app_label {app_label} not found']})

    model_class = model_data.get('model')
    admin_class = model_data.get('admin')

    return model_class, admin_class

def sort_fields_by_order(fields, order):
    order_dict = {key: index for index, key in enumerate(order)}
    sorted_fields = sorted(fields, key=lambda x: order_dict.get(x['name'], float('inf')))
    return sorted_fields


def get_widgets_by_admin_model(admin_model_class):
    # Проверка, что передан именно класс
    # if not isinstance(admin_model_class, type) or not issubclass(admin_model_class, admin.ModelAdmin):
    # raise TypeError("Expected a ModelAdmin class, got an instance or incorrect type instead.")

    # Создаём временный экземпляр класса ModelAdmin
    model = admin_model_class.model
    # print(admin_model_class.__dir__())
    # admin_instance = admin_model_class(model, admin.site)

    widgets = {}
    for field in model._meta.fields:
        formfield = admin_model_class.formfield_for_dbfield(field, request=None)

        if formfield and isinstance(formfield.widget, forms.Widget):
            widgets[field.name] = formfield.widget

    return widgets

