# Generated by Django 3.2.7 on 2021-10-06 02:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='id',
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254),
        ),
        migrations.AlterField(
            model_name='user',
            name='name',
            field=models.CharField(max_length=25),
        ),
        migrations.AlterField(
            model_name='user',
            name='uid',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('Gpname', models.CharField(max_length=25)),
                ('GpID', models.IntegerField(primary_key=True, serialize=False)),
                ('GpDescription', models.TextField()),
                ('teamMember', models.ManyToManyField(to='API.User')),
            ],
        ),
    ]