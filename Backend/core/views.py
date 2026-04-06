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
from .models import User, SlotRule
from core.services.available_slots import build_available_slots
from .user_serializers import UserSerializer

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
        #TODO - more filters (group, time other than NOW, language/tags/labels, volunteer vs staff)

        if volunteer_id:
            rules = rules.filter(volunteer_id=volunteer_id)

        #TODO filter out already booked slots! Get bookings from DB and pass them to build_available_slots so it can do the filtering

        return Response([dataclasses.asdict(slot) for slot in build_available_slots(rules, timezone.now())])
