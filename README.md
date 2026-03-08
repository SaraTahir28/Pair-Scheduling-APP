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
