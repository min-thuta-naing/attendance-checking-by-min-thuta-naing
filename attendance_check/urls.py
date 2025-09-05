from django.urls import path
from .views import EmployeeLoginView, HRLoginView, test_api

urlpatterns = [
    path("test/", test_api),
    path("api/login/hr/", HRLoginView.as_view(), name="hr-login"),
    path("api/login/employee/", EmployeeLoginView.as_view(), name="employee-login"),
]
