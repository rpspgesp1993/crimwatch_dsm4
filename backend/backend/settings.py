import os
from pathlib import Path

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Security settings
SECRET_KEY = 'your-secret-key-here'
DEBUG = True
ALLOWED_HOSTS = ['*']  # Para desenvolvimento, pode ser qualquer IP, altere para produção depois.

# Aplicações instaladas no Django
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Seu app 'backend'
    'backend',  # Adicione o nome do app que você está criando, que é 'backend'
]

# Middlewares de segurança, sessões, mensagens e outros
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Configuração de URL
ROOT_URLCONF = 'ocorrencias_project.urls'

# Template settings (caso precise usar templates no Django)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # Vamos adicionar o diretório de templates a seguir
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

# WSGI application
WSGI_APPLICATION = 'ocorrencias_project.wsgi.application'

# Banco de Dados - PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'crimwatch_db',  # Nome do seu banco de dados
        'USER': 'your_db_user',  # Usuário do banco de dados
        'PASSWORD': 'your_db_password',  # Senha do banco de dados
        'HOST': 'localhost',  # Onde o banco de dados está rodando
        'PORT': '5432',  # Porta padrão do PostgreSQL
    }
}

# Definições de password (como por exemplo complexidade mínima, etc.)
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

# Internacionalização - Definir idioma e formato de data
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Arquivos estáticos (CSS, JS, imagens, etc.)
STATIC_URL = '/static/'

# Diretórios estáticos (opcional, caso precise de um diretório específico)
STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# Diretório de mídia (upload de arquivos)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / "media"

# Diretório de templates (caso esteja usando templates no seu app Django)
TEMPLATES[0]['DIRS'] = [
    BASE_DIR / 'templates',
]

# Configuração de sessão (caso queira mudar o backend da sessão)
SESSION_ENGINE = 'django.contrib.sessions.backends.db'

# Configuração do arquivo de log (opcional)
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
