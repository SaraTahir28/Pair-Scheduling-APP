import json
from unittest.mock import patch
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from core.models import SlotRule

User = get_user_model()


@pytest.fixture
def trainee_user(db):
    return User.objects.create_user(
        username="trainee", password="testpass", email="trainee@example.com"
    )


@pytest.fixture
def volunteer_user(db):
    return User.objects.create_user(
        username="volunteer", password="testpass", email="volunteer@example.com"
    )


@pytest.fixture
def auth_client(trainee_user):
    client = APIClient()
    client.force_authenticate(user=trainee_user)
    return client

@pytest.fixture
def volunteer_slot_rule(db, volunteer_user):
    return SlotRule.objects.create(
        volunteer=volunteer_user,
        start_time=timezone.now() + timedelta(hours=25),
        repeat_until=None,
        group=None,
    )

@pytest.mark.django_db
class TestCreateMeetingView:
    def test_missing_required_fields_returns_400(self, auth_client):
        url = reverse("create_meeting")

        payload = {
            "volunteer_id": 1,
            # slot_rule_id missing
            "time_slot": (timezone.now() + timedelta(hours=25)).isoformat(),
        }

        response = auth_client.post(
            url, data=json.dumps(payload), content_type="application/json"
        )

        assert response.status_code == 400
        assert "slot_rule_id" in response.json()

    def test_invalid_json_returns_400(self, auth_client):
        url = reverse("create_meeting")

        response = auth_client.post(
            url, data=b"{invalid json", content_type="application/json"
        )

        assert response.status_code == 400
        assert "detail" in response.json()

    @patch("core.views.create_google_meeting")
    def test_successful_meeting_creation_returns_201(self, mock_google_meeting, auth_client, volunteer_user, volunteer_slot_rule):
        url = reverse("create_meeting")

        mock_google_meeting.return_value = {
            "event_id": "abc123",
            "meet_link": "https://meet.google.com/xyz",
            "start": "2025-01-01T10:00:00Z",
            "end": "2025-01-01T11:00:00Z",
        }

        # Must be >= 24 hours ahead or serializer will reject it
        start = timezone.now() + timedelta(hours=25)
        end = start + timedelta(hours=1)

        payload = {
            "volunteer_id": volunteer_user.id,
            "slot_rule_id": volunteer_slot_rule.id,
            "time_slot": start.isoformat(),
            "agenda": "",
        }

        response = auth_client.post(
            url, data=json.dumps(payload), content_type="application/json"
        )

        assert response.status_code == 201
        data = response.json()
        assert data["message"] == "Meeting created successfully."
        assert data["event_id"] == "abc123"
        assert data["meet_link"] == "https://meet.google.com/xyz"

    @patch("core.views.create_google_meeting", side_effect=Exception("Boom"))
    def test_unexpected_error_returns_500(self, mock_google_meeting, auth_client, volunteer_user, volunteer_slot_rule):
        url = reverse("create_meeting")

        # Must be >= 24 hours ahead or serializer will block before mock triggers
        start = timezone.now() + timedelta(hours=25)
        end = start + timedelta(hours=1)

        payload = {
            "volunteer_id": volunteer_user.id,
            "slot_rule_id": volunteer_slot_rule.id,
            "time_slot": start.isoformat(),
            "agenda": "",
        }

        response = auth_client.post(
            url, data=json.dumps(payload), content_type="application/json"
        )

        assert response.status_code == 500
        assert response.json()["error"] == "Boom"
