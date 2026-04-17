import pytest
from datetime import timedelta
from unittest.mock import patch
from django.utils import timezone

from core.models import SlotRule, User
from core.services.available_slots import build_available_slots, exclude_booked_slots

NOW = timezone.now()
FUTURE = timezone.now() + timedelta(days=1)


def make_slot_rule(
    volunteer_id=1,
    start_time=None,
    repeat_until=None,
    rule_id=1,
    group="itd",
    first_name="Duncan",
    last_name="Parkinson",
    username="duncan",
):
    rule = SlotRule()
    rule.id = rule_id
    rule.start_time = start_time or FUTURE
    rule.repeat_until = repeat_until
    rule.volunteer_id = volunteer_id
    rule.group = group
    rule.volunteer = User(
        id=volunteer_id,
        username=username,
        first_name=first_name,
        last_name=last_name,
    )
    return rule


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


def test_recurring_rule_expands_to_multiple_slots():
    start_time = timezone.now() + timedelta(weeks=1)
    repeat_until = (timezone.now() + timedelta(weeks=3)).date()
    rule = make_slot_rule(start_time=start_time, repeat_until=repeat_until)
    slots = build_available_slots([rule], NOW)
    assert len(slots) == 3


def test_recurring_rule_past_occurrences_excluded():
    start_time = NOW - timedelta(weeks=2)
    repeat_until = (NOW + timedelta(weeks=4)).date()
    rule = make_slot_rule(start_time=start_time, repeat_until=repeat_until)
    slots = build_available_slots([rule], NOW)
    for slot in slots:
        assert slot.start_time >= NOW


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


def test_slots_filtered_by_custom_future_limit():
    start_time = NOW + timedelta(days=1)
    repeat_until = (NOW + timedelta(days=21)).date()

    rule = make_slot_rule(
        start_time=start_time,
        repeat_until=repeat_until,
        group="itd",
    )

    # moving booking window 2 weeks forward
    custom_limit = NOW + timedelta(weeks=2)

    slots = build_available_slots([rule], custom_limit)

    #  returned slots must be >= limit
    for slot in slots:
        assert slot.start_time >= custom_limit

    # It should have fewer than total occurrences
    assert len(slots) < len(rule.occurrence_start_times())


def test_exclude_booked_slots_returns_slots_when_none_are_booked():
    rule = make_slot_rule()
    slots = build_available_slots([rule], NOW)

    filtered_slots = exclude_booked_slots(slots, booked_pairs=set())

    assert len(filtered_slots) == 1
    assert filtered_slots[0].volunteer_id == rule.volunteer_id
    assert filtered_slots[0].slot_rule_id == rule.id
    assert filtered_slots[0].group == rule.group


def test_exclude_booked_slots_excludes_booked_slot():
    rule = make_slot_rule()
    slots = build_available_slots([rule], NOW)

    booked_pairs = {
        (rule.volunteer_id, rule.start_time),
    }

    filtered_slots = exclude_booked_slots(slots, booked_pairs)

    assert filtered_slots == []


def test_exclude_booked_slots_excludes_only_exact_booked_pair():
    rule_1 = make_slot_rule(volunteer_id=1, rule_id=1, start_time=FUTURE)
    rule_2 = make_slot_rule(volunteer_id=2, rule_id=2, start_time=FUTURE)

    slots = build_available_slots([rule_1, rule_2], NOW)

    booked_pairs = {
        (rule_1.volunteer_id, rule_1.start_time),
    }

    filtered_slots = exclude_booked_slots(slots, booked_pairs)

    assert len(filtered_slots) == 1
    assert filtered_slots[0].slot_rule_id == rule_2.id
    assert filtered_slots[0].volunteer_id == rule_2.volunteer_id


def test_exclude_booked_slots_keeps_other_occurrences_for_same_volunteer():
    start_time = FUTURE
    second_occurrence = FUTURE + timedelta(weeks=1)

    rule = make_slot_rule(
        volunteer_id=1,
        rule_id=1,
        start_time=start_time,
        repeat_until=second_occurrence.date(),
    )

    slots = build_available_slots([rule], NOW)

    booked_pairs = {
        (1, start_time),
    }

    filtered_slots = exclude_booked_slots(slots, booked_pairs)

    assert len(filtered_slots) == 1
    assert filtered_slots[0].volunteer_id == 1
    assert filtered_slots[0].start_time == second_occurrence
