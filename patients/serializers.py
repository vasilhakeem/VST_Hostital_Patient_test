from rest_framework import serializers
from .models import Patient, Doctor, Nurse


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class NurseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nurse
        fields = ['id', 'name', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class PatientSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    nurse_name = serializers.CharField(source='nurse.name', read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id', 'name', 'room', 'email', 'doctor', 'doctor_name',
            'nurse', 'nurse_name', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_email(self, value):
        patient_id = self.instance.id if self.instance else None
        if Patient.objects.filter(email=value).exclude(id=patient_id).exists():
            raise serializers.ValidationError("A patient with this email already exists.")
        return value