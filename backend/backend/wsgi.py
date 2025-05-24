import os
from django.core.wsgi import get_wsgi_application

# Definir o módulo de configurações do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crimwatch.settings')

# Obter a aplicação WSGI
application = get_wsgi_application()
