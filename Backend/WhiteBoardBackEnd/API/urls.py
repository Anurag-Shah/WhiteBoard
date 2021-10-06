from django.urls import path
from .views import Index, User_List

urlpatterns = [
    path('Users/', User_List),
]