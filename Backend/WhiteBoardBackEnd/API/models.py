from django.db import models
from django.db import models

# Create your models here.
# Models will be automatically converted into SQL tables
class User(models.Model):
    name = models.CharField(max_length=25)
    email = models.EmailField()
    uid = models.IntegerField(primary_key=True)
    class meta():
        db_table = 'User'
        ordering = ['uid']

    def __str__(self):
        return self.name

class Group(models.Model):
    Gpname = models.CharField(max_length=25)
    GpID = models.IntegerField(primary_key=True)
    GpDescription = models.TextField()
    teamMember = models.ManyToManyField(User)
    class meta():
        db_table = 'Group'
        ordering = ['GpID']

    def __str__(self):
        return self.Gpname
