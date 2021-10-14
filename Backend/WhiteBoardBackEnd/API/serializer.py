from rest_framework import serializers
from .models import User, Group, GroupImages

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'uid']


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['Gpname', 'GpID', 'GpDescription']
    user = UserSerializer

class GroupImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupImages
        fields = ['name', 'Image', 'GpID']
    group = GroupSerializer