from django.urls import path

from .views import *

urlpatterns = [
    path('Users/', AllUserList.as_view()),
    path('Users/<int:id>', SpecificUser.as_view()),
    path('User/login/', login_view, name='api-login'),
    path('User/register/', sign_up, name='api-login'),
    path('User/logout/', logout_view, name='api-logout'),
    path('Group/<int:id>', SpecificGroup.as_view()),
    path('Images/<int:GPid>', ImageUpload.as_view()),
    path("password_reset", pwd_reset, name="password_reset"),
    path('password_reset_confirm/<uidb64>/<token>',
         PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),

]
