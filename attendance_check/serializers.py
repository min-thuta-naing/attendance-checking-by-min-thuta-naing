from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from django.contrib.auth.hashers import make_password

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
        # HR can only see these fields and optionally edit these
        fields = ('id', 'email', 'first_name', 'last_name', 'job_title', 'role')
        read_only_fields = ('id', 'email', 'role')

class HRStaffListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # HR can only see these fields and optionally edit these
        fields = ('id', 'email', 'first_name', 'last_name', 'job_title', 'role')
        read_only_fields = ('id', 'email', 'role')

# class EmployeeRegisterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['first_name', 'last_name', 'email', 'job_title', 'password', 'role', 'is_staff', 'is_superuser']
#         extra_kwargs = {
#             'password': {'write_only': True},
#             'role': {'read_only': True}, 
#             # 'role': {'required': True},
#             'is_staff': {'read_only': True},
#             'is_superuser': {'read_only': True},
#         }

#     def create(self, validated_data):
#         password = validated_data.pop('password', None)
#         user = super().create(validated_data)
#         if password:
#             user.set_password(password)  # hashes the password
#         else:
#             user.set_password("Default@123")  # default password
#         user.role = "EMPLOYEE"    # system-controlled
#         user.is_superuser = False # system-controlled
#         user.is_staff = True      # must be staff
#         user.save()
#         return user


class EmployeeRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'job_title', 'role']  
        extra_kwargs = {
            'role': {'required': True}, 
        }

    def create(self, validated_data):
        # System-controlled fields
        role = validated_data.get("role", "EMPLOYEE")
        if role not in ["EMPLOYEE", "HR"]:
            role = "EMPLOYEE"

        user = User(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            job_title=validated_data.get("job_title", ""),
            role=role,
            is_staff=True,
            is_superuser=False
        )

        # Default password
        user.set_password("Default@123")
        user.save()
        return user





