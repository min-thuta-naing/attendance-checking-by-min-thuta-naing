from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

# Custom user manager
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
        extra_fields.setdefault("role", "ADMIN") 

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

# Custom user model
class User(AbstractUser):
    username = None 
    email = models.EmailField(unique=True)
    ROLE_CHOICES = (
        ("ADMIN", "Admin"),
        ("HR", "HR"),
        ("EMPLOYEE", "Employee"),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="EMPLOYEE")
    job_title = models.CharField(max_length=100, blank=True, null=True)
    branch = models.ForeignKey("Branch", on_delete=models.SET_NULL, null=True, blank=True) 

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  

    objects = UserManager()

    def __str__(self):
        return self.email

# Company branches model 
class Branch(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Employee facial data  model 
class FaceData(models.Model):
    employee = models.OneToOneField(User, on_delete=models.CASCADE)
    # images = models.JSONField(default=list)  
    embeddings = models.JSONField()  
    last_updated = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.email} face data"

    
# Clock in Clock out attendance model 
class Attendance(models.Model):
    SESSION_CHOICES = [
        ("MORNING", "Morning"),
        ("LUNCH", "Lunch"),
        ("AFTERNOON", "Afternoon"),
        ("EVENING", "Evening"),
    ]
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    session = models.CharField(max_length=10, choices=SESSION_CHOICES)
    clock_in_time = models.TimeField(null=True, blank=True)
    clock_out_time = models.TimeField(null=True, blank=True)
    emp_latitude = models.FloatField()
    emp_longitude = models.FloatField()
    verified = models.BooleanField(default=False)  

    class Meta:
        unique_together = ("employee", "date", "session")  

    def __str__(self):
        return f"{self.employee.email} - {self.date} - {self.session}"