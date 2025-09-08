from django.urls import path
from .views import EmployeeLoginView, HRLoginView, HRStaffListView,EmployeeListView, EmployeeListUpdateView ,RegisterEmployeeView, ChangePasswordView, BranchListView, RegisterFaceDataView, EmployeeDetailView, AttendanceClockInView, AttendanceClockOutView, AttendanceListView, HRAttendanceListView
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path("api/login/hr/", HRLoginView.as_view(), name="hr-login"),
    path("api/login/employee/", EmployeeLoginView.as_view(), name="employee-login"),
    path("api/employees/", EmployeeListView.as_view(), name="employee-list"),
    path("api/hr-staff-all/", HRStaffListView.as_view(), name="hrstaff-list"),
    path("api/employees/<int:pk>/", EmployeeListUpdateView.as_view(), name="employee-update"),
    # to refresh a new token after the preious token expired (JWT access token) 
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/employees/register/", RegisterEmployeeView.as_view(), name="register-employee"),
    path("api/employee/<int:pk>/", EmployeeDetailView.as_view(), name="employee-detail"),
    path("api/face-data/register/", RegisterFaceDataView.as_view(), name="register-face-data"),
    path("api/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("api/branches/", BranchListView.as_view(), name='branch-list'),

    path("api/attendance/clock-in/", AttendanceClockInView.as_view(), name="attendance-clock-in"),
    path("api/attendance/clock-out/", AttendanceClockOutView.as_view(), name="attendance-clock-out"),
    path("api/attendance/my/", AttendanceListView.as_view(), name="attendance-list"),
    path("api/hr/attendance/", HRAttendanceListView.as_view(), name="hr-attendance-list"),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

