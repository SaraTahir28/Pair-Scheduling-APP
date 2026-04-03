import pytest
from datetime import timedelta
from dataclasses import dataclass
from unittest.mock import MagicMock

from django.utils import timezone

from rest_framework.test import APIClient

NOW = timezone.now()
FUTURE = timezone.now() + timedelta(days=1)

def make_slot_rule(start_time=None, rule_id=1):
    rule = MagicMock()
    rule.id = rule_id
    rule.start_time = start_time or FUTURE
    return rule

def test_one_off_slot():
    rule = make_slot_rule()
    slots = build_available_slots([rule])
    assert len(slots) == 1
    assert slots[0].volunteer_id == rule.volunteer_id
    assert slots[0].slot_rule_id == rule.id

def test_multiple_one_off_slots():
    rule_1 = make_slot_rule(rule_id=1)
    rule_2 = make_slot_rule(rule_id=2)
    slots = build_available_slots([rule_1, rule_2])
    assert len(slots) == 2
    assert slots[0].slot_rule_id == rule_1.id
    assert slots[1].slot_rule_id == rule_2.id

def test_past_one_off_slot_excluded():
    rule = make_slot_rule
    rule.start_time = NOW - timedelta(weeks=1)
    slots = build_available_slots([rule])
    assert slots == []

def build_available_slots(rules):
    slots = []
    for rule in rules:
        if (rule.start_time <= NOW):
            continue
        slots.append(
            AvailableSlot(
                slot_rule_id=rule.id,
                volunteer_id=rule.volunteer_id
            )
        )
    return slots

@dataclass
class AvailableSlot:
    slot_rule_id: int
    volunteer_id: int
