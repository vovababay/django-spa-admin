from datetime import datetime, date
from typing import Union, Tuple, Type, Dict, Any

from django.conf import settings
from django.contrib.admin import ModelAdmin
from django.db.models import Model
from django.db.models import ForeignKey, ManyToOneRel, DateTimeField, DateField, ManyToManyField, ManyToManyRel
from django.db.models.fields.related import ReverseManyToOneDescriptor
from django.forms import forms
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


def get_change_message(queryset, old_data):
    changed_fields = [
        str(field.verbose_name)
        for field in queryset._meta.get_fields()
        if hasattr(queryset, field.name) and getattr(queryset, field.name, None) != old_data.get(field.name)
    ]

    match len(changed_fields):
        case 0:
            return "Ни одно поле не изменено."
        case 1:
            return f"Изменено {changed_fields[0]}"
        case 2:
            return f"Изменено {changed_fields[0]} и {changed_fields[1]}"
        case _:
            return f"Изменено {', '.join(changed_fields[:-1])} и {changed_fields[-1]}"


def get_state_object(obj) -> dict:
    state = {}
    for field in obj._meta.get_fields():
        if not hasattr(obj, field.name):
            continue
        value_field = getattr(obj, field.name)
        if isinstance(field, ManyToOneRel):
            continue
        elif isinstance(field, ManyToManyField):
            continue
        elif isinstance(field, ManyToManyRel):
            continue
        elif isinstance(field, ReverseManyToOneDescriptor):
            continue
        elif isinstance(field, ForeignKey):
            state.update({field.name: None, '{}_id'.format(field.name): None})
            if value_field:
                # if get_relation_name:
                #     state.update({field.name: str(value_field), '{}_id'.format(field.name): value_field.id})
                # else:
                state.update({'{}_id'.format(field.name): value_field.id})
        elif isinstance(field, DateTimeField):
            state.update({field.name: None})
            if isinstance(value_field, datetime):
                state.update({field.name: value_field.strftime(settings.DATETIME_FORMAT)})
            else:
                state.update({field.name: value_field})
        elif isinstance(field, DateField):
            state.update({field.name: None})
            if isinstance(value_field, date):
                state.update({field.name: value_field.strftime(settings.DATE_FORMAT)})
            else:
                state.update({field.name: value_field})
        else:
            state.update({field.name: value_field})
    return state

