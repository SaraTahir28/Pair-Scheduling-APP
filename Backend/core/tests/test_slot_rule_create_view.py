import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from core.models import SlotRule, User


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        username="testuser", email="test@example.com", password="password123"
    )


@pytest.mark.django_db
class TestSlotRuleCreateView:
    def get_url(self):
        return reverse("slot-rule-create")

    def test_create_slot_rule_success(self, api_client, user):
        api_client.force_authenticate(user=user)
        payload = {
            "start_time": "2026-04-12T10:00:00Z",
            "repeat_until": "2026-04-20",
            "group": "sdc",
        }
        response = api_client.post(self.get_url(), payload, format="json")
        assert response.status_code == 201
        assert response.data["volunteer"] == user.id
        assert SlotRule.objects.count() == 1

    def test_volunteer_auto_assigned(self, api_client, user):
        api_client.force_authenticate(user=user)

        # Try to override volunteer with a random id
        payload = {
            "start_time": "2026-04-12T10:00:00Z",
            "repeat_until": "2026-04-15",
            "group": "piscine",
            "volunteer": 3421,
        }

        response = api_client.post(self.get_url(), payload, format="json")
        assert response.status_code == 201
        slot_rule = SlotRule.objects.get(group="piscine")
        assert slot_rule.volunteer == user

    def test_repeat_until_before_start_time(self, api_client, user):
        api_client.force_authenticate(user=user)
        payload = {
            "start_time": "2026-04-12T10:00:00Z",
            "repeat_until": "2026-04-10",
            "group": "sdc",
        }
        response = api_client.post(self.get_url(), payload, format="json")
        assert response.status_code == 400
        assert "repeat_until" in response.data

    def test_missing_required_fields(self, api_client, user):
        api_client.force_authenticate(user=user)
        payload = {"repeat_until": "2026-04-20"}
        response = api_client.post(self.get_url(), payload, format="json")
        assert response.status_code == 400
        assert "start_time" in response.data

    def test_unauthenticated_user_cannot_create(self, api_client):
        payload = {
            "start_time": "2026-04-12T10:00:00Z",
            "repeat_until": "2026-04-20",
            "group": "the_launch",
        }
        response = api_client.post(self.get_url(), payload, format="json")
        assert response.status_code in [401, 403]
        assert SlotRule.objects.count() == 0

    def test_slot_rule_persisted_in_db(self, api_client, user):
        api_client.force_authenticate(user=user)
        payload = {
            "start_time": "2026-04-12T10:00:00Z",
            "repeat_until": "2026-04-20",
            "group": "sdc",
        }
        api_client.post(self.get_url(), payload, format="json")
        slot_rule = SlotRule.objects.get(group="sdc")
        assert slot_rule.volunteer == user
        assert slot_rule.group == "sdc"

    def test_multiple_slot_rules_for_same_user(self, api_client, user):
        api_client.force_authenticate(user=user)

        payloads = [
            {
                "start_time": "2026-08-12T10:00:00Z",
                "repeat_until": "2026-08-15",
                "group": "piscine",
            },
            {
                "start_time": "2026-08-13T10:00:00Z",
                "repeat_until": "2026-08-16",
                "group": "sdc",
            },
        ]

        for payload in payloads:
            response = api_client.post(self.get_url(), payload, format="json")
            assert response.status_code == 201

        assert SlotRule.objects.filter(volunteer=user).count() == 2

    def test_repeat_until_none(self, api_client, user):
        api_client.force_authenticate(user=user)
        payload = {
            "start_time": "2026-04-12T10:00:00Z",
            "repeat_until": None,
            "group": "itp",
        }
        response = api_client.post(self.get_url(), payload, format="json")
        assert response.status_code == 201
        slot_rule = SlotRule.objects.get(group="itp")
        assert slot_rule.repeat_until is None

    def test_cannot_create_duplicate_active_slot_rule(self, api_client, user):
        api_client.force_authenticate(user=user)

        SlotRule.objects.create(
            volunteer=user,
            start_time="2026-04-12T10:00:00Z",
            repeat_until="2026-04-20",
            group="sdc",
        )

        payload = {
            "start_time": "2026-04-12T10:00:00Z",
            "repeat_until": "2026-04-25",
            "group": "sdc",
        }

        response = api_client.post(self.get_url(), payload, format="json")

        assert response.status_code == 400
        assert "start_time" in response.data
        assert SlotRule.objects.count() == 1

    def test_can_create_slot_rule_when_previous_one_was_soft_deleted(self, api_client, user):
        api_client.force_authenticate(user=user)

        SlotRule.objects.create(
            volunteer=user,
            start_time="2026-04-12T10:00:00Z",
            repeat_until="2026-04-20",
            group="sdc",
            deleted_at="2026-04-13T12:00:00Z",
        )

        payload = {
            "start_time": "2026-04-12T10:00:00Z",
            "repeat_until": "2026-04-25",
            "group": "sdc",
        }

        response = api_client.post(self.get_url(), payload, format="json")

        assert response.status_code == 201
        assert SlotRule.objects.filter(volunteer=user).count() == 2
        assert SlotRule.objects.filter(
            volunteer=user,
            start_time="2026-04-12T10:00:00Z",
            deleted_at__isnull=True,
        ).count() == 1
        