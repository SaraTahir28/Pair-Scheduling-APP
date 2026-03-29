
# Not used in this view, but commonly imported for rendering HTML templates.
from django.shortcuts import render

import json

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

from .google_calendar_service import create_google_meeting

#Django Rest Framework and serializer for endpoints
from rest_framework import generics, permissions
from .models import User
from .serializers import UserSerializer

@csrf_exempt
@require_POST
def create_meeting_view(request):
    """
    Create a Google Calendar event with a Google Meet link
    and send invitations to the trainee and volunteer.
    """
    try:
        data = json.loads(request.body)

        trainee_email = data.get("trainee_email")
        volunteer_email = data.get("volunteer_email")
        start_time = data.get("start_time")
        end_time = data.get("end_time")

        # basic validation to ensure required fields         
        if not trainee_email or not volunteer_email or not start_time or not end_time:
            return JsonResponse(
                {
                    "error": "trainee_email, volunteer_email, start_time, and end_time are required."
                },
                status=400,
            )

        result = create_google_meeting(
            start_time=start_time,
            end_time=end_time,
            trainee_email=trainee_email,
            volunteer_email=volunteer_email,
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

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    except Exception as error:
        # return the integration error to make local debugging
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