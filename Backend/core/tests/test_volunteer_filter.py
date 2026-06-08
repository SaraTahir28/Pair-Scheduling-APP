from datetime import datetime

import pytest
from django.urls import reverse
from django.utils import timezone

from core.models import Booking, SlotRule, User


@pytest.mark.django_db
class TestVolunteerByDateTimeView:
    def setup_method(self):
        self.start = timezone.make_aware(datetime(2026, 9, 15, 10, 0))
        self.end = timezone.make_aware(datetime(2026, 9, 15, 12, 0))

    def test_admin_can_get_filtered_volunteers(self, client):
        admin = User.objects.create_user(
            username="sara",
            email="sara@example.com",
            password="pass123",
        )
        admin.role = "admin"
        admin.status = "active"
        admin.save()

        client.login(username="sara", password="pass123")

        # Volunteer with a slot inside the window
        vol = User.objects.create(
            username="vol",
            email="vol@example.com",
            role="volunteer",
            status="active",
        )

        SlotRule.objects.create(
            volunteer=vol,
            start_time=self.start,
            repeat_until=None,
            group="all",
        )

        url = reverse("volunteer-filter")
        response = client.get(
            url,
            {"start": self.start.isoformat(), "end": self.end.isoformat()},
        )

        assert response.status_code == 200
        data = response.json()

        assert len(data) == 1
        assert data[0]["email"] == "vol@example.com"

    def test_missing_start_or_end_returns_400(self, client):
        admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="pass123",
            role="admin",
        )
        client.login(username="admin", password="pass123")

        url = reverse("volunteer-filter")

        response = client.get(url, {"end": self.end.isoformat()})
        assert response.status_code == 400
        assert response.json()["error"] == "Incorrect date/time values"

        response = client.get(url, {"start": self.start.isoformat()})
        assert response.status_code == 400
        assert response.json()["error"] == "Incorrect date/time values"

    def test_invalid_datetime_format_returns_400(self, client):
        admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="pass123",
            role="admin",
        )
        client.login(username="admin", password="pass123")

        url = reverse("volunteer-filter")

        response = client.get(url, {"start": "not-a-date", "end": "not-a-time"})
        assert response.status_code == 400
        assert response.json()["error"] == "Incorrect date/time values"

    def test_start_after_end_returns_400(self, client):
        admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="pass123",
            role="admin",
        )
        client.login(username="admin", password="pass123")

        url = reverse("volunteer-filter")

        response = client.get(
            url,
            {
                "start": self.end.isoformat(),
                "end": self.start.isoformat(),
            },
        )

        assert response.status_code == 400
        assert response.json()["error"] == "Incorrect date/time values"

    def test_excludes_booked_slots(self, client):
        admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="pass123",
            role="admin",
        )
        client.login(username="admin", password="pass123")

        vol = User.objects.create(
            username="vol",
            email="vol@example.com",
            role="volunteer",
        )

        rule = SlotRule.objects.create(
            volunteer=vol,
            start_time=self.start,
            repeat_until=None,
            group="all",
        )

        # Booking exists no volunteer should appear
        Booking.objects.create(
            trainee=admin,
            volunteer=vol,
            slot_rule=rule,
            start_time=self.start,
            google_meet_link="x",
        )

        url = reverse("volunteer-filter")
        response = client.get(
            url,
            {"start": self.start.isoformat(), "end": self.end.isoformat()},
        )

        assert response.status_code == 200
        assert response.json() == []
