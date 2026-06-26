from datetime import date, datetime

import pytest
from rest_framework.test import APIClient

from core.models import SlotRule, SlotRuleException, User


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
        group="all",
    )


@pytest.fixture
def trainee_user(db):
    return User.objects.create_user(
        username="emiliano",
        email="trainee@example.com",
        password="pass",
        role="trainee",
        group="all",
    )


@pytest.fixture
def another_user(db):
    return User.objects.create_user(
        username="kaska",
        email="other@example.com",
        password="pass",
        role="volunteer",
        group="all",
    )


@pytest.fixture
def slot_rule(db, volunteer_user):
    start = datetime(2026, 7, 1, 10, 0)
    return SlotRule.objects.create(
        volunteer=volunteer_user,
        start_time=start,
        repeat_until=date(2026, 7, 29),
        group="all",
    )


def test_occurrence_excludes_exception(slot_rule):
    original = slot_rule.occurrence_start_times()
    assert len(original) == 5

    SlotRuleException.objects.create(
        slot_rule=slot_rule,
        date=original[0].date(),
    )

    updated = slot_rule.occurrence_start_times()
    assert len(updated) == 4
    assert original[0] not in updated


def test_owner_can_delete_single_slot(api_client, volunteer_user, slot_rule):
    api_client.force_authenticate(volunteer_user)

    date_to_delete = slot_rule.start_time.date()

    response = api_client.post(
        "/api/slot-rule-exceptions/",
        {
            "slot_rule_id": slot_rule.id,
            "date": str(date_to_delete),
        },
    )

    assert response.status_code == 201
    assert SlotRuleException.objects.filter(
        slot_rule=slot_rule, date=date_to_delete
    ).exists()


def test_other_user_cannot_delete_slot(api_client, another_user, slot_rule):
    api_client.force_authenticate(another_user)

    response = api_client.post(
        "/api/slot-rule-exceptions/",
        {
            "slot_rule_id": slot_rule.id,
            "date": str(slot_rule.start_time.date()),
        },
    )

    assert response.status_code == 403
    assert SlotRuleException.objects.count() == 0


def test_deleted_slot_not_in_available_slots(api_client, trainee_user, slot_rule):
    api_client.force_authenticate(trainee_user)
    response = api_client.get("/api/available-slots/")
    assert any(s["slot_rule_id"] == slot_rule.id for s in response.data)

    deleted_date = slot_rule.start_time.date()

    assert deleted_date in [
        datetime.fromisoformat(s["start_time"].replace("Z", "+00:00")).date()
        for s in response.data
        if s["slot_rule_id"] == slot_rule.id
    ]

    SlotRuleException.objects.create(
        slot_rule=slot_rule,
        date=deleted_date,
    )

    response = api_client.get("/api/available-slots/")
    assert deleted_date not in [
        datetime.fromisoformat(s["start_time"].replace("Z", "+00:00")).date()
        for s in response.data
        if s["slot_rule_id"] == slot_rule.id
    ]

    assert any(s["slot_rule_id"] == slot_rule.id for s in response.data)
