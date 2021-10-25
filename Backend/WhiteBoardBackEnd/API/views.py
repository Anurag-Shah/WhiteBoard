#############################################################################
# API/views.py
#
# Authors: Chunao Liu, Michelle He
#
# This is an django APIView that handles all the HTTP request received
# by the backend. It support get, put and delete objects from the database
#############################################################################

import sys
import io
import json
import os
import ocr

from PIL.Image import MIME
from django.db.models.query import QuerySet
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import APIView, api_view
from rest_framework import generics, mixins

from .serializer import UserSerializer, GroupSerializer, GroupImagesSerializer
from .models import User, Group, GroupImages

# Create your views here.

# Class AllUserList
# Author: Chunao Liu, Jenna Zhang
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
            # HTTP 201: CREATED
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # HTTP 400: BAD REQUEST
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        Serializer = UserSerializer(
            self.get_user_object(id), data=request.data)
        if (Serializer.is_valid()):
            Serializer.save()
            return Response(Serializer.data)
        return Response(HttpResponse.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        UserObject = self.get_user_object(id)
        UserObject.delete()
        return Response(status.HTTP_204_NO_CONTENT)

# Class SpecificGroup
# Author: Chunao Liu
# Return value: JsonResponse
# Inheritence:
#       APIView
# This class respond to HTTP request
# for a specific Group ID


class SpecificGroup(APIView):
    def get_group_object(self, id):
        try:
            return Group.objects.get(pk=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, id):
        Serializer = GroupSerializer(self.get_group_object(id))
        return Response(Serializer.data)

    def put(self, request, id):
        Serializer = GroupSerializer(
            self.get_group_object(id), data=request.data)
        if (Serializer.is_valid()):
            Serializer.save()
            return Response(Serializer.data)
        return Response(HttpResponse.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        GroupObject = self.get_group_object(id)
        GroupObject.delete()
        return Response(status.HTTP_204_NO_CONTENT)

# Class ImageUpload
# Author: Chunao Liu
# Return value: JsonResponse
# Inheritence:
#       APIView
# This class respond to HTTP request
# for a group's image


class ImageUpload(APIView):
    def get_Group_image(self, GPid):
        aaa = GroupImages.objects.filter(GpID__GpID=GPid)
        print(aaa)
        return aaa

    def get_group_object(self, id):
        try:
            return Group.objects.get(pk=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    # This is the function that got fired when a you send a HTTP Post request to
    # upload an image to a group. Your HTTP should be like (JavaScript):

    # var myHeaders = new Headers();
    # myHeaders.append("image", "");

    # var formdata = new FormData();
    # formdata.append("Image", your_image, "[PROXY]");
    # formdata.append("name", "First Hello World");

    # var requestOptions = {
    # method: 'POST',
    # headers: myHeaders,
    # body: formdata,
    # redirect: 'follow'
    # };

    # fetch("http://ec2-3-144-80-126.us-east-2.compute.amazonaws.com:8080/Images/__Insert_Group_ID__", requestOptions)
    # .then(response => response.text())
    # .then(result => console.log(result))
    # .catch(error => console.log('error', error));

    def post(self, request, GPid):
        file = request.data['Image']
        name = request.data['name']
        group = self.get_group_object(GPid)
        image = GroupImages.objects.create(Image=file, GpID=group, name=name)
        image_path = image.Image
        path = "/home/chunao/WhiteBoardWork/Backend/WhiteBoardBackEnd/media/" + \
            str(image_path)
        zip_file = open(
            "/home/chunao/WhiteBoardWork/Backend/WhiteBoardBackEnd/media/" + str(image_path), 'rb')
        # ocr_return should have the stack trace so far
        ocr_return = ocr.ocr(path)
        print("OCR is: " + ocr_return)
        response = HttpResponse(
            zip_file, content_type='application/force-download')
        response['Content-Disposition'] = 'attachment; filename="%s"' % 'CDX_COMPOSITES_20140626.zip'
        return response

    def get(self, request, GPid):
        Serializer = GroupImagesSerializer(
            self.get_Group_image(GPid), many=True)
        return Response(Serializer.data)


# Function login
# Author: Jenna Zhang
# Return value: JsonResponse
# This function responds to frontend user login request
@api_view(['POST'])
def login(request):
    data = JSONParser().parse(request)
    try:
        user = User.objects.get(name=data['username'])
        if user.PW == data['password']:
            res = {"code": 0, "msg": "Login successfully"}
            return JsonResponse(res)
        else:
            res = {"code": -1, "msg": "Wrong password"}
            return JsonResponse(res)
    except user.DoesNotExist:
        print("Username does not exist!")
        res = {"code": -2, "msg": "User does not exist"}
        return JsonResponse(res)


def register(request):
    pass
