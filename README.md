# Project Overview

## CYF Volunteer–Trainee Booking System

A simple scheduling platform that allows trainees to book 1‑hour sessions with volunteers.  
This is an early MVP designed for CodeYourFuture’s Launch project.

---

# Project Summary

We are building a centralised booking system where:

- **Volunteers** can offer one‑off or recurring 1‑hour time slots  
- **Trainees** can browse available slots and book one  
- Once booked, the slot is removed from availability  
- A **Google Calendar invite** (with a Google Meet link) is automatically sent to both trainee and volunteer  
- A **minimum booking notice** prevents last‑minute bookings  

This MVP focuses on simplicity, accessibility, and ease of maintenance for CodeYourFuture volunteers.

---

# Tech Stack

## Frontend
- HTML  
- CSS  
- Vue.js (lightweight components + reactivity)  
- Fetch API for communication with the backend  

## Backend
- Django (Python)  
- Django views + URL routing  
- JSON API endpoints  
- Integration with Google Calendar API (for event creation + Meet links)

## Google Calendar Integration

The backend integrates with the Google Calendar API to automatically create meeting events when a session is booked.

When a meeting is created, the system:

- Creates a Google Calendar event
- Generates a Google Meet link
- Sends calendar invitations to both the trainee and volunteer

This feature is implemented in the Django backend.

### Architecture Flow

Client Request
↓
POST /api/create-meeting/
↓
Django View (views.py)
↓
Google Calendar Service (google_calendar_service.py)
↓
Google Calendar API
↓
Calendar Event Created
↓
Google Meet Link Generated
↓
Invitations Sent to Trainee and Volunteer
↓
Response Returned to Client

### Example API Request

curl -X POST http://127.0.0.1:8000/api/create-meeting/ \
-H "Content-Type: application/json" \
-d '{
  "trainee_email": "trainee@example.com",
  "volunteer_email": "volunteer@example.com",
  "start_time": "2026-03-10T14:00:00Z",
  "end_time": "2026-03-10T15:00:00Z"
}'

### Example Response
{
  "message": "Meeting created successfully.",
  "event_id": "...",
  "meet_link": "https://meet.google.com/..."
}

The meeting link can then be used by both participants to join the session.
