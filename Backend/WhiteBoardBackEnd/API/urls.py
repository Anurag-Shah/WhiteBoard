from django.urls import path
from .views import *

urlpatterns = [
    path('Users/', AllUserList.as_view()),
    path('Users/<int:id>', SpecificUser.as_view())
]