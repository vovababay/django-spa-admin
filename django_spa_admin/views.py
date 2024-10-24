from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models.query import QuerySet
from django.contrib.auth import authenticate, login, logout

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework.viewsets import ViewSet
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action

from django_spa_admin.serializers import DynamicModelSerializer
from django_spa_admin.paginator import AdminPageNumberPagination
from django_spa_admin.registred_models import converted_dict, app_verbose_names


class TestViewSet(ViewSet):
    permission_classes = [AllowAny]

    def serialize(self, model_class, data):
        many = False
        if isinstance(data, QuerySet|list):
            many = True
        return DynamicModelSerializer(data, model_class=model_class, many=many).data

    def get_model_data(self, request, *args, **kwargs):
        app_label = kwargs.get('app_label')
        model_name = kwargs.get('model_name')
        model_data = converted_dict.get((app_label, model_name))
        if not model_data:
            raise ValidationError({'error': [f'model {model_name} in app_label {app_label} not found']})
        model_class = model_data.get('model')
        admin_class = model_data.get('admin')
        return model_class, admin_class

    def paginate_queryset(self, request, queryset, model_class):
        pagination_class = AdminPageNumberPagination()
        page = pagination_class.paginate_queryset(queryset=queryset, request=request)
        if page is not None:
            serialized_data = self.serialize(data=page, model_class=model_class)
            return pagination_class.get_paginated_response(serialized_data)
        serialized_data = self.serialize(data=queryset, model_class=model_class)
        return Response(data=serialized_data, status=status.HTTP_200_OK)
    
    def list(self, request, *args, **kwargs):
        model_class, admin_class = self.get_model_data(request, *args, **kwargs)
        queryset=model_class.objects.all()
        
        return self.paginate_queryset(request=request, queryset=queryset, model_class=model_class)
        

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        model_class, admin_class = self.get_model_data(request, *args, **kwargs)
        try:
            obj = model_class.objects.get(pk=pk)
        except model_class.DoesNotExist:
            return Response(data={'error': ['object does not exist']}, status=status.HTTP_400_BAD_REQUEST)
        serialized_data = self.serialize(data=obj, model_class=model_class)
        return Response(data=serialized_data, status=status.HTTP_200_OK)

    @csrf_exempt
    def create(self, request, *args, **kwargs):
        return Response(data={'action': 'create'}, status=status.HTTP_200_OK)

    @csrf_exempt
    def delete(self, request, *args, **kwargs):
        return Response(data={'action': 'delete'}, status=status.HTTP_200_OK)
    
    @csrf_exempt
    def partial_update(self, request, *args, **kwargs):
        return Response(data={'action': 'partial_update'}, status=status.HTTP_200_OK)
    
    @csrf_exempt
    def update(self, request, *args, **kwargs):
        return Response(data={'action': 'update'}, status=status.HTTP_200_OK)

    def sort_fields_by_order(self, fields, order):
        order_dict = {key: index for index, key in enumerate(order)}
        sorted_fields = sorted(fields, key=lambda x: order_dict.get(x['name'], float('inf')))
        return sorted_fields


    @action(detail=False, methods=['get'], url_path='fields')
    def fields(self, request, *args, **kwargs):
        model_class, admin_class = self.get_model_data(request, *args, **kwargs)
        print()
        fields = [{'name': field.name, 'verbose_name': field.verbose_name} for field in model_class._meta.fields]
        fields = [field for field in fields if field['name'] in admin_class.list_display]
        if not fields:
            fields = [{'name': 'object__str__', 'verbose_name': model_class._meta.verbose_name}]
        fields = self.sort_fields_by_order(fields, admin_class.list_display)
        list_display_links = admin_class.list_display_links
        if not list_display_links:
            list_display_links = [fields[0]['name']]
        return Response(data={'fields': fields, 'list_display_links': list_display_links}, status=status.HTTP_200_OK)

class SideBarView(ViewSet):
    def list(sele, request, *args, **kwargs):
        side_bar = {}
        for model_meta_data, model_class in converted_dict.items():
            if model_meta_data[0] not in side_bar:
                side_bar[model_meta_data[0]] = {}
            if 'models' not in side_bar[model_meta_data[0]]:
                side_bar[model_meta_data[0]]['models'] = list()
            # print(model_class['model']._meta.__dict__)
            side_bar[model_meta_data[0]]['models'].append(
                {
                    'model_name': model_meta_data[1],
                    'verbose_name': model_class['model']._meta.verbose_name.title(),
                    'verbose_name_plural': model_class['model']._meta.verbose_name_plural.title(),
                }
            )
            side_bar[model_meta_data[0]]['verbose_name'] = app_verbose_names.get(model_meta_data[0])
        return Response(data=side_bar, status=status.HTTP_200_OK)




class ExampleView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        content = {
            'user': str(request.user),
            'auth': str(request.auth),
        }
        return Response(content)
    

class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [SessionAuthentication]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    authentication_classes = [SessionAuthentication]
    
    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

