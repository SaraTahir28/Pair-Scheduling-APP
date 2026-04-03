import pytest
from dataclasses import dataclass
from unittest.mock import MagicMock

from rest_framework.test import APIClient

def test_one_off_slot():
    rule = MagicMock()
    slots = build_available_slots([rule])
    assert len(slots) == 1
    assert slots[0].volunteer_id == rule.volunteer_id
    assert slots[0].slot_rule_id == rule.id

def test_multiple_one_off_slots():
    rule_1 = MagicMock()
    rule_2 = MagicMock()
    slots = build_available_slots([rule_1, rule_2])
    assert len(slots) == 2
    assert slots[0].slot_rule_id == rule_1.id
    assert slots[1].slot_rule_id == rule_2.id

def build_available_slots(rules):
    slots = []
    for rule in rules:
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
