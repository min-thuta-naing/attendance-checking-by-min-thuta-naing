from django.urls import path
from .views import EmployeeLoginView, HRLoginView, HRStaffListView,EmployeeListView, EmployeeListUpdateView,HRStaffListUpdateView ,RegisterEmployeeView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("api/login/hr/", HRLoginView.as_view(), name="hr-login"),
    path("api/login/employee/", EmployeeLoginView.as_view(), name="employee-login"),
    path("api/employees/", EmployeeListView.as_view(), name="employee-list"),
    path("api/hr-staff-all/", HRStaffListView.as_view(), name="hrstaff-list"),
    path("api/employees/<int:pk>/", EmployeeListUpdateView.as_view(), name="employee-update"),
    path("api/hr-staff-update/<int:pk>/", HRStaffListUpdateView.as_view(), name="hr-staff-update"),
    # to refresh a new token after the preious token expired (JWT access token) 
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/employees/register/", RegisterEmployeeView.as_view(), name="register-employee"),
]
