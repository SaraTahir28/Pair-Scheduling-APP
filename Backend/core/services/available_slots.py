from datetime import timedelta, datetime
from dataclasses import dataclass
from typing import Optional

@dataclass
class AvailableSlot:
    slot_rule_id: int
    volunteer_id: int
    start_time: datetime
    end_time: datetime
    group: Optional[str]

def build_available_slots(rules, beginning_of_booking_window):
    slots = []
    for rule in rules:
        for start_time in rule.occurrence_start_times():
            if (start_time < beginning_of_booking_window):
                continue
            slots.append(
                AvailableSlot(
                    slot_rule_id=rule.id,
                    volunteer_id=rule.volunteer_id,
                    group=rule.group,
                    start_time=start_time,
                    end_time=start_time + timedelta(hours=1),
                )
            )
    return slots

