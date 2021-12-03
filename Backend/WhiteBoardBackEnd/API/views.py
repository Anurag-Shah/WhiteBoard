#############################################################################
# API/views.py
#
# Authors: Chunao Liu, Jenna Zhang, Michelle He
#
# This is an django APIView that handles all the HTTP request received
# by the backend. It support get, put and delete objects from the database
#############################################################################

import compiler_wrapper
import os
import re
from typing import Text
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail, BadHeaderError
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import HttpResponse, render
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.http import require_POST
from django.views.generic import FormView
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import APIView, permission_classes, authentication_classes, api_view
from rest_framework.parsers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

import ocr
from forms import SetPasswordForm
from .models import User, Group, GroupImages
from .serializer import UserSerializer, GroupSerializer, GroupImagesSerializer, AvatarSerializer, GroupSerializerWithoutImage


from .serializer import UserSerializer, GroupSerializer, GroupImagesSerializer
from .models import User, Group, GroupImages
from django.core.files.base import ContentFile
import base64
from pathlib import Path
import urllib
from urllib.request import urlopen
from django.core.files.temp import NamedTemporaryFile
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from base64 import b64encode

import threading
import time
import sys

sys.path.insert(1, os.path.abspath("../../Compiler"))


# Class AllUserList
# Author: Chunao Liu, Jenna Zhang
# Return value: JsonResponse
# Inheritence:
#       APIView
# This class respond to HTTP request
# for all user's information

# Need to uncomment the following two lines to enable token based authentication
# @permission_classes([IsAuthenticated])
# @authentication_classes([TokenAuthentication])
class AllUserList(APIView):
    permission_classes = [AllowAny, ]

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

# Need to uncomment the following two lines to enable token based authentication
# @permission_classes([IsAuthenticated])
# @authentication_classes([TokenAuthentication])
class SpecificUser(APIView):
    permission_classes = [AllowAny, ]

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

# Need to uncomment the following two lines to enable token based authentication
# @permission_classes([IsAuthenticated])
# @authentication_classes([TokenAuthentication])
class SpecificGroup(APIView):
    permission_classes = [AllowAny, ]

    def get_group_object(self, id):
        try:
            return Group.objects.get(pk=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, id):
        Serializer = GroupSerializerWithoutImage(self.get_group_object(id))
        return Response(Serializer.data)

    def put(self, request, id):
        Serializer = GroupSerializer(
            self.get_group_object(id), data=request.data)
        if (Serializer.is_valid()):
            Serializer.save()
            return Response(Serializer.data)
        return Response(HttpResponse.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, id):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # HTTP 201: CREATED
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # HTTP 400: BAD REQUEST
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        GroupObject = self.get_group_object(id)
        GroupObject.delete()
        return Response(status.HTTP_204_NO_CONTENT)


class TextUpload(APIView):
    permission_classes = [AllowAny, ]

    def get_group_object(self, id):
        try:
            return Group.objects.get(pk=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, id):
        text = request.data["compile_text"]
        compile_result = compiler_wrapper.compiler_wrapper(text, "C")
        while (compile_result[0] == ""):
            compile_result = compiler_wrapper.compiler_wrapper(text, "C")
        print(compile_result)
        return_data = {}
        return_data['compile_result'] = compile_result[0]
        return_data['terminal_output'] = compile_result[0]
        return_data['problem_line'] = compile_result[1]
        group = self.get_group_object(id)
        image = GroupImages.objects.create(GpID=group, Code=text)
        image.save()
        response = HttpResponse(json.dumps(return_data),
                                content_type='application/json')
        return response


class TempTextUpload(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        text = request.data["compile_text"]
        compile_result = compiler_wrapper.compiler_wrapper(text, "C")
        while (compile_result[0] == ""):
            compile_result = compiler_wrapper.compiler_wrapper(text, "C")
        print(compile_result)
        return_data = {}
        return_data['compile_result'] = compile_result[0]
        return_data['terminal_output'] = compile_result[0]
        return_data['problem_line'] = compile_result[1]
        response = HttpResponse(json.dumps(return_data),
                                content_type='application/json')
        return response


# Class ImageUpload
# Author: Chunao Liu
# Return value: JsonResponse
# Inheritence:
#       APIView
# This class respond to HTTP request
# for a group's imag

# Need to uncomment the following two lines to enable token based authentication
class ImageUpload(APIView):
    # or comment these tow lines:
    # authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny, ]

    def get_Group_image(self, GPid):
        aaa = GroupImages.objects.filter(GpID__GpID=GPid)
        print(aaa)
        return aaa

    def get_group_object(self, id):
        try:
            return Group.objects.get(pk=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, GPid):
        file = request.data['Image']
        name = request.data['name']
        try:
            language_in = request.data['language']
        except:
            language_in = "C"
        custom_name = name + ":" + str(GPid) + ".jpg"
        try:
            img = ContentFile(base64.b64decode(file), name=custom_name)
        except:
            img = file
        group = self.get_group_object(GPid)
        image = GroupImages.objects.create(Image=img, GpID=group, name=name)
        image_path = image.Image
        ImageID = image.pk
        print("ID is: " + str(ImageID))
        path = "/home/chunao/WhiteBoard/workspace/Django-app/Backend/WhiteBoardBackEnd/media/" + \
            str(image_path)
        path_after = "/home/chunao/WhiteBoard/workspace/Django-app/Backend/WhiteBoardBackEnd/media/AfterImages/"
        return_data = {}
        return_data['status'] = 'success'
        return_data['image_uri'] = str(image_path)
        print(Path(path).as_uri())

        # ocr_return should have the stack trace so far
        ocr_return = ocr.ocr(path)

        print(ocr_return)

        ocr_error_output = []
        error_msg_whole = ocr_return[2]
        for i in ocr_return[6]:
            current_error = []
            print("compile\.c:[" + str(i) +
                  "]+:[0-9]+:(.|\\n)*?(?=compile\.c|\Z)")
            matches = re.finditer(
                "compile\.c:[" + str(i) + "]+:[0-9]+:(.|\\n)*?(?=compile\.c|\Z)", error_msg_whole, re.MULTILINE)
            for match in matches:
                print(match.group())
                error_msg_whole.replace(match.group(), "")
                current_error.append(match.group())
            ocr_error_output.append(current_error)

        img_pil = ocr_return[0]
        CVImageOut = path_after + str(GPid) + "_" + str(ImageID) + ".png"
        img_pil.save(CVImageOut, format="PNG")
        image.Image_after = CVImageOut
        image.Image_after_url = CVImageOut
        image.save()
        return_data['ocr_return'] = ocr_return[2]
        image_path = image.Image_after
        return_data['image_after_uri'] = str(
            image_path)[str(image_path).find("AfterImages"):]
        return_data['ocr_text_detected'] = ocr_return[1]
        return_data['y-coord'] = ocr_return[5]
        return_data['line-num'] = ocr_return[6]
        return_data['y-coord-match'] = ocr_error_output
        response = HttpResponse(json.dumps(return_data),
                                content_type='application/json')
        return response

    def get(self, request, GPid):
        Serializer = GroupImagesSerializer(
            self.get_Group_image(GPid), many=True)
        return Response(Serializer.data)

    def delete(self, request, GPid):
        ImageObject = GroupImagesSerializer(
            self.get_Group_image(GPid), many=True)
        try:
            ImageObject.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


# Note: This function is under construction. Please do not use for now.
class ImageDeleteWithID(APIView):
    permission_classes = [AllowAny, ]

    def delete(self, request, id):
        try:
            ImageObject = GroupImages.objects.get(pk=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        print(ImageObject.Image.url)
        if os.path.isfile(ImageObject.Image.url):
            os.remove(ImageObject.Image.url)
        print(ImageObject.Image_after_url)
        if os.path.isfile(str(ImageObject.Image_after_url)):
            os.remove(str(ImageObject.Image_after_url))
        ImageObject.delete()
        return Response(status.HTTP_204_NO_CONTENT)

# Class TempImageUpload
# Author: Chunao Liu
# Return value: JsonResponse
# Inheritence:
#       APIView
# This class respond to HTTP request
# for a group's image and it needs no
# authentication! It won't save the
# image, eigher.


class TempImageUpload(APIView):
    permission_classes = [AllowAny, ]

    def sleep_and_kill(self, path):
        time.sleep(150)
        if os.path.isfile(path):
            print("Removing!")
            os.remove(path)

    def post(self, request):
        file = request.data['Image']
        name = request.data['name']
        random_str = b64encode(os.urandom(10)).decode("utf-8")
        random_str = random_str.replace("/", "a")
        custom_name = "/home/chunao/WhiteBoard/workspace/Django-app/Backend/WhiteBoardBackEnd/media/TempImages/temp_" + \
            str(random_str) + ".png"
        CVImageOut = "/home/chunao/WhiteBoard/workspace/Django-app/Backend/WhiteBoardBackEnd/media/TempImages/After_temp_" + \
            str(random_str) + ".png"
        temp_file = open(custom_name, "wb")
        try:
            temp_file.write(base64.b64decode(file))
        except:
            temp_file.write(file.read())
        temp_file.close()
        path = custom_name
        return_data = {}
        return_data['status'] = 'success'
        return_data['image_uri'] = custom_name[custom_name.find("TempImages"):]
        # ocr_return should have the stack trace so far
        ocr_return = ocr.ocr(custom_name)

        for line in ocr_return:
            print(line)

        print("goodies!\n")

        ocr_error_output = []
        error_msg_whole = ocr_return[2]
        for i in ocr_return[6]:
            current_error = []
            print("compile\.c:[" + str(i) +
                  "]+:[0-9]+:(.|\\n)*?(?=compile\.c|\Z)")
            matches = re.finditer(
                "compile\.c:[" + str(i) + "]+:[0-9]+:(.|\\n)*?(?=compile\.c|\Z)", error_msg_whole, re.MULTILINE)
            for match in matches:
                print(match.group())
                error_msg_whole.replace(match.group(), "")
                current_error.append(match.group())
            ocr_error_output.append(current_error)

        print("all errors are as follows:\n")
        for error in ocr_error_output:
            print(error)
            print("size of error: " + str(len(error)))
            print("------------------\n")
        print("\nend of error\n")

        img_pil = ocr_return[0]
        img_pil.save(CVImageOut, format="PNG")
        return_data['ocr_return'] = ocr_return[2]
        print(CVImageOut[CVImageOut.find("TempImages"):])
        return_data['CV_return'] = CVImageOut[CVImageOut.find("TempImages"):]
        return_data['ocr_text_detected'] = ocr_return[1]
        return_data['y-coord'] = ocr_return[5]
        return_data['line-num'] = ocr_return[6]
        return_data['y-coord-match'] = ocr_error_output
        response = HttpResponse(json.dumps(return_data),
                                content_type='application/json')
        hired_gun = threading.Thread(
            target=self.sleep_and_kill, args=[str(custom_name)])
        hired_gun.start()
        hired_CV_gun = threading.Thread(
            target=self.sleep_and_kill, args=[CVImageOut])
        hired_CV_gun.start()
        return response

    def delete(self, request, GPid):
        ImageObject = GroupImagesSerializer(
            self.get_Group_image(GPid), many=True)
        try:
            ImageObject.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

# Function process image
# Author: Jenna Zhang
# Return value: JsonResponse
# This function receives image from the frontend and send it to ocr to process the image


@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
def process_image(request):
    # The image will be converted to text and compile
    return Response


# Function process image
# Author: Jenna Zhang
# Return value: JsonResponse
# This function receives image from the frontend and send it to ocr to process the image
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
def process_text(request):
    # If texted code is received, then the imageId field is null

    return Response


# Function
# Author: Jenna Zhang
# Return value: JsonResponse
# This function receives image from the frontend and send it to ocr to process the image
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
def process_text(request):
    # If texted code is received, then the imageId field is null
    response = {"code": -1, "msg": "Compilation error!"}
    response = {"code": -2, "msg": "Runtime error!"}
    response = {"code": 0, "msg": "Code successfully run!"}
    return JsonResponse(response)


# Function register
# Author: Michelle He, Jenna Zhang
# Return value: JsonResponse
# This function receives sign up request from the client and create a new user if
# all fields are valid
@api_view(['POST'])
@permission_classes((AllowAny,))
@authentication_classes([TokenAuthentication])
@transaction.atomic()
def register(request):
    user = JSONParser().parse(request)
    username = user.get("username")
    emailAdd = user.get("email")
    pw = user.get("password")

    usernameOK = False
    emailOK = False
    try:
        User.objects.get(name=username)
    except User.DoesNotExist:
        usernameOK = True

    try:
        User.objects.get(email=emailAdd)
    except User.DoesNotExist:
        emailOK = True

    if (usernameOK == False and emailOK == False):
        response = {"code": -1,
                    "msg": "Both username and email address already in use!"}
    elif (usernameOK == False):
        response = {"code": -2, "msg": "Username already in use!"}
    elif (emailOK == False):
        response = {"code": -3, "msg": "Email address already in use!"}
    else:
        UserModel = get_user_model()
        user_auth = UserModel.objects.create_user(
            username=username, email=emailAdd, password=pw)
        user_auth.save()

        # Each user belong to a default group
        user = User(name=username, email=emailAdd, pk=user_auth.pk)
        user.save()
        default_group = Group(Gpname=username, GpDescription=username + "'s default group", isDefault=True,
                              leader_uid=user_auth.pk)
        # need to save the defalut_group to generate an id before linking it to a user
        default_group.save()
        default_group.teamMember.add(user)
        # my_user.group_set.get(isDefault=True)
        default_group.save()

        response = {"code": 0, "msg": "Registration success!"}

    print(response)
    return JsonResponse(response)

# Function login_view
# Author: Jenna Zhang
# Return value: JsonResponse
# This function allows the user to log in by providing their username and password


@api_view(http_method_names=['POST'])
@permission_classes((AllowAny,))
@authentication_classes([TokenAuthentication])
@transaction.atomic()
def login_view(request):
    data = JSONParser().parse(request)
    username = data.get('username')
    password = data.get('password')

    if username is None or password is None:
        return JsonResponse({"code": 400, 'msg': 'Please provide username and password.'}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({"code": -1, "msg": 'Invalid credentials.'}, status=400)

    login(request, user)
    token, created = Token.objects.get_or_create(user=user)

    user_info = User.objects.get(name=username)
    serializer = UserSerializer(user_info)
    return JsonResponse({"code": 0, "detail": 'Successfully logged in.', "token": token.key, "user": serializer.data})


# Function logout_view
# Author: Jenna Zhang
# Return value: JsonResponse
# This function logs the user out
def logout_view(request):
    print(request.user)
    if not request.user.is_authenticated:
        return JsonResponse({'code': -1, 'detail': 'You\'re not logged in.'}, status=400)
    Token.objects.get(user=request.user).delete()
    logout(request)
    return JsonResponse({'code': 0, 'detail': 'Successfully logged out.'})


# Fuction Update Account Info
# Author: Jenna Zhang
# Return value: JsonResponse
# This function receives update accout info
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
@transaction.atomic()
def update_user(request):
    data = JSONParser().parse(request)
    user = User.objects.get(pk=request.user.pk)
    defaultGroup = user.group_set.get(isDefault=True)
    name = data.get('username')
    email = data.get('email')
    nameDup = 0
    emailDup = 0

    # check if the username is duplicated
    try:
        name_match = User.objects.get(name=name)
        if name_match.pk == user.pk:
            pass
        else:
            nameDup = 1
    except User.DoesNotExist:
        nameDup = 0
        user.name = name
        request.user.username = name

    # check if the email is duplicated
    try:
        email_match = User.objects.get(email=email)
        if email_match.pk == user.pk:
            pass
        else:
            emailDup = 1
    except User.DoesNotExist:
        emailDup = 0
        user.email = email
        request.user.email = email

    if nameDup == 1 and emailDup == 0:
        return JsonResponse({"code": -1, "msg": "Duplicate Username"})

    if nameDup == 0 and emailDup == 1:
        return JsonResponse({"code": -2, "msg": "This email address has been linked to another account"})

    if nameDup == 1 and emailDup == 1:
        return JsonResponse({"code": -3, "msg": "Both email address and username are in use"})

    user.save()
    defaultGroup.Gpname = name
    defaultGroup.description = name + "'s default group"
    defaultGroup.save()
    request.user.save()
    serializer = UserSerializer(user)
    return JsonResponse({"code": 0, "msg": "Account info successfully updated!", "user": serializer.data})

# Fuction Delete User
# Author: Jenna Zhang
# Return value: JsonResponse
# This function will delete the account


@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
@transaction.atomic()
def delete_account(request):
    data = JSONParser().parse(request)
    user = User.objects.get(pk=request.user.pk)
    user.group_set.delete(leader_uid=user.pk)
    user.delete()
    request.user.delete()
    return JsonResponse({"code": 0, "msg": "Account Deleted!"})


class Avatar(APIView):
    authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def get_user(self, request):
        return User.objects.get(pk=request.user.pk)

    def post(self, request):
        user = self.get_user(request)
        file = request.data['Image']
        custom_name = user.name + str(user.pk) + "Avatar" + ".jpg"
        try:
            img = ContentFile(base64.b64decode(file), name=custom_name)
        except:
            img = file

        user.avatar.delete(save=True)
        user.avatar.save(custom_name, img, save=True)
        serializer = UserSerializer(user)
        return JsonResponse({"code": 0, "msg": "Avatar Uploaded!", "user": serializer.data})

    def get(self, request):
        user = self.get_user(request)
        avatar = {"image": user.avatar}
        seriliazer = AvatarSerializer(avatar)
        return JsonResponse({"code": 0, "avatar": seriliazer.data})


# Class get all groups the user is in
# Author: Jenna Zhang
# Return value: JsonResponse
class UserGroupsW(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_default_group(self, request):
        user = User.objects.get(pk=request.user.pk)
        return user.group_set.get(isDefault=True)

    def get(self, request):
        user = User.objects.get(pk=request.user.pk)
        groups = user.group_set.all()
        default_group = self.get_default_group(request)
        serializer = GroupSerializerWithoutImage(groups, many=True)
        default_group_serializer = GroupSerializerWithoutImage(default_group)
        return JsonResponse(
            {"code": 0, "msg": "The teams are fetched!", "default_group": default_group_serializer.data,
             "all_groups": serializer.data})


# Class get all groups of a certain user without authentication
# Author: Jenna Zhang
# Return value: JsonResponse
class UserGroups(APIView):
    authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def get_default_group(self, request, uid):
        user = User.objects.get(pk=uid)
        return user.group_set.get(isDefault=True)

    def get(self, request, uid):
        user = User.objects.get(pk=uid)
        groups = user.group_set.all()
        default_group = self.get_default_group(request, uid)
        serializer = GroupSerializerWithoutImage(groups, many=True)
        default_group_serializer = GroupSerializerWithoutImage(default_group)
        return JsonResponse(
            {"code": 0, "msg": "The teams are fetched!", "default_group": default_group_serializer.data,
             "all_groups": serializer.data})


# get all team members
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def allMembers(request):
    data = JSONParser().parse(request)
    groupId = data.get("groupId")
    group = Group.objects.get(GpID=groupId)
    query = group.teamMember
    serializer = UserSerializer(query, many=True)
    return JsonResponse({"code": 0, "msg": "Team member fetched", "members": serializer.data})


# Class
# Author: Jenna Zhang
# Return value: JsonResponse
# This function logs the user out
class GroupOperations(APIView):
    authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def get_user(self, request):
        return User.objects.get(pk=request.user.pk)

    def get_group(self, id):
        return Group.objects.get(pk=id)

    @transaction.atomic()
    def post(self, request):
        user = self.get_user(request)
        data = JSONParser().parse(request)
        new_group = Group(
            Gpname=data['name'], GpDescription=data['description'], isDefault=False, leader_uid=user.pk)
        new_group.save()
        new_group.teamMember.add(user)
        new_group.save()
        return JsonResponse({"code": 0, "msg": "group created!"}, status=status.HTTP_201_CREATED)

    @transaction.atomic()
    def delete(self, request):
        data = JSONParser().parse(request)
        GpID = data['groupId']
        group = self.get_group(GpID)
        # check if the user is the group leader
        if not group.leader_uid == request.user.pk:
            return JsonResponse({"code": -2, "msg": "only group leader can delete this group"},
                                status=status.HTTP_400_BAD_REQUEST)
        if group.isDefault:
            return JsonResponse({"code": -1, "msg": "Cannot delete a default group"},
                                status=status.HTTP_400_BAD_REQUEST)
        group.delete()
        return JsonResponse({"code": 0, "msg": "Group successfully deleted"}, status=status.HTTP_200_OK)


class GroupMemberOperations(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_user(self, request):
        return User.objects.get(pk=request.user.pk)

    @transaction.atomic()
    def post(self, request):
        data = JSONParser().parse(request)
        email = data['email']
        GpID = data['groupId']
        group = Group.objects.get(pk=GpID)
        # check if the given email/uid exits
        try:
            user = User.objects.get(email=email)
            # check if the member is already in the group
            try:
                check_memeber = group.teamMember.get(email=email)
                return JsonResponse({"code": -2, "msg": "This user is already in the team!"},
                                    status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                group.teamMember.add(user)
                return JsonResponse({"code": 0, "msg": "User successfully addded to the team"},
                                    status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return JsonResponse({"code": -1, "msg": "User does not exist!"}, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic()
    def delete(self, request):
        data = JSONParser().parse(request)
        email = data['email']
        GpID = data['groupId']
        group = Group.objects.get(pk=GpID)
        # check if the given email/uid exits
        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"code": -1, "msg": "user does not exist!"})

        # Check if the user is in the group
        try:
            member = group.teamMember.get(email=email)
            # Check if the user to delete is the team leader
            if member.pk == self.get_user(request).pk:
                return JsonResponse({"code": -2, "msg": "You cannot delete a team leader!"},
                                    status=status.HTTP_400_BAD_REQUEST)
            group.teamMember.remove(member)
            return JsonResponse({"code": 0, "msg": "User successfully removed from the team"},
                                status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return JsonResponse({"code": -1, "msg": "You cannot delete someone not in the team!"},
                                status=status.HTTP_404_NOT_FOUND)


# Function pwd_reset
# Author: Jenna Zhang
# Return value: JsonResponse
# This function processes the password resetting requests from the front end, validate the given email
# address and send an email to the user to reset their passwords
@require_POST
@permission_classes((AllowAny,))
def pwd_reset(request):
    data = JSONParser().parse(request)
    email_address = data['email']
    UserModel = get_user_model()

    # First check if the given email exists
    try:
        user = UserModel.objects.get(email=email_address)
        subject = "Password Reset Requested"
        email_template_name = "password/password_reset_email.txt"
        token = default_token_generator.make_token(user)
        c = {
            "email": email_address,
            'domain': request.get_host(),
            'site_name': 'WhiteBoard',
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "user": user,
            'token': token,
            'protocol': 'http',
        }
        email = render_to_string(email_template_name, c)
        try:
            send_mail(subject, email, 'janneyzay540@gmail.com',
                      [email_address], fail_silently=False)
            # password_reset_form = PasswordResetForm()
            return JsonResponse({"code": 0, "msg": "Email successfully sent"})
        except BadHeaderError:
            return JsonResponse({"code": -2, "msg": "Error sending email"})

    except UserModel.DoesNotExist:
        return JsonResponse({"code": -1, "msg": "Email does not exist"})


# Class password_reset_done
# Author: Jenna Zhang
# Return value: redirection to password reset done page
# Inheritence: FormView
# This class respond to HTTP request
# for a specific user ID
# This class processes the new passwords the user enters to the password resetting page, and update password
class PasswordResetConfirmView(FormView):
    template_name = "password/password_reset_confirm.html"
    form_class = SetPasswordForm

    # success_url = "password_reset/done/"

    def form_valid(self, form):
        f = super(PasswordResetConfirmView, self).form_valid(form)
        print(form.cleaned_data['new_password2'])
        uidb64 = self.kwargs['uidb64']
        token = self.kwargs['token']
        UserModel = get_user_model()
        try:
            uid = urlsafe_base64_decode(uidb64)
            user = UserModel.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            new_password = form.cleaned_data['new_password2']
            user.set_password(new_password)
            try:
                t = Token.objects.get(user=user)
                t.delete()
            except Token.DoesNotExist:
                pass
            user.save()
        return f

    def get_success_url(self):
        return '/password_reset/done/'


# Function password_reset_done
# Author: Jenna Zhang
# Return value: html page
# This func
def password_reset_done(request):
    return render(request, 'password/password_reset_done.html')
