import json
import logging
import uuid

from django.conf import settings
from google.oauth2 import service_account
from googleapiclient.discovery import build

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

This service is intentionally isolated from Django views so that:
- business logic remains testable,
- Google API interactions stay encapsulated,
- and the view layer only handles request/response concerns.
"""


# Full calendar scope is required to create events with attendees
# and attach Google Meet conference data.
SCOPES = ["https://www.googleapis.com/auth/calendar"]


def _get_service_account_credentials():
    # Use env var JSON if available (Coolify/prod), otherwise read from file (dev)
    if settings.GOOGLE_SERVICE_ACCOUNT_INFO:
        json_data = settings.GOOGLE_SERVICE_ACCOUNT_INFO
    else:
        with open(settings.GOOGLE_SERVICE_ACCOUNT_FILE) as f:
            json_data = json.load(f)

    # Create a Credentials object from the service account info
    # This represents the service account itself (robot account)
    credentials = service_account.Credentials.from_service_account_info(
        json_data,
        scopes=SCOPES,  # Full Calendar scope needed for events + Meet links
    )

    # Use Domain-Wide Delegation to impersonate a real user
    # The user email is set in settings
    delegated_credentials = credentials.with_subject(
        settings.GOOGLE_IMPERSONATED_USER_EMAIL
    )

    # Return the delegated credentials, which will be used by the Google Calendar API
    return delegated_credentials


"""
    Function get_calendar_service return a Google Calendar API client.

    This client  stored in a variable named `service` in create_google_meeting acts as our
    connection to Google Calendar. It provides the methods we use to create,
    update, delete, and list events through calls like:
        service.events().insert(...)
        service.events().update(...)
        service.events().delete(...)
    In short, this function centralizes the setup of the Calendar client so it
    can be reused across different Google Calendar operations.

 """


def get_calendar_service(credentials):
    return build("calendar", "v3", credentials=credentials)


logger = logging.getLogger(__name__)


def create_google_meeting(
    start_time, end_time, trainee_email, volunteer_email, agenda=""
):
    credentials = _get_service_account_credentials()
    service = get_calendar_service(credentials)

    """
    log entry before event creation
    extra is a dictionary that attaches structured metadata(data about data) to log entries making it cleaner, useful
    easier to debug, search and prodcution ready.
    we use logging in backend instead of print because print only works in terminal
    logging works with Djnagos logging system, log files, error tracking systems etc and it also
    leps us to categorise messages
    """

    logger.info(
        "Creating Google Calendar event",
        extra={
            "start_time": start_time,
            "end_time": end_time,
            "trainee_email": trainee_email,
            "volunteer_email": volunteer_email,
        },
    )
    # DRF turns incoming timestamps into Python datetime objects.
    # Google Calendar only accepts RFC3339 strings, so we convert before sending.
    description = "1:1 session between trainee and volunteer"
    if agenda:
        description += f"\n\nAgenda:\n{agenda}"
    event = {
        "summary": "Pair Scheduling Session",
        "description": description,
        "start": {
            "dateTime": start_time.isoformat().replace("+00:00", "Z"),
            "timeZone": "UTC",
        },
        "end": {
            "dateTime": end_time.isoformat().replace("+00:00", "Z"),
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
                "conferenceSolution": {  # conference data is processed correctly now. The issue was that they key was a nested object.
                    "key": {"type": "hangoutsMeet"}
                },
            }
        },
    }

    created_event = (
        service.events()
        .insert(
            calendarId=settings.GOOGLE_CALENDAR_ID,
            body=event,
            conferenceDataVersion=1,
            sendUpdates="all",  # changing it to none from all to test
        )
        .execute()
    )
    # log entry after event creation
    logger.info(
        "Google calender event created",
        extra={
            "event_id": created_event.get("id"),
            "meet_link": created_event.get("hangoutLink"),
        },
    )

    return {
        "event_id": created_event.get("id"),
        "meet_link": created_event.get("hangoutLink"),
        "start": str(created_event["start"].get("dateTime")),
        "end": str(created_event["end"].get("dateTime")),
    }
