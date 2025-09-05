from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

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
    
# from rest_framework import serializers
# from django.contrib.auth.hashers import check_password
# from .models import User

# class LoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField(write_only=True)

#     def validate(self, data):
#         email = data.get("email")
#         password = data.get("password")

#         if not email or not password:
#             raise serializers.ValidationError("Email and password are required")

#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             raise serializers.ValidationError("Invalid email or password")

#         if not check_password(password, user.password):
#             raise serializers.ValidationError("Invalid email or password")

#         data["user"] = user
#         return data

