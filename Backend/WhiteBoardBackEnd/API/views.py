#############################################################################
# API/views.py
#
# Authors: Chunao Liu
#
# This is an django APIView that handles all the HTTP request received
# by the backend. It support get, put and delete objects from the database
#############################################################################
from django.shortcuts import render, HttpResponse
from .serializer import UserSerializer, GroupSerializer
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
from .models import User, Group
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework import generics, mixins
import io

# Create your views here.

# Class AllUserList
# Author: Chunao Liu
# Return value: JsonResponse
# Inheritence: 
#       APIView
# This class respond to HTTP request
# for all user's information

class AllUserList(APIView):
    def get(self, request):
        users = User.objects.all()
        Serializer = UserSerializer(users, many=True)
        return Response(Serializer.data)
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) # HTTP 201: CREATED
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # HTTP 400: BAD REQUEST


# Class SpecificUser
# Author: Chunao Liu
# Return value: JsonResponse
# Inheritence: 
#       APIView
# This class respond to HTTP request
# for a specific user ID

class SpecificUser(APIView):
    def get_user_object(self, id):
        try:
            return User.objects.get(pk=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def get(self, request, id):
        Serializer = UserSerializer(self.get_user_object(id))
        return Response(Serializer.data)
    
    def put(self, request, id):
        Serializer = UserSerializer(self.get_user_object(id), data=request.data)
        if (Serializer.is_valid()):
            Serializer.save()
            return Response(Serializer.data)
        return Response(HttpResponse.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        UserObject = self.get_user_object(id)
        UserObject.delete()
        return Response(status.HTTP_204_NO_CONTENT)





