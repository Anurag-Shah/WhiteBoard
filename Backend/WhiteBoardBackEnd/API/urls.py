from django.urls import path
from .views import *

urlpatterns = [
    path('Users/', AllUserList.as_view()),
    path('Users/<int:id>', SpecificUser.as_view()),
    path('Users/csrf/', get_csrf, name='api-csrf'),
    path('Users/login/', login_view, name='api-login'),
    path('Users/logout/', logout_view, name='api-logout'),
    path('Users/session/', SessionView, name='api-session'),
    path('Users/whoami/', WhoAmIView, name='api-whoami'),
    path('Group/<int:id>', SpecificGroup.as_view()),
    path('Images/<int:GPid>', ImageUpload.as_view()),
]
