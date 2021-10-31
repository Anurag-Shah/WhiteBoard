from django.urls import path

from .views import *
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('Users/', AllUserList.as_view()),
    path('Users/<int:id>', SpecificUser.as_view()),
    path('User/login/', login_view, name='login'),
    path('User/register/', sign_up, name='register'),
    path('User/logout/', logout_view, name='logout'),
    path('Group/<int:id>', SpecificGroup.as_view()),
    path('Images/<int:GPid>', ImageUpload.as_view()),
    path("password_reset", pwd_reset, name="password_reset"),
    path('password_reset_confirm/<uidb64>/<token>',
         PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
    path('password_reset/done/', password_reset_done, name='password_reset_done'),

]
