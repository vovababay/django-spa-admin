from time import perf_counter

from django.contrib import admin
from isort.profiles import black
from rest_framework import serializers



class DynamicModelListSerializer(serializers.ModelSerializer):
    object__str__ = serializers.CharField(source='__str__')
    pk = serializers.CharField()

    class Meta:
        model = None
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        model_class = kwargs.pop('model_class', None)
        
        if model_class:
            self.Meta.model = model_class
        
        super(DynamicModelListSerializer, self).__init__(*args, **kwargs)

class DynamicModelRetrieveSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = None
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        model_class = kwargs.pop('model_class', None)
        self.admin_class = kwargs.pop('admin_class', None)
        if model_class:
            self.Meta.model = model_class
        super(DynamicModelRetrieveSerializer, self).__init__(*args, **kwargs)
    
    def capitalize_first_letter(self, text):
        return text.capitalize()

    def get_related_field(self, inline_class, model_class):
        parent_model = inline_class.parent_model
        return next(
            (field.name for field in model_class._meta.get_fields()
             if field.is_relation and field.related_model == parent_model),
            None
        )

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        formatted_data = {}
        inlines = []

        if hasattr(self.admin_class, 'inlines'):
            for inline in self.admin_class.inlines:
                type_inline = None
                if issubclass(inline, admin.StackedInline):
                    type_inline = 'StackedInline'
                elif issubclass(inline, admin.TabularInline):
                    type_inline = 'TabularInline'
                related_field = self.get_related_field(inline(self.Meta.model, admin.site), inline.model)
                query = {related_field: instance}
                objects = inline.model.objects.filter(**query)
                inlines.append(
                    {
                        'type': type_inline,
                        'model_name': inline.model._meta.model_name,
                        'verbose_name': inline.model._meta.verbose_name,
                        'verbose_name_plural': inline.model._meta.verbose_name_plural,
                        'extra': inline.extra,
                        'objects': DynamicModelListSerializer(objects, model_class=inline.model, many=True).data
                    }
                )
        for field_name, value in representation.items():
            field = self.Meta.model._meta.get_field(field_name)
            formatted_data[field_name] = {
                "value": value,
                "type": field.get_internal_type(),
                "verbose_name": self.capitalize_first_letter(field.verbose_name),
                "is_primary_key": field.primary_key,
                'readonly': True if field.name in self.admin_class.readonly_fields else False,
                'null': field.null,
                'blank': field.blank,
                'help_text': field.help_text
            }
        formatted_data['inlines'] = inlines
        return formatted_data