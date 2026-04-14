## Pair Scheduling App

A full-stack scheduling application that enables CodeYourFuture trainees to book one-hour mentoring sessions with volunteers. The system simplifies availability management and scheduling, culminating in automatic Google Calendar event creation for both participants.

## Key Features

- Role-Based Dashboards: Separate interfaces for Trainees and Volunteers
- Volunteer Availability Management: Volunteers can define one-off or recurring weekly time slots
- Trainee Booking Flow: Trainees browse available slots, filter by study group, select a time,and book
- Google OAuth2 Authentication: Secure login via Google accounts, managed by django-allauth
- Google Calendar Integration: Creates events with Meet links and sends invites to both parties
- Minimum Booking Window: Enforces a 24-hour notice period to prevent last-minute scheduling

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Django, Django REST Framework
- Authentication: Google OAuth2 via django-allauth
- API Integration: Google Calendar API
- Database: SQLite (development)
- Testing: Cypress (frontend), Pytest (backend)
- CI/CD: GitHub Actions

## Architecture Overview

The application is a monorepo with distinct frontend and backend apps communicating via a REST API.

- Frontend (React): Handles UI, user interactions, and API calls
- Backend (Django): Manages business logic, authentication, database operations, and Google Calendar integration

## Authentication Flow

1. User clicks "Continue with Google" on the frontend
2. Frontend redirects to backend endpoint `/accounts/google/login/`
3. django-allauth handles OAuth2 with Google
4. On success, Django creates a user session
5. User is redirected back to frontend, now authenticated
6. Subsequent API requests include the session cookie for identification

## Environment URLs

- Frontend (Development): http://127.0.0.1:5173
- Backend (Development): http://127.0.0.1:8000
- Frontend (Production): https://pairscheduler-frontend.hosting.codeyourfuture.io
- Backend (Production): https://pairscheduler-backend.hosting.codeyourfuture.io

## Installation & Setup

#### Backend

1. `cd Backend`
2. `python -m venv venv`
3. `source venv/bin/activate`
4. `pip install -r requirements.txt`
5. `cp .env.example`

Fill `.env` with:

    Code
    GOOGLE_CLIENT_ID=<Your-Google-Client-ID>
    GOOGLE_CLIENT_SECRET=<Your-Google-Client-Secret>
    DJANGO_SECRET_KEY=<Your-Django-Secret-Key>

Run migrations and start server by running these commands.

1.`python manage.py migrate` 2.`python manage.py runserver`
3.Backend runs at: http://127.0.0.1:8000

### Frontend

1.`cd Frontend` 2.`npm install` 3.`npm run dev`
Frontend runs at: http://127.0.0.1:5173

## API Endpoints

## API Endpoints

| Method | Endpoint                | Description                                     |
| ------ | ----------------------- | ----------------------------------------------- |
| GET    | `/auth/user/`           | Get profile of the logged‑in user               |
| POST   | `/auth/logout/`         | Log out current user                            |
| GET    | `/api/users/`           | Retrieve all users                              |
| POST   | `/api/users/`           | Create a new user                               |
| GET    | `/api/users/:id/`       | Retrieve details for a specific user            |
| PATCH  | `/api/users/:id/`       | Update a specific user                          |
| DELETE | `/api/users/:id/`       | Delete a specific user (if implemented)         |
| GET    | `/api/available-slots/` | Get all available booking slots (trainee)       |
| POST   | `/api/slot-rules/`      | Create a new availability rule (volunteer)      |
| POST   | `/api/create-meeting/`  | Book a session & create a Google‑Calendar event |
| GET    | `/api/profile/`         | Get the current logged‑in user’s profile        |

### Running Tests

### On Backend

1.`cd Backend` 2.`pytest`

### Frontend

1.`cd Frontend` 2.`npm run cypress:open` -> For E2E tests. 3.`npm run cypress:open -- --component` -> for component tests.
