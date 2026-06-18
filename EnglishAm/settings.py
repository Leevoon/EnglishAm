"""
Production-shaped settings. Every value that varies between environments is
read from environment variables (or a local `.env` file via django-environ).
Defaults exist for dev convenience but every defaulted value is something you
WOULD want different in production.

Required env vars in production:
  - DJANGO_SECRET_KEY        (no default)
  - DJANGO_DEBUG=0
  - DJANGO_ALLOWED_HOSTS=your.domain
  - DB_* (NAME/USER/PASSWORD/HOST/PORT)

See .env.example for the full list.
"""
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DJANGO_DEBUG=(bool, False),
    DJANGO_SECURE_PROXY_SSL_HEADER=(bool, False),
)
# Read .env if present. Safe to ship: file is in .gitignore.
environ.Env.read_env(BASE_DIR / '.env')


# === Core ===
SECRET_KEY = env('DJANGO_SECRET_KEY', default='django-insecure-DEV-ONLY-change-me')
DEBUG = env('DJANGO_DEBUG')
ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=['localhost', '127.0.0.1'])
CSRF_TRUSTED_ORIGINS = env.list(
    'DJANGO_CSRF_TRUSTED_ORIGINS',
    default=['http://localhost:5173', 'http://127.0.0.1:5173'],
)

if not DEBUG and SECRET_KEY.startswith('django-insecure-DEV-ONLY'):
    raise RuntimeError(
        "Refusing to start with DEBUG=False and the development SECRET_KEY. "
        "Set DJANGO_SECRET_KEY in your environment."
    )


# === Apps ===
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'django_filters',
    'english',
]


# === CORS (only active when DJANGO_CORS_ALLOWED_ORIGINS is set) ===
# Set this when the React frontend lives on a different origin than Django.
# Same-origin (frontend behind nginx that proxies /api here) leaves this empty.
CORS_ALLOWED_ORIGINS = env.list('DJANGO_CORS_ALLOWED_ORIGINS', default=[])
CORS_ALLOW_CREDENTIALS = True  # session cookies need this


# === REST framework ===
# BasicAuthentication is convenient for curl in dev but a credential-stuffing
# magnet in production; gated on DEBUG.
_auth_classes = ['rest_framework.authentication.SessionAuthentication']
if DEBUG:
    _auth_classes.append('rest_framework.authentication.BasicAuthentication')

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'english.pagination.SizedPagination',
    'PAGE_SIZE': 25,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': _auth_classes,
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}


# === Middleware ===
# CORS middleware must come before CommonMiddleware (django-cors-headers docs).
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # serve collected static in prod
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'EnglishAm.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'EnglishAm.wsgi.application'


# === Database ===
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('DB_NAME', default='english'),
        'USER': env('DB_USER', default='root'),
        'PASSWORD': env('DB_PASSWORD', default='rootpw'),
        'HOST': env('DB_HOST', default='127.0.0.1'),
        'PORT': env('DB_PORT', default='3307'),
        'OPTIONS': {'charset': 'utf8mb4'},
    }
}


# === Password validation ===
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# === I18N ===
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# === Static & default field ===
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# === Production hardening (only applied when DEBUG=False) ===
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = 'same-origin'
    X_FRAME_OPTIONS = 'DENY'

    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

    CSRF_COOKIE_SECURE = True
    CSRF_COOKIE_SAMESITE = 'Lax'

    if env('DJANGO_SECURE_PROXY_SSL_HEADER'):
        SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
        SECURE_SSL_REDIRECT = True


# === Sentry (no-op when SENTRY_DSN is empty) ===
_SENTRY_DSN = env('SENTRY_DSN', default='')
if _SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
    sentry_sdk.init(
        dsn=_SENTRY_DSN,
        integrations=[DjangoIntegration()],
        traces_sample_rate=0.0,
        send_default_pii=False,
        environment='production' if not DEBUG else 'development',
    )
