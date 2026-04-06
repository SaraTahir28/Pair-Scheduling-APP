import pytest
from datetime import timedelta
from dataclasses import dataclass
from unittest.mock import MagicMock

from django.utils import timezone
from django.urls import reverse

from rest_framework.test import APIClient

from core.models import SlotRule, User
from core.services.available_slots import build_available_slots, AvailableSlot

NOW = timezone.now()
FUTURE = timezone.now() + timedelta(days=1)

def make_slot_rule(volunteer_id=1, start_time=None, repeat_until=None, rule_id=1, group="itd"):
    rule = SlotRule()
    rule.id = rule_id
    rule.start_time = start_time or FUTURE
    rule.repeat_until = repeat_until
    rule.volunteer_id=volunteer_id
    rule.group = group
    return rule

def make_user(username):
    user = User.objects.create(
        username=username,
        email=f"{username}@example.com",
    )
    user.set_unusable_password()
    user.save()
    return user

def test_one_off_slot():
    rule = make_slot_rule(group="itd")
    slots = build_available_slots([rule], NOW)
    assert len(slots) == 1
    assert slots[0].volunteer_id == rule.volunteer_id
    assert slots[0].slot_rule_id == rule.id
    assert slots[0].group == "itd"

def test_multiple_one_off_slots():
    rule_1 = make_slot_rule(rule_id=1)
    rule_2 = make_slot_rule(rule_id=2)
    slots = build_available_slots([rule_1, rule_2], NOW)
    assert len(slots) == 2
    assert slots[0].slot_rule_id == rule_1.id
    assert slots[1].slot_rule_id == rule_2.id

def test_past_one_off_slot_excluded():
    rule = make_slot_rule(start_time = NOW - timedelta(weeks=1))
    slots = build_available_slots([rule], NOW)
    assert slots == []

def test_recurring_rule_expands_to_multiple_slots():
    start_time = timezone.now() + timedelta(weeks=1)
    repeat_until = timezone.now() + timedelta(weeks=3)
    rule = make_slot_rule(start_time=start_time, repeat_until=repeat_until)
    slots = build_available_slots([rule], NOW)
    assert len(slots) == 3

def test_recurring_rule_past_occurrences_excluded():
    start_time = (NOW - timedelta(weeks=2))
    repeat_until = (NOW + timedelta(weeks=4))
    rule = make_slot_rule(start_time=start_time, repeat_until=repeat_until)
    slots = build_available_slots([rule], NOW)
    for slot in slots:
        assert slot.start_time >= NOW

URL = reverse("available-slots")

def auth_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client

@pytest.mark.django_db
def test_auth_required():
    response = APIClient().get(URL)
    assert response.status_code == 403

@pytest.mark.django_db
def test_slots_returned():
    trainee = make_user("trainee")
    trainee.group = "itd"
    volunteer = make_user("volunteer")

    SlotRule.objects.create(volunteer=volunteer, start_time=FUTURE, group="itd")

    response = auth_client(trainee).get(URL)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == volunteer.id
    assert response.data[0]["group"] == "itd"

@pytest.mark.django_db
def test_filter_by_volunteer():
    trainee = make_user("trainee")
    volunteer_duncan = make_user("duncan")
    volunteer_fred = make_user("fred")
    SlotRule.objects.create(volunteer=volunteer_duncan, start_time=FUTURE, group="all")
    SlotRule.objects.create(volunteer=volunteer_fred, start_time=FUTURE, group="all")

    response = auth_client(trainee).get(URL, {"volunteer_id": volunteer_duncan.id})

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == volunteer_duncan.id

@pytest.mark.django_db
def test_filter_by_request_user_group():
    trainee = make_user("trainee")
    trainee.group = "itd"
    trainee.save()

    volunteer = make_user("volunteer")

    SlotRule.objects.create(volunteer=volunteer, start_time=FUTURE, group="itd")
    SlotRule.objects.create(volunteer=volunteer, start_time=FUTURE, group="piscine")

    response = auth_client(trainee).get(URL)

    assert response.status_code == 200
    assert len(response.data) == 1

@pytest.mark.django_db
def test_user_only_sees_slots_for_their_group():
    trainee = make_user("trainee")
    trainee.group = "itd"
    trainee.save()

    volunteer = make_user("volunteer")

    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="piscine",)

    response = auth_client(trainee).get(URL)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == volunteer.id

@pytest.mark.django_db
def test_user_sees_slots_for_their_group_and_all():
    trainee = make_user("trainee_itd")
    trainee.group = "itd"

    volunteer = make_user("volunteer")

    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="all",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="piscine",)

    response = auth_client(trainee).get(URL)

    assert response.status_code == 200
    assert len(response.data) == 2

@pytest.mark.django_db
def test_users_with_different_groups_see_different_slots():
    trainee_itd = make_user("trainee_itd")
    trainee_itd.group = "itd"
    trainee_itd.save()

    trainee_piscine = make_user("trainee_piscine")
    trainee_piscine.group = "piscine"
    trainee_piscine.save()

    volunteer = make_user("volunteer")

    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="piscine",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="all",)

    response_itd = auth_client(trainee_itd).get(URL)
    response_piscine = auth_client(trainee_piscine).get(URL)

    assert response_itd.status_code == 200
    assert len(response_itd.data) == 3

    assert response_piscine.status_code == 200
    assert len(response_piscine.data) == 2

def test_slots_filtered_by_custom_future_limit():
    start_time = NOW + timedelta(days=1)  
    repeat_until = NOW + timedelta(days=21)

    rule = make_slot_rule(start_time=start_time,repeat_until=repeat_until,group="itd",)

    # moving booking window 2 weeks forward 
    custom_limit = NOW + timedelta(weeks=2)

    slots = build_available_slots([rule], custom_limit)

    #  returned slots must be >= limit
    for slot in slots:
        assert slot.start_time >= custom_limit

    # It should have fewer than total occurrences
    assert len(slots) < len(rule.occurrence_start_times())
    