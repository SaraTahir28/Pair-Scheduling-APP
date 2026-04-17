from dataclasses import dataclass
from datetime import datetime, timedelta


@dataclass
class AvailableSlot:
    slot_rule_id: int
    volunteer_id: int
    start_time: datetime
    end_time: datetime
    group: str | None
    name: str
    img: str | None


def build_available_slots(rules, beginning_of_booking_window):
    slots = []
    for rule in rules:
        for start_time in rule.occurrence_start_times():
            if start_time < beginning_of_booking_window:
                continue
            slots.append(
                AvailableSlot(
                    slot_rule_id=rule.id,
                    volunteer_id=rule.volunteer_id,
                    group=rule.group,
                    start_time=start_time,
                    end_time=start_time + timedelta(hours=1),
                    name=rule.volunteer.get_full_name()
                    or rule.volunteer.get_username(),
                    img="/public/placeholder.png",
                )
            )
    return slots


def exclude_booked_slots(slots, booked_pairs):
    if not booked_pairs:
        return slots
    return [
        slot
        for slot in slots
        if (slot.volunteer_id, slot.start_time) not in booked_pairs
    ]
