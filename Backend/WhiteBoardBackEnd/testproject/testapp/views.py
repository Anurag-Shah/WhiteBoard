from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def say_hello(request):
    return HttpResponse('<h1>Hello World</h1>')
