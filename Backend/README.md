
# Project Setup

Follow these steps to run the backend locally.

## 1. Navigate to the backend folder

```
cd Backend
```

## 2. Create a virtual environment

```
python -m venv venv
```

## 3. Activate the virtual environment

```
source venv/bin/activate
```

## 4. Install dependencies

```
pip install django
```

---

# Project Structure

```
backend/
│
├── booking_system/      # Django project (settings, URLs, configuration)
├── core/                # Django app (views, models, business logic)
├── manage.py
└── venv/                # Virtual environment
```

---

# Run the Development Server

Start the Django development server:

```
python manage.py runserver
```

You should see:

```
Starting development server at http://127.0.0.1:8000/
```

---

# Access the Application

Open the following URL in your browser:

```
http://127.0.0.1:8000/
```

If everything is set up correctly, Django’s default welcome page will appear.

---

# Google Calendar Credentials

The Google Calendar integration uses a dedicated cyf service account

The required  credentials have already been generated for this project.

---

## Install Required Dependencies 

Make sure the following packages are installed:
pip install google-api-python-client google-auth 

---

### Security Note

The following folder contain sensitive credentials and must **not** be committed to the repository:
 secrets


Make sure the folder are included in `.gitignore`.
---

## Testing the Meeting Creation Endpoint

Once the backend server is running, you can test the Google Calendar integration by sending a POST request to the API endpoint.
```
POST /api/create-meeting/
```
### Example API Request 

curl -X POST http://127.0.0.1:8000/api/create-meeting/ \
-H "Content-Type: application/json" \
-d '{
  "trainee_email": "daniel@codeyourfuture.io",
  "volunteer_email": "automated@codeyourfuture.io",
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


When the request succeeds, the system will:

1. Create a Google Calendar event
2. Generate a Google Meet link
3. Send calendar invitations to the trainee and volunteer

---

## Notes for Developers

- All time values must use **ISO 8601 format**
- Times should be provided in **UTC**
- Meeting duration is expected to be **1 hour**

Example time format:
2026-03-10T14:00:00Z
