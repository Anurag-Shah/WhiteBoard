#############################################################################
# API/views.py
#
# Authors: Chunao Liu, Jenna Zhang
#
# This is an django APIView that handles all the HTTP request received
# by the backend. It support get, put and delete objects from the database
#############################################################################

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail, BadHeaderError
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import HttpResponse, redirect
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.views.decorators.http import require_POST
from django.views.generic import FormView
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import APIView
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

import ocr
from .models import User, Group, GroupImages
from .serializer import UserSerializer, GroupSerializer, GroupImagesSerializer
from forms import SetPasswordForm


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
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # HTTP 201: CREATED
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # HTTP 400: BAD REQUEST


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
        path = "/home/chunao/WhiteBoardWork/Backend/WhiteBoardBackEnd/media/" + str(image_path)
        zip_file = open("/home/chunao/WhiteBoardWork/Backend/WhiteBoardBackEnd/media/" + str(image_path), 'rb')
        # ocr_return should have the stack trace so far
        ocr_return = ocr.ocr(path)
        print("OCR is: " + ocr_return)
        response = HttpResponse(zip_file, content_type='application/force-download')
        response['Content-Disposition'] = 'attachment; filename="%s"' % 'CDX_COMPOSITES_20140626.zip'
        return response

    def get(self, request, GPid):
        Serializer = GroupImagesSerializer(self.get_Group_image(GPid), many=True)
        return Response(Serializer.data)


# Function sign_up
# Author: Jenna Zhang (Michelle may modify this fuction to work with her frontend api)
# Return value: JsonResponse
# This function receives sign up request from the client and create a new user if
# all fields are valid
def sign_up(request):
    data = JSONParser().parse(request)
    name = data.get('username')
    password = data.get('password')
    email = data.get('email')
    new_user = User(PW=password)
    # If username or email already exists, django.db.IntegrityError will be raised when we try to save
    # But it does not indicate which field is duplicated, so we have to check manually

    # Check email
    try:
        email_match = User.objects.get(email=email)
        # if no exception raised, then the email already exists, return with error
        return JsonResponse({"code": -1, "msg": "email already exists"})
    except email_match.DoesNotExist:
        # we are fine
        new_user.email = email

    # Check username
    try:
        name_match = User.objects.get(name=name)
        # if no exception raised, then the username already exists, return with error
        return JsonResponse({"code": -2, "msg": "username already exists"})
    except email_match.DoesNotExist:
        # we are fine
        new_user.name = name

    new_user.save()


# Function login_view
# Author: Jenna Zhang
# Return value: JsonResponse
# This function allows the user to log in by providing their username and password
@require_POST
def login_view(request):
    data = JSONParser().parse(request)
    username = data.get('username')
    password = data.get('password')

    if username is None or password is None:
        return JsonResponse({"code": 400, 'msg': 'Please provide username and password.'}, status=400)

    user = authenticate(name=username, PW=password)

    if user is None:
        return JsonResponse({"code": -1, "msg": 'Invalid credentials.'}, status=400)

    login(request, user)
    return JsonResponse({"code": 0, "detail": 'Successfully logged in.'})


# Function get_csrf
# Author: Jenna Zhang
# Return value: JsonResponse
# This function generates a CSRF token and returns it as JSON
def get_csrf(request):
    response = JsonResponse({'msg': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response


# Function logout_view
# Author: Jenna Zhang
# Return value: JsonResponse
# This function logs the user out
def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})


# Function sessionView
# Author: Jenna Zhang
# Return value: JsonResponse
# This function checks whether a session exists
class SessionView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        return JsonResponse({'isAuthenticated': True})


# Function sessionView
# Author: Jenna Zhang
# Return value: JsonResponse
# This function fetches user data for an authenticated user
class WhoAmIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        return JsonResponse({'username': request.user.username})


# Function pwd_reset
# Author: Jenna Zhang
# Return value: JsonResponse
# This function processes the password resetting requests from the front end
@require_POST
def pwd_reset(request):
    data = JSONParser().parse(request)
    email_address = data['email']

    # First check if the given email exists
    try:
        user = User.objects.get(email=email_address)
        subject = "Password Reset Requested"
        email_template_name = "/password/password_reset_email.txt"
        c = {
            "email": email_address,
            'domain': request.get_host(),
            'site_name': 'WhiteBoard',
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "user": user,
            'token': default_token_generator.make_token(user),
            'protocol': 'http',
        }
        email = render_to_string(email_template_name, c)
        try:
            send_mail(subject, email, 'janneyzay540@gmail.com', [email_address], fail_silently=False)
            password_reset_form = PasswordResetForm()
            return JsonResponse({"code": 0, "msg": "Email successfully sent"})
        except BadHeaderError:
            return JsonResponse({"code": -2, "msg": "Error sending email"})

    except user.DoesNotExist:
        return JsonResponse({"code": -1, "msg": "Email does not exist"})



class PasswordResetConfirmView(FormView):
    template_name = "/password/password_reset_confirm.html"
    form_class = SetPasswordForm
    success_url = "password_reset/done/"

    def form_valid(self, *arg, **kwargs):
        form = super(PasswordResetConfirmView, self).form_valid(*arg, **kwargs)
        uidb64=self.kwargs['uidb64']
        token=self.kwargs['token']
        UserModel = get_user_model()
        try:
            uid = urlsafe_base64_decode(uidb64)
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            new_password = form.cleaned_data['new_password2']
            user.set_password(new_password)
            user.save()
        return form

