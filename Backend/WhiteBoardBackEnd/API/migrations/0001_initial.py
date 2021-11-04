# Generated by Django 3.2.8 on 2021-11-03 04:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('Gpname', models.CharField(max_length=25)),
                ('GpID', models.AutoField(primary_key=True, serialize=False)),
                ('GpDescription', models.TextField()),
                ('isDefault', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('name', models.CharField(max_length=25)),
                ('email', models.EmailField(max_length=254)),
                ('uid', models.AutoField(primary_key=True, serialize=False)),
                ('avatar', models.ImageField(default=None, upload_to='Avatars')),
            ],
        ),
        migrations.CreateModel(
            name='GroupImages',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ImageID', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=50)),
                ('Image', models.ImageField(default='DefaultImages/default-image-620x600.jpg', max_length=500, upload_to='images/')),
                ('GpID', models.ForeignKey(default=8888, on_delete=django.db.models.deletion.CASCADE, to='API.group')),
            ],
        ),
        migrations.CreateModel(
            name='GroupCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('CodeID', models.CharField(max_length=500)),
                ('name', models.CharField(max_length=50)),
                ('Code', models.FileField(default=None, max_length=500, upload_to='Code/')),
                ('GpID', models.ForeignKey(default=8888, on_delete=django.db.models.deletion.CASCADE, to='API.group')),
                ('ImageID', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='API.groupimages')),
            ],
        ),
        migrations.AddField(
            model_name='group',
            name='teamMember',
            field=models.ManyToManyField(to='API.User'),
        ),
    ]