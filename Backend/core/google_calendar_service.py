
import uuid

from django.conf import settings
from google.oauth2 import service_account
from googleapiclient.discovery import build
import logging

"""
Google Calendar integration service.

This module acts as the backend integration layer between the Django application
and the Google Calendar API. It is responsible for:

1. Loading OAuth credentials from the token file
2. Refreshing expired access tokens and persisting the updated token
3. Building an authenticated Google Calendar API client
4. Constructing the event payload (summary, attendees, times, Meet config)
5. Creating a calendar event on the configured Google Calendar
6. Automatically generating a Google Meet link via conferenceData
7. Returning the created event's ID and Meet URL to the caller

This service is intentionally isolated from Django views so that:
- business logic remains testable,
- Google API interactions stay encapsulated,
- and the view layer only handles request/response concerns.
"""


# Full calendar scope is required to create events with attendees
# and attach Google Meet conference data.
SCOPES = ["https://www.googleapis.com/auth/calendar"]



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
def get_calendar_service():
   credentials = service_account.Credentials.from_service_account_file(
       settings.GOOGLE_SERVICE_ACCOUNT_FILE,
       scopes=SCOPES,
   ).with_subject(settings.GOOGLE_DELEGATED_USER)


   return build("calendar", "v3", credentials=credentials)


logger = logging.getLogger(__name__)

def create_google_meeting(start_time, end_time, trainee_email, volunteer_email):
   

    service = get_calendar_service()
    
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
        "Google calender event created",
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