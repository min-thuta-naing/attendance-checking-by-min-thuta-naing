from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import LoginSerializer, HRStaffListSerializer,EmployeeListSerializer, EmployeeRegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password


User = get_user_model()

# HR staff login 
# class HRLoginView(APIView):
#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.validated_data["user"]
#             if user.role != "HR":
#                 return Response({"error": "Please use employee login!"}, status=status.HTTP_403_FORBIDDEN)
#             return Response({
#                 "message": "HR login successful",
#                 "id": user.id,
#                 "email": user.email,
#                 "first_name": user.first_name,
#                 "last_name": user.last_name,
#                 "job_title": user.job_title,
#                 "role": user.role,
#             })
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class HRLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            if user.role != "HR":
                return Response({"error": "Please use employee login!"}, status=403)

            # Create JWT token
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "HR login successful",
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "job_title": user.job_title,
                "role": user.role,
                "access": str(refresh.access_token),   # <- access token
                "refresh": str(refresh),               # <- refresh token
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Other employee login
class EmployeeLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            if user.role != "EMPLOYEE":
                return Response({"error": "Please use HR login!"}, status=status.HTTP_403_FORBIDDEN)
            
            # Create JWT token
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Employee login successful",
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "job_title": user.job_title,
                "role": user.role,
                "access": str(refresh.access_token),   # <- access token
                "refresh": str(refresh),               # <- refresh token
            })
        # print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# view for which HR can see all the other HR staff  
class HRStaffListView(APIView):
    # JWT
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        if request.user.role != "HR":
            return Response({"error": "Forbidden"}, status=403)

        hrstaff = User.objects.filter(role="HR")
        serializer = HRStaffListSerializer(hrstaff, many=True)
        return Response(serializer.data)


# view for which HR can see all employees 
class EmployeeListView(APIView):
    # JWT
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        if request.user.role != "HR":
            return Response({"error": "Forbidden"}, status=403)

        employees = User.objects.filter(role="EMPLOYEE")
        serializer = EmployeeListSerializer(employees, many=True)
        return Response(serializer.data)
    

# view for which HR can update some field of all HR admin staff 
class HRStaffListUpdateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only HR should access this endpoint
        if request.user.role != "HR":
            return Response({"error": "Forbidden"}, status=403)

        hrstaff = User.objects.filter(role="HR")
        serializer = EmployeeListSerializer(hrstaff, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        # Only HR can update first_name, last_name, job_title
        if request.user.role != "HR":
            return Response({"error": "Forbidden"}, status=403)

        try:
            hrstaff = User.objects.get(pk=pk, role="HR")
        except User.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)

        serializer = HRStaffListSerializer(hrstaff, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    
# view for which HR can update some field of all employees 
class EmployeeListUpdateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only HR should access this endpoint
        if request.user.role != "HR":
            return Response({"error": "Forbidden"}, status=403)

        employees = User.objects.filter(role="EMPLOYEE")
        serializer = EmployeeListSerializer(employees, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        # Only HR can update first_name, last_name, job_title
        if request.user.role != "HR":
            return Response({"error": "Forbidden"}, status=403)

        try:
            employee = User.objects.get(pk=pk, role="EMPLOYEE")
        except User.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)

        serializer = EmployeeListSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# view where HR staff can register the new employees 
# class RegisterEmployeeView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         if request.user.role != "HR":
#             return Response({"error": "Forbidden"}, status=403)

#         data = request.data.copy()

#         # System-controlled fields
#         data["role"] = "EMPLOYEE"
#         data["is_superuser"] = False
#         data["is_staff"] = True

#         # Default password
#         if not data.get("password"):
#             data["password"] = "Default@123"

#         serializer = EmployeeRegisterSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# view where HR staff can register the new employees 
class RegisterEmployeeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "HR":
            return Response({"error": "Forbidden"}, status=403)

        serializer = EmployeeRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "job_title": user.job_title,
                "role": user.role,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# view where employee and HR staff can change their password 
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not current_password or not new_password or not confirm_password:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(current_password):
            return Response({"error": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "New passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        # Optional: enforce password rules
        if len(new_password) < 8:
            return Response({"error": "Password must be at least 8 characters."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)