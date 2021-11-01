from django.db import models
from django.db.models.deletion import CASCADE
from django.contrib.auth.models import AbstractUser


# Create your models here.
# Models will be automatically converted into SQL tables

# This user class contains no password info, so it is safe to send user objects to front-end
class User(models.Model):
    name = models.CharField(max_length=25)
    email = models.EmailField()
    uid = models.AutoField(primary_key=True)
    default_group_id = models.IntegerField()
    avatar = models.ImageField()

    # PW = models.IntegerField(default=9999)  # No longer needed

    class meta():
        db_table = 'User'
        ordering = ['uid']

    def __str__(self):
        return self.name


# Modify default User Model in Django Authentication System
# This model is for user authentication
# class UserAuth(AbstractUser):
#     # name and email should be unique
#     username = models.CharField(max_length=25, unique=True)
#     email = models.EmailField(unique=True)
#     uid = models.IntegerField(primary_key=True)  # auto-incremented


class Group(models.Model):
    Gpname = models.CharField(max_length=25)
    GpID = models.AutoField(primary_key=True)
    GpDescription = models.TextField()
    isDefault = models.BooleanField(default=True)
    teamMember = models.ManyToManyField(User)

    class meta():
        db_table = 'Group'
        ordering = ['GpID']

    def __str__(self):
        return self.Gpname


class GroupImages(models.Model):
    ImageID = models.CharField(max_length=100)
    name = models.CharField(max_length=50)
    Image = models.ImageField(upload_to='images/', default='DefaultImages/default-image-620x600.jpg')
    GpID = models.ForeignKey(Group, to_field="GpID", on_delete=CASCADE, default=8888)

    class meta():
        db_table = 'ImageID'
        ordering = ['ImageID']

    def __str__(self):
        return self.name


class GroupCode(models.Model):
    CodeID = models.CharField(max_length=100)
    name = models.CharField(max_length=50)
    Code = models.FileField(upload_to='Code/', default=None)
    ImageID = models.ForeignKey(GroupImages, to_fields="ImageID", on_delete=CASCADE, null=True)
    GpID = models.ForeignKey(Group, to_field="GpID", on_delete=CASCADE, default=8888)

    class meta():
        db_table = 'GroupCode'
        ordering = ['CodeID']

    def __str__(self):
        return self.name
