# attandance_check/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('HR', 'HR/Admin'),
        ('EMP', 'Employee'),
    )
    role = models.CharField(max_length=3, choices=ROLE_CHOICES, default='EMP')

    def __str__(self):
        return f"{self.username} ({self.role})"
