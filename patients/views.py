from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Patient, Doctor, Nurse
from .serializers import PatientSerializer, DoctorSerializer, NurseSerializer
import logging

logger = logging.getLogger(__name__)


class PatientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Patient CRUD operations
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            logger.info(f"Patient list retrieved by user: {request.user.username}")
            return Response({
                'count': queryset.count(),
                'results': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching patients: {str(e)}")
            return Response(
                {'error': 'Failed to fetch patients'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Patient created: {serializer.data['name']} by {request.user.username}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            logger.warning(f"Patient creation validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating patient: {str(e)}")
            return Response(
                {'error': 'Failed to create patient'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Patient updated: {instance.name} by {request.user.username}")
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            logger.warning(f"Patient update validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error updating patient: {str(e)}")
            return Response(
                {'error': 'Failed to update patient'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            patient_name = instance.name
            instance.delete()
            logger.info(f"Patient deleted: {patient_name} by {request.user.username}")
            return Response(
                {'message': 'Patient deleted successfully'},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            logger.error(f"Error deleting patient: {str(e)}")
            return Response(
                {'error': 'Failed to delete patient'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DoctorViewSet(viewsets.ModelViewSet):
    """ViewSet for Doctor CRUD operations"""
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]


class NurseViewSet(viewsets.ModelViewSet):
    """ViewSet for Nurse CRUD operations"""
    queryset = Nurse.objects.all()
    serializer_class = NurseSerializer
    permission_classes = [IsAuthenticated]
