from django.shortcuts import render
import json

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db.models import Q

from .google_calendar_service import create_google_meeting
from .serializers.booking_serializer import BookingSerializer

import dataclasses

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User, SlotRule, Booking
from core.services.available_slots import build_available_slots
from .user_serializers import UserSerializer
from .serializers.slot_rule_serializer import SlotRuleSerializer

@csrf_exempt
@require_POST
def create_meeting_view(request):
    try:
        data = json.loads(request.body)

        serializer = BookingSerializer(data=data)

        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)
        validated = serializer.validated_data

        result = create_google_meeting(
            start_time=validated["start_time"],
            end_time=validated["end_time"],
            trainee_email=validated["trainee_email"],
            volunteer_email=validated["volunteer_email"],
        )

        return JsonResponse(
            {
                "message": "Meeting created successfully.",
                "event_id": result["event_id"],
                "meet_link": result["meet_link"],
                "start": result["start"],
                "end": result["end"],
                },
            status=201,
        )

    except (json.JSONDecodeError, ValueError, TypeError):
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    except Exception as error:
        return JsonResponse({"error": str(error)}, status=500)


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by("id")

    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()

    serializer_class = UserSerializer

class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class AvailableSlotsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        rules = SlotRule.objects.select_related("volunteer").all()

        user_group = request.user.group
        if user_group:
            rules = rules.filter(Q(group=user_group) | Q(group='all'))
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

        # filter out already booked slots. Get bookings from DB and passing them to build_available_slots
        slots = build_available_slots(rules, timezone.now())

        booked_pairs = set(
            Booking.objects.filter(
                volunteer_id__in=[slot.volunteer_id for slot in slots],
                start_time__in=[slot.start_time for slot in slots],
            ).values_list("volunteer_id", "start_time")
        )

        slots = [
            slot for slot in slots
            if (slot.volunteer_id, slot.start_time) not in booked_pairs
        ]

        return Response([dataclasses.asdict(slot) for slot in slots])
 
class SlotRuleCreateView(generics.CreateAPIView):

    queryset = SlotRule.objects.all()
    serializer_class = SlotRuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    #Always assign the slot rule to the logged-in user
    def perform_create(self, serializer):
        serializer.save(volunteer=self.request.user)
