import traceback

from django.contrib import admin
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


class AppViewSet(ViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

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