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
