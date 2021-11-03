#############################################################################
# API/views.py
#
# Authors: Chunao Liu, Jenna Zhang
#
# This is an django APIView that handles all the HTTP request received
# by the backend. It support get, put and delete objects from the database
#############################################################################

from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail, BadHeaderError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, redirect, render
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.http import require_POST
from django.views.generic import FormView
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.decorators import APIView, permission_classes, authentication_classes, api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import *
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

import ocr
from .models import User, Group, GroupImages
from .serializer import UserSerializer, GroupSerializer, GroupImagesSerializer, AvatarSerializer
from forms import SetPasswordForm


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
# @permission_classes([IsAuthenticated])
# @authentication_classes([TokenAuthentication])
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
# Author: Jenna Zhang (Michelle may modify this fuction to work with her frontend api)
# Return value: JsonResponse
# This function receives sign up request from the client and create a new user if
# all fields are valid
@require_POST
@permission_classes((AllowAny,))
@api_view(['POST'])
def sign_up(request):
    data = JSONParser().parse(request)
    name = data.get('username')
    password = data.get('password')
    email = data.get('email')
    UserModel = get_user_model()
    new_user = UserModel.objects.create_user(username=name, password=password)
    # If username or email already exists, django.db.IntegrityError will be raised when we try to save
    # But it does not indicate which field is duplicated, so we have to check manually

    # Check email
    try:
        email_match = User.objects.get(email=email)
        # if no exception raised, then the email already exists, return with error
        return JsonResponse({"code": -1, "msg": "email already exists"})
    except User.DoesNotExist:
        # we are fine
        new_user.email = email

    # Check username
    try:
        name_match = User.objects.get(name=name)
        # if no exception raised, then the username already exists, return with error
        return JsonResponse({"code": -2, "msg": "username already exists"})
    except User.DoesNotExist:
        # we are fine
        new_user.username = name

    new_user.save()

    # Each user belong to a default group
    my_user = User(name=name, email=email)
    my_user.save()
    # my_user.group_set.get(isDefault=True)
    default_group = Group(Gname=name, GpDescription=name + "'s default group", isDefault=True)
    default_group.teamMember.add(my_user)
    # my_user.group_set.get(isDefault=True)
    default_group.save()

    return JsonResponse({"code": 0, "msg": "Successfully signed up!"})


# Function login_view
# Author: Jenna Zhang
# Return value: JsonResponse
# This function allows the user to log in by providing their username and password
@api_view(http_method_names=['POST'])
@permission_classes((AllowAny,))
@authentication_classes([TokenAuthentication])
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
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'code': -1, 'detail': 'You\'re not logged in.'}, status=400)
    logout(request)
    return JsonResponse({'code': 0, 'detail': 'Successfully logged out.'})


# Fuction Update Account Info
# Author: Jenna Zhang
# Return value: JsonResponse
# This function receives update accout info
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
def update_user(request):
    data = JSONParser().parse(request)
    uid = data.get('uid')
    user = User.objects.get(pk=uid)
    name = data.get('username')
    email = data.get('email')

    # check if the username is duplicated
    try:
        name_match = User.objects.get(name=name)
        if name_match.pk == uid:
            pass
        else:
            return JsonResponse({"code": -1, "msg": "Duplicate Username"})
    except User.DoesNotExist:
        user.name = name
        request.user.username = name

    # check if the email is duplicated
    try:
        email_match = User.objects.get(email=email)
        if email_match.pk == uid:
            pass
        else:
            return JsonResponse({"code": -2, "msg": "This email address has been linked to another account"})
    except User.DoesNotExist:
        user.email = email
        request.user.email = email

    user.save()
    request.user.save()
    return JsonResponse({"code": 0, "msg": "Account info successfully updated!"})


class Avatar(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_user(self, request):
        return User.objects.get(pk=request.user.pk)

    def post(self, request):
        print(request.data)
        user = self.get_user(request)
        file = request.data['Image']
        user.avatar = file
        user.save()
        return JsonResponse({"code": 0, "msg": "Avatar Uploaded!"})

    def get(self, request):
        user = self.get_user(request)
        avatar = {"image": user.avatar}
        seriliazer = AvatarSerializer(avatar)
        return JsonResponse({"code": 0, "avatar": seriliazer.data})


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
