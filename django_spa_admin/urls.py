from django.urls import path, include
from rest_framework.routers import DefaultRouter

from django_spa_admin.views import ExampleView, LoginView, LogoutView, TestViewSet, SideBarView


router = DefaultRouter()
router.register(r'side_bar', SideBarView, basename='side_bar')


urlpatterns = [
    path('django_spa_admin/<str:app_label>/<str:model_name>/', TestViewSet.as_view(
        {
            'get': 'list',
            'post': 'create'
        }
    ), name='test-list'),
    path('django_spa_admin/<str:app_label>/<str:model_name>/<int:pk>/', TestViewSet.as_view(
        {
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update',
            'delete': 'delete'
        }
    ), name='test-detail'),
    path('django_spa_admin/ex/', ExampleView.as_view(), name='ex'),
    path('django_spa_admin/login/', LoginView.as_view(), name='login'),
    path('django_spa_admin/logout/', LogoutView.as_view(), name='logout'),
    path('django_spa_admin/', include(router.urls)),
]
