from rest_framework import serializers
from .models import User, Group

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'uid']


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['GPname', 'GPID', 'GPDescription']
    user = UserSerializer
