from rest_framework.routers import DefaultRouter
from django.urls import path, include
from app.urls import *


router = DefaultRouter()
router.registry.extend(officer_router.registry)

urlpatterns = [
    path('', include(router.urls)),
    path('sse/violations/', sse_violations, name='sse_violations'),
    path('api/violations/', api_violations, name='api_violations'),
]
