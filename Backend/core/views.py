
# Not used in this view, but commonly imported for rendering HTML templates.
from django.shortcuts import render

import json

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

from .google_calendar_service import create_google_meeting

#Django Rest Framework and serializer for endpoints
from rest_framework import generics
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
    """
    This view handle:

    GET /api/users/
        Returns a list of all users in the system
        Used for debugging, admin views, or listing users

    POST /api/users/
        Creates a new user, in our project is not needed because users are created via Google Authentication
    """

    # This is the base queryset used by the view that defines which users exist for GET requests
    queryset = User.objects.all().order_by("id")

    # This tells Django REST framework how to convert database objects to JSON and vice versa
    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    """
    This view handles:

    GET /api/users/<id>/
        Returns a single user by ID

    PATCH /api/users/<id>/
        Partially updates a user
        It's used to update profile fields like:
            - role
            - status (maybe admin only, possibly group in the future [ITP,SDC,etc])
    """
    # Defines which users can be retrieved/updated
    queryset = User.objects.all()

    # Defines how data is serialized/deserialized
    serializer_class = UserSerializer