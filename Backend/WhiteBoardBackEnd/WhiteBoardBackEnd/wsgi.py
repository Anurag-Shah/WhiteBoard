"""
WSGI config for WhiteBoardBackEnd project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'WhiteBoardBackEnd.settings')

path = '/home/chunao/WhiteBoard/BackEnd/WhiteBoardBackEnd/API'
if path not in sys.path:
   sys.path.insert(0, path)

sys.path.append("/home/chunao/WhiteBoard/BackEnd/WhiteBoardBackEnd")
sys.path.append("/home/chunao/WhiteBoard/BackEnd/WhiteBoardBackEnd/WhiteBoardBackEnd")
sys.path.append("/home/chunao/WhiteBoard/BackEnd")
sys.path.append("/home/chunao/WhiteBoard")

application = get_wsgi_application()
