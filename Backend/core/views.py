
# Not used in this view, but commonly imported for rendering HTML templates.
from django.shortcuts import render
import json

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

from .google_calendar_service import create_google_meeting
from .serializers.booking_serializer import BookingSerializer

#Django Rest Framework and serializer for endpoints
from rest_framework import generics
from .models import User
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
            "start": str(result["start"]),
            "end": str(result["end"]),
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    except Exception as error:
        return JsonResponse({"error": str(error)}, status=500)


class UserListCreateView(generics.ListCreateAPIView):
    
    queryset = User.objects.all().order_by("id")

    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    
    queryset = User.objects.all()

    serializer_class = UserSerializer