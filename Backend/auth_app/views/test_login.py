"""Test-only login endpoint. Gated on DEBUG so it 404s in production."""

from django.conf import settings
from django.contrib.auth import login
from django.http import Http404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import User


@method_decorator(csrf_exempt, name="dispatch")
class TestLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        if not settings.DEBUG:
            raise Http404

        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "email is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        name = request.data.get("name") or email.split("@")[0]
        role = request.data.get("role", "volunteer")

        user, _ = User.objects.get_or_create(
            email=email,
            defaults={"username": email, "first_name": name, "role": role},
        )

        user.backend = "django.contrib.auth.backends.ModelBackend"
        login(request, user)

        return Response(
            {
                "id": user.id,
                "email": user.email,
                "name": user.get_full_name() or user.username,
            },
            status=status.HTTP_200_OK,
        )
