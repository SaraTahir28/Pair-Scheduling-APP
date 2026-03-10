from pathlib import Path
import uuid

from django.conf import settings
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

# Full calendar scope is required to create events with attendees
# and attach Google Meet conference data.
SCOPES = ["https://www.googleapis.com/auth/calendar"]


def _get_user_credentials():
    token_path = Path(settings.GOOGLE_OAUTH_TOKEN_FILE)

    if not token_path.exists():
        raise FileNotFoundError(
            "OAuth token file not found. Run create_oauth_token.py first."
        )

    credentials = Credentials.from_authorized_user_file(str(token_path), SCOPES)

    # If token expired, refresh automatically
    if credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())

        # Persist the refreshed token so future requests keep working
        token_path.write_text(credentials.to_json())

    return credentials


def create_google_meeting(start_time, end_time, trainee_email, volunteer_email):
    credentials = _get_user_credentials()

    service = build("calendar", "v3", credentials=credentials)

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

    return {
        "event_id": created_event.get("id"),
        "meet_link": created_event.get("hangoutLink"),
    }