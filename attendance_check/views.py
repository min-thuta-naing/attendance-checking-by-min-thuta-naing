from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User, Branch, FaceData, Attendance
from .serializers import LoginSerializer, HRStaffListSerializer,EmployeeListSerializer, EmployeeRegisterSerializer, BranchSerializer, FaceDataSerializer, AttendanceSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.generics import RetrieveAPIView
from django.utils import timezone
from django.utils.dateparse import parse_date
from deepface import DeepFace
from geopy.distance import distance, geodesic
import numpy as np
import base64
import cv2
from deepface import DeepFace
import tempfile, base64
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

User = get_user_model()
MAX_DISTANCE_IN_METERS = 200
    
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
                "access": str(refresh.access_token),   
                "refresh": str(refresh),               
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
            
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Employee login successful",
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "job_title": user.job_title,
                "role": user.role,
                "branch_id": user.branch.id,
                "access": str(refresh.access_token),   
                "refresh": str(refresh),               
            })
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
                "branch": user.branch.id if user.branch else None,  
                "branch_name": user.branch.name if user.branch else None, 
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            }, status=status.HTTP_201_CREATED)
        
        print(serializer.errors) 
        errors = serializer.errors
        if "email" in errors:
            return Response({"error": "This email is already registered. Please use a different one."}, status=400)
        return Response({"error": "Invalid data. Please check all fields."}, status=400)
    
    
# view where employee can change their password 
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

        if len(new_password) < 8:
            return Response({"error": "Password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)
    
    

class BranchListView(generics.ListAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [permissions.IsAuthenticated] 


# retrieve the emp as soon as registered to add the facial data
class EmployeeDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = EmployeeRegisterSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class RegisterFaceDataView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "HR":
            return Response({"error": "Forbidden"}, status=403)

        serializer = FaceDataSerializer(data=request.data)
        if serializer.is_valid():
            face_data = serializer.save()
            return Response({"message": "Face data saved successfully", "id": face_data.id}, status=201)
        return Response(serializer.errors, status=400)


def verify_face_with_similarity(captured_base64, stored_embeddings_list, threshold=0.6):
    try:
        #to decode Base64
        format, imgstr = captured_base64.split(";base64,")
        img_bytes = base64.b64decode(imgstr)

        #to save photo file temporarily 
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(img_bytes)
            temp_file.flush()
            temp_path = temp_file.name

        #to generate embedding
        captured_embedding = DeepFace.represent(
            img_path=temp_path,
            model_name="Facenet",
            enforce_detection=True
        )[0]["embedding"]
        captured_embedding = np.array(captured_embedding)

        #to compare the embedding from the verification with stored embeddings
        stored_embeddings_np = [np.array(e) for e in stored_embeddings_list]
        similarities = [
            np.dot(captured_embedding, e) / (np.linalg.norm(captured_embedding) * np.linalg.norm(e))
            for e in stored_embeddings_np
        ]
        max_sim = max(similarities)
        return max_sim, max_sim > threshold
    except Exception as e:
        print("Face verification error:", e)
        return 0, False


def verify_location(emp_latitude, emp_longitude, branch, max_distance=200):
    try:
        branch_coords = (branch.latitude, branch.longitude)
        emp_coords = (float(emp_latitude), float(emp_longitude))
        distance = geodesic(branch_coords, emp_coords).meters
        return distance, distance <= max_distance
    except Exception as e:
        print("Location verification error:", e)
        return None, False


class AttendanceClockInView(APIView):
    authentication_classes = [JWTAuthentication] 
    permission_classes = [IsAuthenticated]

    def post(self, request):
        employee = request.user
        branch_id = request.data.get("branch") or (employee.branch.id if employee.branch else None)
        session = request.data.get("session")
        emp_latitude = request.data.get("emp_latitude")
        emp_longitude = request.data.get("emp_longitude")
        face_image = request.data.get("face_image")

        if not branch_id or not session or not emp_latitude or not emp_longitude or not face_image:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            branch = Branch.objects.get(pk=branch_id)
        except Branch.DoesNotExist:
            return Response({"error": "Branch not found"}, status=status.HTTP_404_NOT_FOUND)

        #to verify face 
        max_similarity, face_verified = 0, False
        try:
            face_data = FaceData.objects.get(employee=employee)
            max_similarity, face_verified = verify_face_with_similarity(face_image, face_data.embeddings)
            print("Face similarity:", max_similarity)
            print("Face verified:", face_verified)
        except FaceData.DoesNotExist:
            return Response({"error": "No registered face data for employee"}, status=status.HTTP_400_BAD_REQUEST)

        # to verify location 
        distance, location_verified = verify_location(emp_latitude, emp_longitude, branch)
        print("Distance to branch:", distance)
        print("Location verified:", location_verified)

        #to check with detailed error
        if not (face_verified and location_verified):
            if not face_verified and not location_verified:
                return Response({"error": "Face mismatch AND too far from branch"}, status=status.HTTP_400_BAD_REQUEST)
            elif not face_verified:
                return Response({"error": "Face mismatch"}, status=status.HTTP_400_BAD_REQUEST)
            elif not location_verified:
                return Response({"error": f"Too far from branch (Distance: {distance:.2f} m)"}, status=status.HTTP_400_BAD_REQUEST)

        #to prevent duplicates
        today = timezone.localdate()
        if Attendance.objects.filter(employee=employee, date=today, session=session).exists():
            return Response({"error": "Already clocked in for this session"}, status=status.HTTP_400_BAD_REQUEST)

        attendance = Attendance.objects.create(
            employee=employee,
            branch=branch,
            date=today,
            session=session,
            clock_in_time=timezone.localtime().time(),
            emp_latitude=float(emp_latitude),
            emp_longitude=float(emp_longitude),
            verified=True
        )

        return Response(AttendanceSerializer(attendance).data, status=status.HTTP_201_CREATED)
    

class AttendanceClockOutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        employee = request.user
        branch_id = request.data.get("branch") or (employee.branch.id if employee.branch else None)
        session = request.data.get("session")
        emp_latitude = request.data.get("emp_latitude")
        emp_longitude = request.data.get("emp_longitude")
        face_image = request.data.get("face_image")

        if not branch_id or not session or not emp_latitude or not emp_longitude or not face_image:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            branch = Branch.objects.get(pk=branch_id)
        except Branch.DoesNotExist:
            return Response({"error": "Branch not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # to verify face 
        max_similarity, face_verified = 0, False
        try:
            face_data = FaceData.objects.get(employee=employee)
            max_similarity, face_verified = verify_face_with_similarity(face_image, face_data.embeddings)
            print("Face similarity:", max_similarity)
            print("Face verified:", face_verified)
        except FaceData.DoesNotExist:
            return Response({"error": "No registered face data for employee"}, status=status.HTTP_400_BAD_REQUEST)
        
        # to verify location 
        distance, location_verified = verify_location(emp_latitude, emp_longitude, branch)
        print("Distance to branch:", distance)
        print("Location verified:", location_verified)

        # to check with detailed error
        if not (face_verified and location_verified):
            if not face_verified and not location_verified:
                return Response({"error": "Face mismatch AND too far from branch"}, status=status.HTTP_400_BAD_REQUEST)
            elif not face_verified:
                return Response({"error": "Face mismatch"}, status=status.HTTP_400_BAD_REQUEST)
            elif not location_verified:
                return Response({"error": f"Too far from branch (Distance: {distance:.2f} m)"}, status=status.HTTP_400_BAD_REQUEST)
        
        #to prevent duplicates and prevent no clock out without clock in first 
        today = timezone.localdate()
        try:
            attendance = Attendance.objects.get(employee=employee, date=today, session=session)
        except Attendance.DoesNotExist:
            return Response({"error": "No clock-in found for this session"}, status=status.HTTP_404_NOT_FOUND)

        if attendance.clock_out_time:
            return Response({"error": "Already clocked out for this session"}, status=status.HTTP_400_BAD_REQUEST)

        attendance.clock_out_time = timezone.localtime().time()
        if emp_latitude: attendance.emp_latitude = float(emp_latitude)
        if emp_longitude: attendance.emp_longitude = float(emp_longitude)
        attendance.save()

        return Response(AttendanceSerializer(attendance).data, status=status.HTTP_200_OK)




class AttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        employee = self.request.user
        return Attendance.objects.filter(employee=employee).order_by("-date", "-session")
    

class HRAttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]  

    def get_queryset(self):
        if self.request.user.role != "HR":
            return Attendance.objects.none() 

        # queryset = Attendance.objects.all().order_by("-date", "-session")
        queryset = Attendance.objects.select_related('employee', 'branch').order_by("-date", "-session")
 

        email = self.request.query_params.get("email")
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        session = self.request.query_params.get("session")
        branch = self.request.query_params.get("branch")

        if email: 
            queryset = queryset.filter(employee__email__icontains=email)
        if start_date:
            queryset = queryset.filter(date__gte=parse_date(start_date))
        if end_date:
            queryset = queryset.filter(date__lte=parse_date(end_date))
        if session:
            queryset = queryset.filter(session__iexact=session)
        if branch:
            queryset = queryset.filter(branch__name__icontains=branch)

        return queryset

    def list(self, request, *args, **kwargs):
        if request.user.role != "HR":
            return Response({"error": "Forbidden"}, status=403)  
        return super().list(request, *args, **kwargs)