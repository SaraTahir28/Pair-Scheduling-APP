from django.urls import path

from .views import (
    AvailableSlotsView,
    CreateMeetingView,
    CurrentProfileView,
    SlotRuleDeleteView,
    SlotRuleListCreateView,
    UserDetailView,
    UserListCreateView,
)

# API routes for calendar-related actions
urlpatterns = [
    path("create-meeting/", CreateMeetingView.as_view(), name="create_meeting"),
    # API routes for Users in database Endpoints
    path("users/", UserListCreateView.as_view(), name="user-list-create"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("available-slots/", AvailableSlotsView.as_view(), name="available-slots"),
    path("profile/", CurrentProfileView.as_view(), name="current-profile"),
    path(
        "slot-rules/",
        SlotRuleListCreateView.as_view(),
        name="slot-rule-list-create",
    ),
    path("slot-rules/<int:pk>/", SlotRuleDeleteView.as_view(), name="slot-rule-delete"),
]
