from django.db import models
from django.db import models

# Create your models here.
class User(models.Model):
    name = models.TextField()
    email = models.TextField()
    uid = models.IntegerField()

    def __str__(self):
        return self.name