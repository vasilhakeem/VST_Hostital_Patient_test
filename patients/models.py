from django.db import models
from django.core.validators import EmailValidator
import logging

logger = logging.getLogger(__name__)


class Doctor(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Nurse(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Patient(models.Model):
    name = models.CharField(max_length=200)
    room = models.CharField(max_length=50)
    email = models.EmailField(validators=[EmailValidator()])
    doctor = models.ForeignKey(
        Doctor, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='patients'
    )
    nurse = models.ForeignKey(
        Nurse, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='patients'
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - Room {self.room}"

    def save(self, *args, **kwargs):
        logger.info(f"Saving patient: {self.name}")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        logger.info(f"Deleting patient: {self.name}")
        super().delete(*args, **kwargs)