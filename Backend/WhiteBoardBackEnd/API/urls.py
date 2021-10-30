from django.urls import path
from .views import *

urlpatterns = [
    path('Users/', AllUserList.as_view()),
    path('Users/<int:id>', SpecificUser.as_view()),
    path('Users/login/', login),

    path('Register/', register),

    path('Group/<int:id>', SpecificGroup.as_view()),
    path('Images/<int:GPid>', ImageUpload.as_view()),

    path('TypenCodes/<int:GPid>', ),    # TODO: view to handle typen code
]
