from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'list', views.PatientViewSet, basename='patient')
router.register(r'doctors', views.DoctorViewSet, basename='doctor')
router.register(r'nurses', views.NurseViewSet, basename='nurse')

urlpatterns = [
    path('', include(router.urls)),
]
