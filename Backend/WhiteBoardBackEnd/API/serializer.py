from rest_framework import serializers
from .models import User, Group, GroupImages


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'uid', 'avatar']


class AvatarSerializer(serializers.Serializer):
        image = serializers.ImageField(use_url='Avatars')

class ImageSerializer(serializers.Serializer):
    Image = serializers.ImageField(use_url='images')

class GroupSerializer(serializers.ModelSerializer):
    user = UserSerializer
    groupimages = ImageSerializer(source="groupimages_set", many=True)
    class Meta:
        model = Group
        fields = ['Gpname', 'GpID', 'GpDescription', 'isDefault', 'leader_uid', 'groupimages']


class GroupImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupImages
        fields = ['name', 'Image', 'GpID']

    group = GroupSerializer
