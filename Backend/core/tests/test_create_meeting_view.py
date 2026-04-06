import json
from unittest.mock import patch
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
import pytest


@pytest.mark.django_db
class TestCreateMeetingView:

    def test_missing_required_fields_returns_400(self, client):
        url = reverse("create_meeting")

        payload = {
            "trainee_email": "trainee@example.com",
            # volunteer_email missing
            "start_time": (timezone.now() + timedelta(hours=25)).isoformat(),
            "end_time": (timezone.now() + timedelta(hours=26)).isoformat(),
        }

        response = client.post(url, data=json.dumps(payload), content_type="application/json")

        assert response.status_code == 400

        # Serializer returns field-based errors, not {"error": "..."}
        body = response.json()
        assert "volunteer_email" in body


    def test_invalid_json_returns_400(self, client):
        url = reverse("create_meeting")

        response = client.post(url, data=b"{invalid json", content_type="application/json")

        assert response.status_code == 400
        assert response.json()["error"] == "Invalid JSON body."


    @patch("core.views.create_google_meeting")
    def test_successful_meeting_creation_returns_201(self, mock_create, client):
        url = reverse("create_meeting")

        mock_create.return_value = {
            "event_id": "abc123",
            "meet_link": "https://meet.google.com/xyz",
            "start": "2025-01-01T10:00:00Z",
            "end": "2025-01-01T11:00:00Z",
        }

        # Must be >= 24 hours ahead or serializer will reject it
        start = timezone.now() + timedelta(hours=25)
        end = start + timedelta(hours=1)

        payload = {
            "trainee_email": "trainee@example.com",
            "volunteer_email": "volunteer@example.com",
            "start_time": start.isoformat(),
            "end_time": end.isoformat(),
        }

        response = client.post(url, data=json.dumps(payload), content_type="application/json")

        assert response.status_code == 201
        data = response.json()
        assert data["message"] == "Meeting created successfully."
        assert data["event_id"] == "abc123"
        assert data["meet_link"] == "https://meet.google.com/xyz"


    @patch("core.views.create_google_meeting", side_effect=Exception("Boom"))
    def test_unexpected_error_returns_500(self, mock_create, client):
        url = reverse("create_meeting")

        # Must be >= 24 hours ahead or serializer will block before mock triggers
        start = timezone.now() + timedelta(hours=25)
        end = start + timedelta(hours=1)

        payload = {
            "trainee_email": "trainee@example.com",
            "volunteer_email": "volunteer@example.com",
            "start_time": start.isoformat(),
            "end_time": end.isoformat(),
        }

        response = client.post(url, data=json.dumps(payload), content_type="application/json")

        assert response.status_code == 500
        assert response.json()["error"] == "Boom"
