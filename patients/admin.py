from django.contrib import admin
from .models import Patient, Doctor, Nurse


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_at']
    search_fields = ['name']


@admin.register(Nurse)
class NurseAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_at']
    search_fields = ['name']


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'room', 'email', 'doctor', 'nurse', 'created_at']
    list_filter = ['doctor', 'nurse', 'created_at']
    search_fields = ['name', 'email', 'room']
    raw_id_fields = ['doctor', 'nurse']