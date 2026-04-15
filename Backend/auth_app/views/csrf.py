from django.middleware.csrf import get_token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


class CsrfTokenView(APIView):
    # CSRF token should be accessible without login
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"csrfToken": get_token(request)})
