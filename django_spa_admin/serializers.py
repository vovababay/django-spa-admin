from rest_framework import serializers



class DynamicModelSerializer(serializers.ModelSerializer):
    object__str__ = serializers.CharField(source='__str__')

    class Meta:
        model = None
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        model_class = kwargs.pop('model_class', None)
        
        if model_class:
            self.Meta.model = model_class
        
        super(DynamicModelSerializer, self).__init__(*args, **kwargs)
