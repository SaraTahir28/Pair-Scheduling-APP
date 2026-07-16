from datetime import UTC, datetime, timedelta

import pytest
from django.utils import timezone
from rest_framework.test import APIClient

from core.models import SlotRule, SlotRuleException, User

pytestmark = pytest.mark.django_db

NOW = timezone.now()
FUTURE = NOW + timedelta(days=1)


def make_slot_rule(
    volunteer,
    start_time=None,
    repeat_until=None,
    group="itd",
):
    start = start_time or FUTURE.replace(hour=10, minute=0, second=0, microsecond=0)
    until = repeat_until or (start + timedelta(weeks=4)).date()
    return SlotRule.objects.create(
        volunteer=volunteer,
        start_time=start,
        repeat_until=until,
        group=group,
    )


def parse_api_time(ts: str):
    return datetime.fromisoformat(ts.replace("Z", "+00:00")).astimezone(UTC)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def volunteer_user(db):
    return User.objects.create_user(
        username="sara",
        email="volunteer@example.com",
        password="pass",
        role="volunteer",
        group="itd",
    )


@pytest.fixture
def trainee_user(db):
    return User.objects.create_user(
        username="emiliano",
        email="trainee@example.com",
        password="pass",
        role="trainee",
        group="itd",
    )


@pytest.fixture
def another_user(db):
    return User.objects.create_user(
        username="kaska",
        email="other@example.com",
        password="pass",
        role="volunteer",
        group="itd",
    )


@pytest.fixture
def slot_rule(db, volunteer_user):
    return make_slot_rule(volunteer=volunteer_user)


def test_occurrence_excludes_exception(slot_rule):
    original = slot_rule.occurrence_start_times()
    assert len(original) == 5

    SlotRuleException.objects.create(
        slot_rule=slot_rule,
        start_time=original[0],
    )

    updated = slot_rule.occurrence_start_times()
    assert len(updated) == 4
    assert original[0] not in updated


def test_owner_can_delete_single_slot(api_client, volunteer_user, slot_rule):
    api_client.force_authenticate(volunteer_user)

    start_time_to_delete = slot_rule.start_time

    response = api_client.post(
        "/api/slot-rule-exceptions/",
        {
            "slot_rule_id": slot_rule.id,
            "start_time": start_time_to_delete.isoformat(),
        },
        format="json",
    )

    assert response.status_code == 201
    assert SlotRuleException.objects.filter(
        slot_rule=slot_rule,
        start_time=start_time_to_delete,
    ).exists()


def test_other_user_cannot_delete_slot(api_client, another_user, slot_rule):
    api_client.force_authenticate(another_user)

    response = api_client.post(
        "/api/slot-rule-exceptions/",
        {
            "slot_rule_id": slot_rule.id,
            "start_time": slot_rule.start_time.isoformat(),
        },
        format="json",
    )

    assert response.status_code == 403
    assert SlotRuleException.objects.count() == 0


def test_deleted_slot_not_in_available_slots(api_client, trainee_user, slot_rule):
    api_client.force_authenticate(trainee_user)

    response = api_client.get("/api/available-slots/")
    assert any(s["slot_rule_id"] == slot_rule.id for s in response.data)

    deleted_start_time = slot_rule.start_time

    initial_times = [
        parse_api_time(s["start_time"])
        for s in response.data
        if s["slot_rule_id"] == slot_rule.id
    ]

    assert deleted_start_time in initial_times

    SlotRuleException.objects.create(
        slot_rule=slot_rule,
        start_time=deleted_start_time,
    )

    response = api_client.get("/api/available-slots/")

    updated_times = [
        parse_api_time(s["start_time"])
        for s in response.data
        if s["slot_rule_id"] == slot_rule.id
    ]

    assert deleted_start_time not in updated_times
