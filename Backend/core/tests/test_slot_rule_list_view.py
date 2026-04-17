import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from core.models import SlotRule, User


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def volunteer(db):
    return User.objects.create_user(
        username="volunteer", email="volunteer@example.com", password="pw"
    )


@pytest.fixture
def other_volunteer(db):
    return User.objects.create_user(
        username="other", email="other@example.com", password="pw"
    )


def url():
    return reverse("slot-rule-list-create")


@pytest.mark.django_db
class TestSlotRuleListView:
    def test_unauthenticated_user_cannot_list(self, api_client):
        response = api_client.get(url())
        assert response.status_code in [401, 403]

    def test_returns_only_own_active_slot_rules(
        self, api_client, volunteer, other_volunteer
    ):
        mine = SlotRule.objects.create(
            volunteer=volunteer,
            start_time="2026-04-12T10:00:00Z",
            repeat_until="2026-04-20",
            group="sdc",
        )
        SlotRule.objects.create(
            volunteer=other_volunteer,
            start_time="2026-04-13T10:00:00Z",
            repeat_until=None,
            group="sdc",
        )
        SlotRule.objects.create(
            volunteer=volunteer,
            start_time="2026-04-14T10:00:00Z",
            repeat_until=None,
            group="sdc",
            deleted_at=timezone.now(),
        )

        api_client.force_authenticate(user=volunteer)
        response = api_client.get(url())

        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["id"] == mine.id
        assert response.data[0]["volunteer"] == volunteer.id

    def test_empty_list_when_no_slot_rules(self, api_client, volunteer):
        api_client.force_authenticate(user=volunteer)
        response = api_client.get(url())
        assert response.status_code == 200
        assert response.data == []

    def test_ordered_by_start_time(self, api_client, volunteer):
        later = SlotRule.objects.create(
            volunteer=volunteer,
            start_time="2026-06-01T10:00:00Z",
            repeat_until=None,
            group="sdc",
        )
        earlier = SlotRule.objects.create(
            volunteer=volunteer,
            start_time="2026-05-01T10:00:00Z",
            repeat_until=None,
            group="sdc",
        )

        api_client.force_authenticate(user=volunteer)
        response = api_client.get(url())

        assert [row["id"] for row in response.data] == [earlier.id, later.id]
