
# Not used in this view, but commonly imported for rendering HTML templates.
from django.shortcuts import render

#used to parse JSON from the request body.
import json

# Django helper for returning JSON responses to the client.
from django.http import JsonResponse

# disables CSRF protection for this view to test with postman
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def mock_booking(request):
    """
    A mock endpoint that accepts POST requests with JSON data
    and returns the same data back in a success response.
    """

    # Only allow POST requests
    if request.method == "POST":
        # Parse the raw JSON body into a Python dictionary
        data = json.loads(request.body)

        # Return a mocked success response
        return JsonResponse({
            "status": "success",
            "message": "Booking created (mocked)",
            "received": data
        })

    # If the request is not POST, return an error
    return JsonResponse({"error": "POST required"}, status=400)
