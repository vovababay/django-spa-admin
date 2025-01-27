import time
import traceback

from django.apps import apps
from django.contrib import admin
from django.contrib.admin.models import LogEntry, ACTION_FLAG_CHOICES, CHANGE, ADDITION
from django.contrib.contenttypes.models import ContentType
from django.db.models import NOT_PROVIDED
from django.views.decorators.csrf import csrf_exempt
from django.db.models.query import Q
from django.contrib.auth import authenticate, login, logout

from rest_framework.authentication import BasicAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.viewsets import ViewSet, GenericViewSet
from rest_framework.decorators import action

from django_spa_admin.serializers import DynamicModelListSerializer, DynamicModelRetrieveSerializer
from django_spa_admin.paginator import AdminPageNumberPagination
from django_spa_admin.registred_models import converted_dict, app_verbose_names

from django import forms

from django_spa_admin.utils import to_bool, get_model_data, sort_fields_by_order


class ModelViewSet(ViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def paginate_queryset(self, request, queryset, model_class):
        pagination_class = AdminPageNumberPagination()
        page = pagination_class.paginate_queryset(queryset=queryset, request=request)
        if page is not None:
            serialized_data = DynamicModelListSerializer(page, model_class=model_class, many=True).data
            return pagination_class.get_paginated_response(serialized_data)
        serialized_data = DynamicModelListSerializer(queryset, model_class=model_class, many=True).data
        return Response(data=serialized_data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        model_class, admin_class = get_model_data(**kwargs)
        query_params = request.query_params
        search_term = query_params.get('q', None)
        query = Q()
        if search_term:
            search_fields = admin_class.search_fields if admin_class.search_fields else []
            for search_field in search_fields:
                query |= Q(**{f'{search_field}__icontains': search_term})
        try:
            queryset =model_class.objects.filter(query)
        except Exception as exc:
            return Response(data={'errors': [str(exc)]}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order_by_params = query_params.get('o', '')
            if not order_by_params:
                order_by_params = []
            else:
                order_by_params = order_by_params.split('.')
            list_display_fields_by_position = {}
            for index, field in enumerate(admin_class.list_display):
                list_display_fields_by_position[index +1] = field
            order = []
            for order_by_field in order_by_params:
                prefix = ''
                if order_by_field.startswith('-'):
                    prefix = '-'
                    order_by_field = order_by_field.replace('-', '')
                order_by_field = int(order_by_field)

                field = list_display_fields_by_position.get(order_by_field)
                order.append('{}{}'.format(prefix, field))
            queryset = queryset.order_by(*order)
        except Exception as exc:
            return Response(data={'errors': [str(exc)]}, status=status.HTTP_400_BAD_REQUEST)
        paginate = to_bool(query_params.get('paginate', True))
        if not paginate:
            data = DynamicModelListSerializer(queryset.all(), model_class=model_class, many=True).data
            return Response(data=data, status=404)
        return self.paginate_queryset(request=request, queryset=queryset, model_class=model_class)

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        model_class, admin_class = get_model_data(**kwargs)
        try:
            queryset = model_class.objects.get(pk=pk)
        except model_class.DoesNotExist:
            return Response(data={'error': ['object does not exist']}, status=status.HTTP_400_BAD_REQUEST)
        serialized_data = DynamicModelRetrieveSerializer(queryset,
                                                         model_class=model_class,
                                                         admin_class=admin_class).data
        return Response(data=serialized_data, status=status.HTTP_200_OK)

    @csrf_exempt
    def create(self, request, *args, **kwargs):
        model_class, admin_class = get_model_data(**kwargs)
        serializer = DynamicModelRetrieveSerializer(data=request.data,
                                                         model_class=model_class,
                                                         admin_class=admin_class)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        serialized_data = serializer.data
        content_type = ContentType.objects.get_for_model(model_class)
        LogEntry.objects.create(user=request.user, content_type=content_type, object_id=serializer.instance.id,
                                action_flag=ADDITION, object_repr=serializer.instance.__str__())
        return Response(data=serialized_data, status=status.HTTP_200_OK)

    @csrf_exempt
    def delete(self, request, *args, **kwargs):
        return Response(data={'action': 'delete'}, status=status.HTTP_200_OK)

    @csrf_exempt
    def partial_update(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        model_class, admin_class = get_model_data(**kwargs)
        try:
            queryset = model_class.objects.get(pk=pk)
        except model_class.DoesNotExist:
            return Response(data={'error': ['object does not exist']}, status=status.HTTP_400_BAD_REQUEST)
        serializer = DynamicModelRetrieveSerializer(queryset, data=request.data, partial=True,
                                                    model_class=model_class, admin_class=admin_class)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        serialized_data = serializer.data
        content_type = ContentType.objects.get_for_model(model_class)
        # TODO: edit change_message, add changed fields
        change_message = 'Изменено'

        LogEntry.objects.create(user=request.user, content_type=content_type, object_id=serializer.instance.id,
                                action_flag=CHANGE, change_message=change_message,
                                object_repr=serializer.instance.__str__())
        return Response(data=serialized_data, status=status.HTTP_200_OK)

    @csrf_exempt
    def update(self, request, *args, **kwargs):
        return Response(data={'action': 'update'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='call_action')
    def call_action(self, request, *args, **kwargs):
        from django.test import RequestFactory
        from django.http import QueryDict
        model_class, admin_class = get_model_data(**kwargs)

        actions = admin_class.get_actions(request)
        action_name = request.data.get('action')
        if action_name not in actions:
            return Response(data={'errors': ['Такого действия нет']}, status=status.HTTP_400_BAD_REQUEST)
        object_ids = request.data.get('objects')
        # select_across: 0
        action = actions.get(action_name)
        action_func = action[0]
        queryset = model_class.objects.filter(pk__in=object_ids)
        factory = RequestFactory()
        new_request = factory.post(request.path, data=request.data)
        new_request.user = request.user
        new_request._messages = request._messages
        new_request.POST = QueryDict(mutable=True)
        new_request.POST['post'] = 'yes'
        a = action_func(admin_class, new_request, queryset)
        return Response(data={}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='meta')
    def meta(self, request, *args, **kwargs):
        model_class, admin_class = get_model_data(**kwargs)
        list_display_fields = [
            {
                'name': field.name,
                'verbose_name': field.verbose_name,
                'type': field.get_internal_type()
            }
            for field in model_class._meta.fields
        ]
        list_display_fields = [field for field in list_display_fields if field['name'] in admin_class.list_display]
        if not list_display_fields:
            list_display_fields = [{'name': 'object__str__', 'verbose_name': model_class._meta.verbose_name}]
        list_display_fields = sort_fields_by_order(list_display_fields, admin_class.list_display)
        list_display_links = admin_class.list_display_links
        if not list_display_links:
            list_display_links = [list_display_fields[0]['name']]
        search_fields = admin_class.search_fields if admin_class.search_fields else []
        actions = admin_class.get_actions(request)
        actions_data = []

        fields = []
        for field in model_class._meta.fields:
            data_field = {
                "name": field.name,
                "type": field.get_internal_type(),
                "verbose_name": field.verbose_name.capitalize(),
                "is_primary_key": field.primary_key,
                'readonly': True if field.name in admin_class.readonly_fields else False,
                'null': field.null,
                'blank': field.blank,
                'help_text': field.help_text,
            }

            if field.default == NOT_PROVIDED:
                default_value = None
            elif callable(field.default):
                default_value = field.default()
            else:
                default_value = field.default
            data_field.update(default=default_value)
            fields.append(data_field)

        for action_name, data in actions.items():
            actions_data.append(
                {
                    'key': data[1],
                    'label': data[2] % {'verbose_name_plural': model_class._meta.verbose_name_plural}
                }
            )
        data = {
            'list_display': list_display_fields,
            'list_display_links': list_display_links,
            'exists_search': len(search_fields) > 0,
            'actions': actions_data,
            'fields': fields
        }
        return Response(data=data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        app_label = kwargs.get('app_label')
        model_name = kwargs.get('model_name')
        model = apps.get_model(app_label=app_label, model_name=model_name)
        try:
            instance = model.objects.get(id=pk)
        except model.DoesNotExist as exc:
            return Response(status=status.HTTP_404_NOT_FOUND)
        content_type = ContentType.objects.get_for_model(model)
        recent_actions = LogEntry.objects.filter(object_id=pk, content_type=content_type).order_by('-action_time')
        actions = [
            {
                'user': str(log_action.user),
                'action_time': log_action.action_time,
                'action': log_action.get_action_flag_display(),
                'object': log_action.object_repr,
                'app_label': content_type.app_label,
                'model_name': content_type.model,
                'id': log_action.object_id,
                'action_flag': log_action.action_flag,
                'change_message': log_action.get_change_message()
            }
            for log_action in recent_actions
        ]
        data = {
            'object': {
                'id': instance.id,
                '__str__': str(instance)
            },
            'actions': actions
        }
        return Response(data=data, status=status.HTTP_200_OK)
