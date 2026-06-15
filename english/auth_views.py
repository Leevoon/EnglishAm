"""Session-based login/logout/whoami for the React SPA.

Why sessions over JWT:
- HttpOnly cookies can't be exfiltrated by XSS the way localStorage tokens can.
- Django handles invalidation natively (logout deletes the session row).
- CSRF is handled by Django's existing middleware — no token plumbing on the JS side.
"""
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response


def _user_payload(user):
    return {
        'username': user.username,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'detail': 'Username and password are required.'}, status=400)
    user = authenticate(request, username=username, password=password)
    if user is None or not user.is_active:
        return Response({'detail': 'Invalid credentials.'}, status=401)
    login(request, user)
    return Response(_user_payload(user))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response(status=204)


@api_view(['GET'])
@permission_classes([AllowAny])
def whoami(request):
    # Always rotate/issue a CSRF token so the React app has one to send back
    # on subsequent state-changing requests.
    get_token(request)
    if request.user.is_authenticated:
        return Response(_user_payload(request.user))
    return Response({'detail': 'Not authenticated.'}, status=401)
