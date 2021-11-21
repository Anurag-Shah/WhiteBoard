#############################################################################
# API/views.py
#
# Authors: Chunao Liu, Jenna Zhang
#
# This is an django APIView that handles all the HTTP request received
# by the backend. It support get, put and delete objects from the database
#############################################################################

import base64

import ocr
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.files.base import ContentFile
from django.core.mail import send_mail, BadHeaderError
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import HttpResponse, render
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.http import require_POST
from django.views.generic import FormView
from forms import SetPasswordForm
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import APIView, permission_classes, authentication_classes, api_view
from rest_framework.parsers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import User, Group, GroupImages
from .serializer import UserSerializer, GroupSerializer, GroupImagesSerializer, AvatarSerializer


# Create your views here.

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
    def get(self, request):
        users = User.objects.all()
        Serializer = UserSerializer(users, many=True)
        return Response(Serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # HTTP 201: CREATED
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # HTTP 400: BAD REQUEST


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
    def get_group_object(self, id):
        try:
            return Group.objects.get(pk=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, id):
        Serializer = GroupSerializer(self.get_group_object(id))
        return Response(Serializer.data)

    def put(self, request, id):
        Serializer = GroupSerializer(self.get_group_object(id), data=request.data)
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

# Need to uncomment the following two lines to enable token based authentication
class ImageUpload(APIView):
    # or comment these tow lines:
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
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
        group = self.get_group_object(GPid)
        image = GroupImages.objects.create(Image=file, GpID=group, name=name)
        image_path = image.Image
        path = "/home/chunao/WhiteBoardWork/Backend/WhiteBoardBackEnd/media/" + str(image_path)
        zip_file = open(path, 'rb')
        # ocr_return should have the stack trace so far
        ocr_return = ocr.ocr(path)
        print("OCR is: " + ocr_return)
        response = HttpResponse(zip_file, content_type='application/force-download')
        response['Content-Disposition'] = 'attachment; filename="%s"' % 'CDX_COMPOSITES_20140626.zip'
        return response

    def get(self, request, GPid):
        Serializer = GroupImagesSerializer(self.get_Group_image(GPid), many=True)
        return Response(Serializer.data)


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
    return Response


# Function sign_up
# Author: Michelle
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
        user_auth = UserModel.objects.create_user(username=username, email=emailAdd, password=pw)
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
    request.user.save()
    serializer = UserSerializer(user)
    return JsonResponse({"code": 0, "msg": "Account info successfully updated!", "user": serializer.data})

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


class AddImage(APIView):
    authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def get_user(self, request):
        return User.objects.get(pk=request.user.pk)

    def post(self, request):
        file = request.data['Image']
        GPid = request.data['GPid']
        user = self.get_user(request)
        custom_name = user.name + ":" + str(GPid) + ".jpg"
        try:
            img = ContentFile(base64.b64decode(file), name=custom_name)
        except:
            img = file

        group = Group.objects.get(pk=GPid)
        # image = GroupImages.objects.create(Image=img, GpID=group, name=custom_name)
        groupSerializer = GroupSerializer(group)

        return JsonResponse({"code": 0, "msg": "Avatar Uploaded!", "groups": groupSerializer.data})


# Class get all groups the user is in
# Author: Jenna Zhang
# Return value: JsonResponse
# This function logs the user out
class UserGroups(APIView):
    authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def get_default_group(self, request):
        user = User.objects.get(pk=request.user.pk)
        return user.group_set.get(isDefault=True)

    def get(self, request):
        user = User.objects.get(pk=request.user.pk)
        groups = user.group_set.all()
        default_group = self.get_default_group(request)
        serializer = GroupSerializer(groups, many=True)
        default_group_serializer = GroupSerializer(default_group)
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
        new_group = Group(Gpname=data['name'], GpDescription=data['description'], isDefault=False, leader_uid=user.pk)
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
            send_mail(subject, email, 'janneyzay540@gmail.com', [email_address], fail_silently=False)
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
