import pytest
from datetime import timedelta
from dataclasses import dataclass
from unittest.mock import patch

from django.utils import timezone
from django.urls import reverse

from rest_framework.test import APIClient

from core.models import SlotRule, User, Booking
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

def make_user(username, group=None):
    user = User.objects.create(
        username=username,
        email=f"{username}@example.com",
        group=group,
    )
    user.set_unusable_password()
    user.save()
    return user

@pytest.mark.django_db
def test_one_off_slot():
    rule = make_slot_rule(group="itd")
    slots = build_available_slots([rule], NOW)
    assert len(slots) == 1
    assert slots[0].volunteer_id == rule.volunteer_id
    assert slots[0].slot_rule_id == rule.id
    assert slots[0].group == "itd"

@pytest.mark.django_db
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

@pytest.mark.django_db
def test_recurring_rule_expands_to_multiple_slots():
    start_time = timezone.now() + timedelta(weeks=1)
    repeat_until = (timezone.now() + timedelta(weeks=3)).date()
    rule = make_slot_rule(start_time=start_time, repeat_until=repeat_until)
    slots = build_available_slots([rule], NOW)
    assert len(slots) == 3

@pytest.mark.django_db
def test_recurring_rule_past_occurrences_excluded():
    start_time = NOW - timedelta(weeks=2)
    repeat_until = (NOW + timedelta(weeks=4)).date()
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
    trainee = make_user("trainee",group="itd")
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
def test_user_only_sees_slots_for_their_group():
    trainee = make_user("trainee", group="itd")
    volunteer = make_user("volunteer")

    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="piscine",)

    response = auth_client(trainee).get(URL)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == volunteer.id

@pytest.mark.django_db
def test_user_sees_slots_for_their_group_and_all():
    trainee = make_user("trainee_itd", group="itd")

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

@pytest.mark.django_db
def test_slots_filtered_by_custom_future_limit():
    start_time = NOW + timedelta(days=1)  
    repeat_until = (NOW + timedelta(days=21)).date()

    rule = make_slot_rule(start_time=start_time,repeat_until=repeat_until,group="itd",)

    # moving booking window 2 weeks forward 
    custom_limit = NOW + timedelta(weeks=2)

    slots = build_available_slots([rule], custom_limit)

    #  returned slots must be >= limit
    for slot in slots:
        assert slot.start_time >= custom_limit

    # It should have fewer than total occurrences
    assert len(slots) < len(rule.occurrence_start_times())

@pytest.mark.django_db
def test_slots_include_past_when_limit_is_in_past():
    start_time = NOW - timedelta(weeks=2)
    repeat_until = (NOW + timedelta(weeks=2)).date()

    rule = make_slot_rule(
        start_time=start_time,
        repeat_until=repeat_until,
        group="itd",
    )

    custom_limit = NOW - timedelta(weeks=3)
    slots = build_available_slots([rule], custom_limit)

    # past occurrences should be included
    occurrence_times = rule.occurrence_start_times()
    assert len(slots) == len(occurrence_times)

@pytest.mark.django_db
def test_filter_by_host_role_trainee():
    trainee = make_user("trainee", group="itd")

    volunteer_host = make_user("volunteer_host")
    volunteer_host.role = "volunteer"
    volunteer_host.save()

    trainee_host = make_user("trainee_host")
    trainee_host.role = "trainee"
    trainee_host.save()

    SlotRule.objects.create(volunteer=volunteer_host,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=trainee_host,start_time=FUTURE,group="itd",)

    response = auth_client(trainee).get(URL, {"role": "trainee"})

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == trainee_host.id

@pytest.mark.django_db
def test_filter_by_host_role_admin():
    trainee = make_user("trainee", group="itd")
 
    admin_host = make_user("admin_host")
    admin_host.role = "admin"
    admin_host.save()

    volunteer_host = make_user("volunteer_host")
    volunteer_host.role = "volunteer"
    volunteer_host.save()

    SlotRule.objects.create(volunteer=admin_host,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=volunteer_host,start_time=FUTURE,group="itd",)

    response = auth_client(trainee).get(URL, {"role": "admin"})

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == admin_host.id

@pytest.mark.django_db
def test_taken_slot_is_not_returned_in_available_slots():
    trainee = make_user("trainee", group="itd")

    volunteer = make_user("volunteer")

    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="itd",)
    Booking.objects.create(trainee=trainee,volunteer=volunteer,start_time=FUTURE,google_meet_link="https://meet.test/1",)

    response = auth_client(trainee).get(URL)

    assert response.status_code == 200
    assert len(response.data) == 0
    
@pytest.mark.django_db
def test_booked_slot_is_excluded_but_other_free_slot_is_returned():
    trainee = make_user("trainee", group="itd")

    volunteer = make_user("volunteer")

    first_start = FUTURE
    second_start = FUTURE + timedelta(weeks=1)

    SlotRule.objects.create(volunteer=volunteer,start_time=first_start,repeat_until=second_start.date(),group="itd",)
    Booking.objects.create(trainee=trainee,volunteer=volunteer,start_time=first_start,google_meet_link="https://meet.example.com/1",)

    response = auth_client(trainee).get(URL)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == volunteer.id
    assert response.data[0]["start_time"] == second_start

@pytest.mark.django_db
def test_booking_only_blocks_matching_volunteer_and_start_time():
    trainee = make_user("trainee", group="itd")

    volunteer_duncan = make_user("duncan")
    volunteer_fred = make_user("fred")

    SlotRule.objects.create(
        volunteer=volunteer_duncan,
        start_time=FUTURE,
        group="itd",
    )
    SlotRule.objects.create(volunteer=volunteer_fred,start_time=FUTURE,group="itd",)
    Booking.objects.create(trainee=trainee,volunteer=volunteer_duncan,start_time=FUTURE,google_meet_link="https://meet.example.com/1",)

    response = auth_client(trainee).get(URL)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == volunteer_fred.id

@patch("core.services.available_slots.Booking.objects.filter")
def test_build_available_slots_returns_slot_when_not_booked(mock_filter):
    mock_filter.return_value.values_list.return_value = []

    rule = make_slot_rule()

    slots = build_available_slots([rule], NOW)

    assert len(slots) == 1
    assert slots[0].slot_rule_id == rule.id
    assert slots[0].volunteer_id == rule.volunteer_id
    assert slots[0].group == rule.group


@patch("core.services.available_slots.Booking.objects.filter")
def test_build_available_slots_excludes_booked_slot(mock_filter):
    rule = make_slot_rule()

    mock_filter.return_value.values_list.return_value = [
        (rule.volunteer_id, rule.start_time),
    ]

    slots = build_available_slots([rule], NOW)

    assert slots == []


@patch("core.services.available_slots.Booking.objects.filter")
def test_build_available_slots_excludes_only_exact_booked_pair(mock_filter):
    rule_1 = make_slot_rule(volunteer_id=1, rule_id=1, start_time=FUTURE)
    rule_2 = make_slot_rule(volunteer_id=2, rule_id=2, start_time=FUTURE)

    mock_filter.return_value.values_list.return_value = [
        (rule_1.volunteer_id, rule_1.start_time),
    ]

    slots = build_available_slots([rule_1, rule_2], NOW)

    assert len(slots) == 1
    assert slots[0].slot_rule_id == rule_2.id
    assert slots[0].volunteer_id == rule_2.volunteer_id


@patch("core.services.available_slots.Booking.objects.filter")
def test_build_available_slots_keeps_other_occurrences_for_same_volunteer(mock_filter):
    start_time = FUTURE
    second_occurrence = FUTURE + timedelta(weeks=1)

    rule = make_slot_rule(
        volunteer_id=1,
        rule_id=1,
        start_time=start_time,
        repeat_until=second_occurrence.date(),
    )

    mock_filter.return_value.values_list.return_value = [
        (1, start_time),
    ]

    slots = build_available_slots([rule], NOW)

    assert len(slots) == 1
    assert slots[0].volunteer_id == 1
    assert slots[0].start_time == second_occurrence


@patch("core.services.available_slots.Booking.objects.filter")
def test_build_available_slots_does_not_query_bookings_when_no_candidate_slots(mock_filter):
    rule = make_slot_rule(start_time=NOW - timedelta(weeks=1))

    slots = build_available_slots([rule], NOW)

    assert slots == []
    mock_filter.assert_not_called()
