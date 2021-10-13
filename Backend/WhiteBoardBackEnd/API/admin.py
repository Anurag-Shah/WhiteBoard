from django.contrib import admin
from .models import Group, User

# Register your models here.

@admin.register(User)
class UserModel(admin.ModelAdmin):
    list_filter = ('name', 'email')
    list_display = ('name', 'email')

@admin.register(Group)
class GroupModel(admin.ModelAdmin):
    list_filter = ('Gpname', 'GpID')
    list_display = ('Gpname', 'GpID')