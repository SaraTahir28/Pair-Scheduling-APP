from datetime import timedelta

# Django Core
from django.db.models import Q
from django.utils import timezone

# Django Rest Framework
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from core.services.available_slots import build_available_slots, exclude_booked_slots

from .google_calendar_service import create_google_meeting

# Local Models & Services
from .models import Booking, SlotRule, User
from .serializers.available_slot_serializer import AvailableSlotSerializer
from .serializers.booking_serializer import BookingSerializer
from .serializers.slot_rule_serializer import SlotRuleSerializer

# Local Serializers
from .user_serializers import UserSerializer


class CreateMeetingView(APIView):
    def post(self, request):
        serializer = BookingSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated = serializer.validated_data

        try:
            start_time = validated["start_time"]
            end_time = start_time + timedelta(hours=1)

            result = create_google_meeting(
                start_time=start_time,
                end_time=end_time,
                trainee_email=request.user.email,
                volunteer_email=validated["volunteer"].email,
                agenda=validated.get("agenda", ""),
            )

            booking = serializer.save(
                trainee=request.user, google_meet_link=result["meet_link"]
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

    def get_object(self):
        return self.request.user


class AvailableSlotsView(APIView):
    def get(self, request):
        rules = SlotRule.objects.select_related("volunteer").filter(
            deleted_at__isnull=True
        )

        user_group = request.user.group
        if user_group:
            rules = rules.filter(Q(group=user_group) | Q(group="all"))
        else:
            rules = rules.filter(group="all")

        volunteer_id = request.query_params.get("volunteer_id")
        if volunteer_id:
            rules = rules.filter(volunteer_id=volunteer_id)

        group = request.query_params.get("group")
        if group:
            rules = rules.filter(group=group)

        # Filtering by host will be used to filter volunteer/staff/trainee/etc
        role = request.query_params.get("role")
        if role:
            rules = rules.filter(volunteer__role=role)

        slots = build_available_slots(rules, timezone.now())

        booked_pairs = set(
            Booking.objects.filter(
                volunteer_id__in=[slot.volunteer_id for slot in slots],
                start_time__in=[slot.start_time for slot in slots],
            ).values_list("volunteer_id", "start_time")
        )

        slots = exclude_booked_slots(slots, booked_pairs)

        serializer = AvailableSlotSerializer(slots, many=True)
        return Response(serializer.data)


class SlotRuleListCreateView(generics.ListCreateAPIView):
    serializer_class = SlotRuleSerializer

    def get_queryset(self):
        return SlotRule.objects.filter(
            volunteer=self.request.user,
            deleted_at__isnull=True,
        ).order_by("start_time")

    # Always assign the slot rule to the logged-in user
    def perform_create(self, serializer):
        serializer.save(volunteer=self.request.user)


class SlotRuleDeleteView(generics.DestroyAPIView):
    queryset = SlotRule.objects.filter(deleted_at__isnull=True)
    serializer_class = SlotRuleSerializer

    def perform_destroy(self, instance):
        if instance.volunteer != self.request.user:
            raise PermissionDenied(
                "You do not have permission to delete this slot rule."
            )

        instance.deleted_at = timezone.now()
        instance.save(update_fields=["deleted_at"])
