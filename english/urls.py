from django.urls import path
from rest_framework.routers import DefaultRouter

from .api import build_registry
from .auth_views import login_view, logout_view, whoami
from .menu_views import relations, schema, sections

router = DefaultRouter()
for prefix, viewset in build_registry():
    router.register(prefix, viewset, basename=prefix)

urlpatterns = [
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/whoami/', whoami, name='whoami'),
    path('sections/', sections, name='sections'),
    path('schema/<str:table>/', schema, name='schema'),
    path('relations/<str:table>/', relations, name='relations'),
] + router.urls
