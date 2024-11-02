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
        if model_class:
            self.Meta.model = model_class
        super(DynamicModelRetrieveSerializer, self).__init__(*args, **kwargs)
    
    def capitalize_first_letter(self, text):
        return text.capitalize()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        formatted_data = {}

        for field_name, value in representation.items():
            field = self.Meta.model._meta.get_field(field_name)
            print(field.__dict__)
            formatted_data[field_name] = {
                "value": value,
                "type": field.get_internal_type(),
                "verbose_name": self.capitalize_first_letter(field.verbose_name),
                "is_primary_key": field.primary_key
            }
        
        return formatted_data