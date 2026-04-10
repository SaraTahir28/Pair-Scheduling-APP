from datetime import timedelta

# Django Rest Framework
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Local Services and Models
from .google_calendar_service import create_google_meeting
from .models import User, SlotRule

# Local Serializers
from .serializers.booking_serializer import BookingSerializer
from .serializers.slot_rule_serializer import SlotRuleSerializer
from .user_serializers import UserSerializer


class CreateMeetingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BookingSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated = serializer.validated_data

        if validated["trainee_email"] != request.user.email:
            return Response(
                {"detail": "Users can only create bookings for themselves."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            start_time = validated["start_time"]
            end_time = start_time + timedelta(hours=1)

            result = create_google_meeting(
                start_time=start_time,
                end_time=end_time,
                trainee_email=validated["trainee_email"],
                volunteer_email=validated["volunteer_email"],
            )

            booking = serializer.save(
                google_meet_link=result["meet_link"]
            )

        except Exception as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                "booking_id": booking.id,
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


class CurrentProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class SlotRuleCreateView(generics.CreateAPIView):
    queryset = SlotRule.objects.all()
    serializer_class = SlotRuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Always assign the slot rule to the logged-in user
    def perform_create(self, serializer):
        serializer.save(volunteer=self.request.user)
