# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OcorrenciaViewSet

router = DefaultRouter()
router.register(r'ocorrencias', OcorrenciaViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
