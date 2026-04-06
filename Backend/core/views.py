from .google_calendar_service import create_google_meeting
from .serializers.booking_serializer import BookingSerializer

# Django Rest Framework and serializer for endpoints
from rest_framework import generics
from .models import User
from .user_serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ParseError


class CreateMeetingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = BookingSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated = serializer.validated_data
        try:
            result = create_google_meeting(
                start_time=validated["start_time"],
                end_time=validated["end_time"],
                trainee_email=validated["trainee_email"],
                volunteer_email=validated["volunteer_email"],
            )
        except ParseError:
            return Response(
                {"error": "Invalid JSON body."}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as error:
            return Response(
                {"error": str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {
                "message": "Meeting created successfully.",
                "event_id": result["event_id"],
                "meet_link": result["meet_link"],
                "start": result["start"],
                "end": result["end"],
            },
            status=status.HTTP_201_CREATED,
        )


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by("id")

    serializer_class = UserSerializer


class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()

    serializer_class = UserSerializer
