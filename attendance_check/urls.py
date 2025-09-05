from django.urls import path
from .views import EmployeeLoginView, HRLoginView, EmployeeListView, EmployeeListUpdateView, RegisterEmployeeView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("api/login/hr/", HRLoginView.as_view(), name="hr-login"),
    path("api/login/employee/", EmployeeLoginView.as_view(), name="employee-login"),
    path("api/employees/", EmployeeListView.as_view(), name="employee-list"),
    path("api/employees/<int:pk>/", EmployeeListUpdateView.as_view(), name="employee-update"),
    # to refresh a new token after the preious token expired (JWT access token) 
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/employees/register/", RegisterEmployeeView.as_view(), name="register-employee"),
]
