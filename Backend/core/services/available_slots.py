from datetime import timedelta
from dataclasses import dataclass

@dataclass
class AvailableSlot:
    slot_rule_id: int
    volunteer_id: int

def build_available_slots(rules, beginning_of_booking_window):
    slots = []
    for rule in rules:
        for start_time in rule.occurrence_start_times():
            if (start_time <= beginning_of_booking_window):
                continue
            slots.append(
                AvailableSlot(
                    slot_rule_id=rule.id,
                    volunteer_id=rule.volunteer_id
                )
            )
    return slots

