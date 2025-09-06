from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Branch
from .forms import CustomUserCreationForm, CustomUserChangeForm

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ('email', 'first_name', 'last_name', 'job_title', 'role', 'branch', 'is_staff', 'is_superuser')

    fieldsets = (
        (None, {'fields': ('email', 'password', 'first_name', 'last_name', 'job_title', 'role',  'branch')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {'fields': ('email', 'first_name', 'last_name', 'job_title', 'role',  'branch', 'password1', 'password2')}),
    )

    ordering = ('email',)
    search_fields = ('email', 'first_name', 'last_name', 'job_title')
    list_filter = ('role', 'branch')

admin.site.register(User, CustomUserAdmin)

@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'latitude', 'longitude', 'address', 'created_at')
    search_fields = ('name', 'address')
    list_filter = ('created_at',)

