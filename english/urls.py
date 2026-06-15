from django.urls import path
from rest_framework.routers import DefaultRouter

from .api import build_registry
from .menu_views import relations, schema, sections

router = DefaultRouter()
for prefix, viewset in build_registry():
    router.register(prefix, viewset, basename=prefix)

urlpatterns = [
    path('sections/', sections, name='sections'),
    path('schema/<str:table>/', schema, name='schema'),
    path('relations/<str:table>/', relations, name='relations'),
] + router.urls
