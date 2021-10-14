# Generated by Django 3.2.7 on 2021-10-14 03:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0002_auto_20211005_2248'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupImages',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ImageID', models.CharField(max_length=100)),
                ('name', models.CharField(max_length=50)),
                ('Image', models.ImageField(upload_to='images/')),
                ('GpID', models.ManyToManyField(to='API.Group')),
            ],
        ),
    ]