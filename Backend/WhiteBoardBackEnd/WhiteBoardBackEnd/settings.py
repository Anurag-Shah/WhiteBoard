"""
Django settings for WhiteBoardBackEnd project.

Generated by 'django-admin startproject' using Django 3.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-qk!d=*&ds!@-jw8%8fu7qpx1xcsy5-0qnkt394+$k+^ua2mlil'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

<<<<<<< HEAD
# ALLOWED_HOSTS = ['ec2-3-144-80-126.us-east-2.compute.amazonaws.com',
#                  "127.0.0.1",
#                  "66.253.158.235",
#                  ]

ALLOWED_HOSTS = ['ec2-3-144-80-126.us-east-2.compute.amazonaws.com',
                 'ec2-18-218-227-246.us-east-2.compute.amazonaws.com',
                 '18.218.227.246',
                 'ec2-3-15-170-72.us-east-2.compute.amazonaws.com',
                 'ec2-3-144-142-207.us-east-2.compute.amazonaws.com',
                 '66.253.158.235',
                 ]

# AWS SES settings
EMAIL_BACKEND = 'django_ses.SESBackend'
EMAIL_HOST = "janneyzay540@gmail.com"
AWS_ACCESS_KEY_ID = ''  # hidden
AWS_SECRET_ACCESS_KEY = ''  # hidden
AWS_SES_REGION_NAME = 'us-west-2'  # (ex: us-east-2)
AWS_SES_REGION_ENDPOINT = 'email.us-west-2.amazonaws.com'  # (ex: email.us-east-2.amazonaws.com)
=======
ALLOWED_HOSTS = ['ec2-3-144-80-126.us-east-2.compute.amazonaws.com',
'ec2-18-218-227-246.us-east-2.compute.amazonaws.com',
'18.218.227.246',
'ec2-3-15-170-72.us-east-2.compute.amazonaws.com',
'ec2-3-144-142-207.us-east-2.compute.amazonaws.com',]

>>>>>>> main

# Application definition

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
)

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'API',
    'crispy_forms',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # new
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'WhiteBoardBackEnd.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['/API/templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'WhiteBoardBackEnd.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

# Changed
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'project_db',
#         'USER': 'root',
#         'PASSWORD': 'janney006',
#         'HOST': 'localhost',
#         'PORT': '3306',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'django_data_base',
        'USER': 'root',
        'PASSWORD': '990603qwerty',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'  # 'http://myhost:port/media/'


# NEW Settings

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'COERCE_DECIMAL_TO_STRING': False
}

CORS_ORIGIN_ALLOW_ALL = True

CORS_EXPOSE_HEADERS = ['Content-Type']
