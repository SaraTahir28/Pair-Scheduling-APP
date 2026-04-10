from django.urls import path

from .views import CurrentProfileView
from .views import CreateMeetingView
from .views import AvailableSlotsView
from .views import UserListCreateView, UserDetailView, SlotRuleCreateView

# API routes for calendar-related actions
urlpatterns = [
    path("create-meeting/", CreateMeetingView.as_view(), name="create_meeting"),
    # API routes for Users in database Endpoints
    path("users/", UserListCreateView.as_view(), name="user-list-create"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("available-slots/", AvailableSlotsView.as_view(), name="available-slots"),
    path("profile/", CurrentProfileView.as_view(), name="current-profile"),
    path("slot-rules/", SlotRuleCreateView.as_view(), name="slot-rule-create"),
]
