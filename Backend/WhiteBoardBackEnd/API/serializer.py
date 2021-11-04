from rest_framework import serializers
from .models import User, Group, GroupImages


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'uid', 'avatar']


class AvatarSerializer(serializers.Serializer):
        image = serializers.ImageField(use_url='Avatars')


class ImageSerializer(serializers.Serializer):
    image = serializers.ImageField(use_url='images')

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['Gpname', 'GpID', 'GpDescription', 'isDefault', 'leader_uid']

    user = UserSerializer


class GroupImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupImages
        fields = ['name', 'Image', 'GpID']

    group = GroupSerializer
