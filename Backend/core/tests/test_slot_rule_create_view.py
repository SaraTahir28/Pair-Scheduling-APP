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
