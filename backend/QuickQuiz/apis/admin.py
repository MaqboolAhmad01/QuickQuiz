from django.contrib import admin
from .models import Result, User

# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "username", "is_staff", "is_active")
    search_fields = ("email", "username")
    ordering = ("email",)


admin.site.register(User, UserAdmin)
admin.site.register(Result)