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

class SideBarView(ViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
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


class LastActionsViewSet(ViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
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
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

