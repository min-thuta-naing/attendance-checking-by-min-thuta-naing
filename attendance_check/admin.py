# from django.contrib import admin
# from django.contrib.auth import get_user_model
# from django.contrib.auth.admin import UserAdmin

# User = get_user_model()

# admin.site.register(User, UserAdmin)



# attandance_check/admin.py
# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from .models import User

# class CustomUserAdmin(UserAdmin):
#     model = User
#     list_display = ('username', 'email', 'role', 'is_staff', 'is_superuser')
#     fieldsets = UserAdmin.fieldsets + (
#         (None, {'fields': ('role',)}),
#     )
#     add_fieldsets = UserAdmin.add_fieldsets + (
#         (None, {'fields': ('role',)}),
#     )

# admin.site.register(User, CustomUserAdmin)



from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from .forms import CustomUserCreationForm, CustomUserChangeForm

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ('email', 'first_name', 'last_name', 'job_title', 'role', 'is_staff', 'is_superuser')

    fieldsets = (
        (None, {'fields': ('email', 'password', 'first_name', 'last_name', 'job_title', 'role')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {'fields': ('email', 'first_name', 'last_name', 'job_title', 'role', 'password1', 'password2')}),
    )

    ordering = ('email',)
    search_fields = ('email', 'first_name', 'last_name', 'job_title')

admin.site.register(User, CustomUserAdmin)
