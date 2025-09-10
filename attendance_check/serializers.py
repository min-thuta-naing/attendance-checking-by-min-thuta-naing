from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Branch, FaceData, Attendance
from django.contrib.auth.hashers import make_password
import numpy as np
from deepface import DeepFace
from django.core.files.base import ContentFile
import tempfile
import os 

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid email or password")
            data["user"] = user
        else:
            raise serializers.ValidationError("Email and password are required")
        return data

class EmployeeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'job_title', 'role')
        read_only_fields = ('id', 'email', 'role')

class HRStaffListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'job_title', 'role')
        read_only_fields = ('id', 'email', 'first_name', 'last_name', 'job_title', 'role')


# hr register the new employee 
class EmployeeRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'job_title', 'branch']  

    def create(self, validated_data):
        user = User(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            job_title=validated_data.get("job_title", ""),
            branch=validated_data["branch"],
            role="EMPLOYEE",
            is_staff=True,
            is_superuser=False
        )

        #to make the default password for the newly registerd emp 
        user.set_password("Default@123")
        user.save()
        return user


# to display the branch in the employee form 
class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name'] 


class FaceDataSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=True
    )
    # embeddings = serializers.JSONField(read_only=True) 

    class Meta:
        model = FaceData
        fields = ["employee", "images", "embeddings", "last_updated"]
        read_only_fields = ["embeddings", "last_updated"]

    def create(self, validated_data):
        print("Received validated_data:", validated_data)  
        print("Received images:", validated_data.get('images')) 
        employee = validated_data.get("employee")
        images = validated_data.pop("images")  

        embeddings = []

        for image_file in images:
            # save the uploaded file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
                for chunk in image_file.chunks():
                    temp_file.write(chunk)
                temp_file.flush()
                temp_file_path = temp_file.name

            try:
                emb = DeepFace.represent(
                    img_path=temp_file_path,
                    model_name="Facenet",
                    enforce_detection=True
                )[0]["embedding"]
                embeddings.append(emb)
            except Exception as e:
                raise serializers.ValidationError({
                    "images": f"Face could not be detected: {str(e)}"
                })
            finally:
                os.unlink(temp_file_path)

        # embeddings
        validated_data["embeddings"] = embeddings

        return super().create(validated_data)

    

# serializer for the facial verification for attendance of emp 
class AttendanceSerializer(serializers.ModelSerializer):
    employee_email = serializers.CharField(source="employee.email", read_only=True)
    branch_name = serializers.CharField(source="branch.name", read_only=True)

    class Meta:
        model = Attendance
        fields = [
            "id",
            "employee",
            "employee_email",
            "branch",
            "branch_name",
            "date",
            "session",
            "clock_in_time",
            "clock_out_time",
            "emp_latitude",
            "emp_longitude",
            "verified",
        ]
        read_only_fields = ["id", "date", "verified", "employee"]