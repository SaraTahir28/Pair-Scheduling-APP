from django.contrib.auth import logout
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "id": request.user.id,
                "email": request.user.email or "",
                "name": request.user.get_full_name() or request.user.username,
                "role": getattr(request.user, "role", None),
                "status": getattr(request.user, "status", None),
            }
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)  # clears session
        return Response({"message": "Logged out"}, status=status.HTTP_200_OK)

    def get(self, request):
        return Response(
            {"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
