from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

# 1️⃣ Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, role="EMPLOYEE", **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "ADMIN")  # force superuser role

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

# 2️⃣ Custom User model
class User(AbstractUser):
    username = None  # remove username
    email = models.EmailField(unique=True)

    ROLE_CHOICES = (
        ("ADMIN", "Admin"),
        ("HR", "HR"),
        ("EMPLOYEE", "Employee"),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="EMPLOYEE")

    job_title = models.CharField(max_length=100, blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # no other required fields

    objects = UserManager()

    def __str__(self):
        return self.email


