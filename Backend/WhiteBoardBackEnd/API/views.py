from django.shortcuts import render, HttpResponse
from .serializer import UserSerializer, GroupSerializer
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
from .models import User, Group
from django.views.decorators.csrf import csrf_exempt
import io

# Create your views here.

def Index(request):
    return HttpResponse("It is working!")

@csrf_exempt
def User_List(request):
    # See if the request is GET or SET
    if (request.method == 'GET'):
        users = User.objects.all()
        Serializer = UserSerializer(users, many=True)
        return JsonResponse(Serializer.data, safe=False)
    
    elif (request.method == 'POST'):
        data = JSONParser().parse(request)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(Serializer.data, status=201) # HTTP 201: CREATED
        return JsonResponse(Serializer.errors, status=400) # HTTP 400: BAD REQUEST
