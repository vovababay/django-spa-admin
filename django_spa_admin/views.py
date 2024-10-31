from collections import defaultdict
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
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.viewsets import ViewSet
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action

from django_spa_admin.serializers import DynamicModelListSerializer, DynamicModelRetrieveSerializer
from django_spa_admin.paginator import AdminPageNumberPagination
from django_spa_admin.registred_models import converted_dict, app_verbose_names


class TestViewSet(ViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

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
            serialized_data = DynamicModelListSerializer(page, model_class=model_class, many=True).data
            return pagination_class.get_paginated_response(serialized_data)
        serialized_data = DynamicModelListSerializer(queryset, model_class=model_class, many=True).data
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
        serialized_data = DynamicModelRetrieveSerializer(obj, model_class=model_class).data
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
        fields = [{'name': field.name, 'verbose_name': field.verbose_name, 'type': field.get_internal_type()} for field in model_class._meta.fields]
        fields = [field for field in fields if field['name'] in admin_class.list_display]
        if not fields:
            fields = [{'name': 'object__str__', 'verbose_name': model_class._meta.verbose_name}]
        fields = self.sort_fields_by_order(fields, admin_class.list_display)
        list_display_links = admin_class.list_display_links
        if not list_display_links:
            list_display_links = [fields[0]['name']]
        return Response(data={'fields': fields, 'list_display_links': list_display_links}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='app_models')
    def app_models(self, request, *args, **kwargs):
        app_label = kwargs.get('app_label')
        data = {}
        for model_meta_data, model_class in converted_dict.items():
            if model_meta_data[0] != app_label:
                continue
            if model_meta_data[0] not in data:
                data[model_meta_data[0]] = {}
            if 'models' not in data[model_meta_data[0]]:
                data[model_meta_data[0]]['models'] = list()
            data[model_meta_data[0]]['models'].append(
                {
                    'model_name': model_meta_data[1],
                    'verbose_name': model_class['model']._meta.verbose_name.title(),
                    'verbose_name_plural': model_class['model']._meta.verbose_name_plural.title(),
                }
            )
            data[model_meta_data[0]]['verbose_name'] = app_verbose_names.get(model_meta_data[0])
        return Response(data=data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='last_actions')
    def last_actions(self, request, *args, **kwargs):
        from django.contrib.admin.models import LogEntry
        from django.contrib.contenttypes.models import ContentType
        content_type_by_id = ContentType.objects.in_bulk(field_name='id')
        recent_actions = LogEntry.objects.filter(user=request.user).order_by('-action_time')[:10]
        actions = []

        for action in recent_actions:
            content_type = content_type_by_id.get(action.content_type_id)
            actions.append(
                {
                    'user': str(action.user),
                    'action_time': action.action_time,
                    'action': action.get_action_flag_display(),
                    'object': action.object_repr,
                    'app_label': content_type.app_label,
                    'model_name': content_type.model,
                    'id': action.object_id,
                    'action_flag': action.action_flag
                }
            )
        return Response(data=actions, status=status.HTTP_200_OK)



class SideBarView(ViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def list(sele, request, *args, **kwargs):
        side_bar = {}
        for model_meta_data, model_class in converted_dict.items():
            if model_meta_data[0] not in side_bar:
                side_bar[model_meta_data[0]] = {}
            if 'models' not in side_bar[model_meta_data[0]]:
                side_bar[model_meta_data[0]]['models'] = list()
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
        print(username, password)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]
    
    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

