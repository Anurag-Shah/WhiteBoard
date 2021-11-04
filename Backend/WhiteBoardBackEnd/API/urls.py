from django.urls import path

from .views import *

urlpatterns = [
    path('Users/', AllUserList.as_view()),
    path('Users/<int:id>', SpecificUser.as_view()),
    path('User/login/', login_view, name='login'),
    path('User/register/', sign_up, name='register'),
    path('User/logout/', logout_view, name='logout'),
    path('User/update/', update_user, name='account_update'),
    path('User/avatar/', Avatar.as_view(), name='get_or_set_avatar'),
    path('User/groups/', UserGroups.as_view(), name='get_user_groups'),
    path('User/group/create/', GroupOperations.create, name='create_a_team'),
    path('User/group/delete/', GroupOperations.delete, name='delete_a_team'),
    path('User/group/add_member/', GroupOperations.add_member, name='add_member'),
    path('User/group/remove_member/', GroupOperations.remove_member, name='delete_member'),
    path('Group/<int:id>', SpecificGroup.as_view()),
    path('Images/<int:GPid>', ImageUpload.as_view()),
    path('Images/process', process_image, name='process_image'),
    path('Text/process', process_image, name='process_image'),
    path("password_reset", pwd_reset, name="password_reset"),
    path('password_reset_confirm/<uidb64>/<token>',
         PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
    path('password_reset/done/', password_reset_done, name='password_reset_done'),

]
