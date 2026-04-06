from django.urls import path

from .views import create_meeting_view
from .views import MeView
from .views import UserListCreateView, UserDetailView, BookingCreateView

# API routes for calendar-related actions
urlpatterns = [
    path("create-meeting/", create_meeting_view, name="create_meeting"),
    # API routes for Users in database Endpoints
    path("users/", UserListCreateView.as_view(), name="user-list-create"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("me/", MeView.as_view(), name="me"),
]
