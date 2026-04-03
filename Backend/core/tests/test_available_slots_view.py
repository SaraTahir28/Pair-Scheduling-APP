import pytest
from datetime import timedelta
from dataclasses import dataclass
from unittest.mock import MagicMock

from django.utils import timezone

from rest_framework.test import APIClient

from core.models import SlotRule
from core.services.available_slots import build_available_slots, AvailableSlot

NOW = timezone.now()
FUTURE = timezone.now() + timedelta(days=1)

def make_slot_rule(volunteer_id=1, start_time=None, repeat_until=None, rule_id=1):
    rule = SlotRule()
    rule.id = rule_id
    rule.start_time = start_time or FUTURE
    rule.repeat_until = repeat_until
    rule.volunteer_id=volunteer_id
    return rule

def test_one_off_slot():
    rule = make_slot_rule()
    slots = build_available_slots([rule], NOW)
    assert len(slots) == 1
    assert slots[0].volunteer_id == rule.volunteer_id
    assert slots[0].slot_rule_id == rule.id

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
