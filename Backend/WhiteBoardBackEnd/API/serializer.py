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

class GroupImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupImages
        fields = ['pk', 'name', 'Image', 'Image_after', 'GpID', 'Code', 'save_time']

class GroupSerializer(serializers.ModelSerializer):
    user = UserSerializer
    groupimages = GroupImagesSerializer(source="groupimages_set", many=True)
    class Meta:
        model = Group
        fields = ['Gpname', 'GpID', 'GpDescription', 'isDefault', 'leader_uid', 'groupimages']

class GroupSerializerWithoutImage(serializers.ModelSerializer):
    user = UserSerializer

    class Meta:
        model = Group
        fields = ['Gpname', 'GpID', 'GpDescription', 'isDefault', 'leader_uid']