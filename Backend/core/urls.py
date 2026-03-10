from django.urls import path

from .views import create_meeting_view

# API routes for calendar-related actions
urlpatterns = [
    path("create-meeting/", create_meeting_view, name="create_meeting"),
]