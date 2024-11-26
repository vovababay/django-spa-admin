from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter

from django_spa_admin.views import (
    LoginView, LogoutView, ModelViewSet, SideBarView, AppViewSet, LastActionsViewSet)

from django.shortcuts import render

def index(request, **kwargs):
    return render(request, 'index.html')

def new_page_view(request):
    return render(request, 'index.html')

router = DefaultRouter()
router.register(r'side_bar', SideBarView, basename='side_bar')
router.register(r'(?P<app_label>[^/.]+)', AppViewSet, basename='app')
router.register(r'(?P<app_label>[^/.]+)/(?P<model_name>[^/.]+)', ModelViewSet, basename='model')
router.register(r'last_actions', LastActionsViewSet, basename='last_actions')

urlpatterns = [
    re_path(r'^django_spa/admin/.*$', index, name='django_spa_all_pages'),
    path('django_spa/api/login/', LoginView.as_view(), name='login'),
    path('django_spa/api/logout/', LogoutView.as_view(), name='logout'),
    path('django_spa/api/', include(router.urls)),
]
