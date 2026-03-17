
import uuid

from django.conf import settings
from google.oauth2 import service_account
from googleapiclient.discovery import build
import logging

"""
Google Calendar integration service.

This module is responsible for handling all interactions with the Google Calendar API.
It acts as a dedicated service layer, separating external API logic from Django views.

Key responsibilities:

1. Load service account credentials from a secure JSON file
2. Use domain-wide delegation to impersonate a real Workspace user
3. Build an authenticated Google Calendar API client
4. Construct event payloads (title, time, attendees, Meet link)
5. Create calendar events via the Google Calendar API
6. Generate Google Meet links automatically
7. Return structured event data to the calling view

IMPORTANT:

- Service accounts cannot send invitations or manage attendees on their own.
- Domain-wide delegation allows the service account to act on behalf of a real user.
- The delegated user becomes the "owner" of the calendar event.

This design keeps:
- business logic testable
- external integrations isolated
- views focused only on request/response handling
"""


# Full calendar scope required to:
# - create events
# - add attendees
# - generate Google Meet links
SCOPES = ["https://www.googleapis.com/auth/calendar"]



def get_calendar_service():
    """
    Creates and returns an authenticated Google Calendar API client.

    Steps:
    1. Load service account credentials from file
    2. Apply domain-wide delegation using a real Workspace user
    3. Build the Google Calendar API service client

    The delegated user (GOOGLE_DELEGATED_USER) is critical because:
    - events must belong to a real user
    - invitations must be sent from a real user
    - Meet links are owned by that user

    Returns:
        service (Resource): Google Calendar API client
    """
   credentials = service_account.Credentials.from_service_account_file(
       settings.GOOGLE_SERVICE_ACCOUNT_FILE,
       scopes=SCOPES,
   ).with_subject(settings.GOOGLE_DELEGATED_USER)


   return build("calendar", "v3", credentials=credentials)


logger = logging.getLogger(__name__)

def create_google_meeting(start_time, end_time, trainee_email, volunteer_email):
   """
    Creates a Google Calendar event with a Google Meet link.

    Args:
        start_time (str): ISO 8601 datetime (UTC)
        end_time (str): ISO 8601 datetime (UTC)
        trainee_email (str): trainee email address
        volunteer_email (str): volunteer email address

    Returns:
        dict: {
            event_id,
            meet_link,
            start,
            end
        }

    Process:
    1. Build the Google Calendar service client
    2. Log event creation request (for debugging and observability)
    3. Construct event payload
    4. Send request to Google Calendar API
    5. Log response
    6. Return relevant event data
    """

    service = get_calendar_service()
    
    # Log before creating event (useful for debugging and tracing requests)
    # "extra" adds structured metadata to logs (better for production logging systems)
    logger.info(
        "Creating Google Calendar event",
        extra={
            "start_time": start_time,
            "end_time": end_time,
            "trainee_email": trainee_email,
            "volunteer_email": volunteer_email,
        },
    )
    # Event payload sent to Google Calendar API
    event = {
        "summary": "Pair Scheduling Session",
        "description": "1:1 session between trainee and volunteer",
        "start": {
            "dateTime": start_time,
            "timeZone": "UTC",
        },
        "end": {
            "dateTime": end_time,
            "timeZone": "UTC",
        },
        "attendees": [
            {"email": trainee_email},
            {"email": volunteer_email},
        ],
        "conferenceData": {
            "createRequest": {
                # requestId must be unique for each conference creation request
                "requestId": str(uuid.uuid4()),
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
            }
        },
    }
    
    created_event = (
        service.events()
        .insert(
            calendarId=settings.GOOGLE_CALENDAR_ID,
            body=event,
            conferenceDataVersion=1,
            sendUpdates="all", # send calendar invitations to all attendees
        )
        
        .execute()
    )
    #log entry after event creation
    logger.info(
        "Google calendar event created",
        extra={
            "event_id": created_event.get("id"),
            "meet_link": created_event.get("hangoutLink"),
        },
        
    )

    return {
        "event_id": created_event.get("id"),
        "meet_link": created_event.get("hangoutLink"),
        "start": created_event.get("start"),
        "end": created_event.get("end"),
    }