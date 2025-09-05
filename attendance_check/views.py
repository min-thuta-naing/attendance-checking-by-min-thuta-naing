from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer

@api_view(["GET"])
def test_api(request):
    return Response({"message": "Hello from Django API!"})

class HRLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            if user.role != "HR":
                return Response({"error": "Please use employee login!"}, status=status.HTTP_403_FORBIDDEN)
            return Response({
                "message": "HR login successful",
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "job_title": user.job_title,
                "role": user.role,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            if user.role != "EMPLOYEE":
                return Response({"error": "Please use HR login!"}, status=status.HTTP_403_FORBIDDEN)
            return Response({
                "message": "Employee login successful",
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "job_title": user.job_title,
                "role": user.role,
            })
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)