from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter

from django_spa_admin.views import ExampleView, LoginView, LogoutView, TestViewSet, SideBarView

from django.shortcuts import render

def index(request, **kwargs):
    return render(request, 'index.html')

def new_page_view(request):
    return render(request, 'index.html')

router = DefaultRouter()
router.register(r'side_bar', SideBarView, basename='side_bar')

urlpatterns = [
    # path('django_spa/admin/', index, name='index'),
    # path('django_spa/admin/<str:app_label>/<str:model_name>/', index, name='new_page_view'),
    re_path(r'^django_spa/admin/.*$', index, name='django_spa_all_pages'),
    path('django_spa/api/<str:app_label>/<str:model_name>/meta/', TestViewSet.as_view(
        {
            'get': 'meta_data',
        }
    ), name='test-list'),
    path('django_spa/api/last_actions/', TestViewSet.as_view(
        {
            'get': 'last_actions',
        }
    ), name='test-list'),
    path('django_spa/api/<str:app_label>/app_models/', TestViewSet.as_view(
        {
            'get': 'app_models',
        }
    ), name='test-list'),
    path('django_spa/api/<str:app_label>/<str:model_name>/', TestViewSet.as_view(
        {
            'get': 'list',
            'post': 'create'
        }
    ), name='test-list'),
    path('django_spa/api/<str:app_label>/<str:model_name>/<int:pk>/', TestViewSet.as_view(
        {
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update',
            'delete': 'delete'
        }
    ), name='test-detail'),
    path('django_spa/api/ex/', ExampleView.as_view(), name='ex'),
    path('django_spa/api/login/', LoginView.as_view(), name='login'),
    path('django_spa/api/logout/', LogoutView.as_view(), name='logout'),
    path('django_spa/api/', include(router.urls)),
]



