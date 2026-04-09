from datetime import timedelta, datetime
from dataclasses import dataclass
from typing import Optional
from core.models import Booking

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
    if not slots:
        return []

    # filter out already booked slots. Get bookings from DB and passing them to build_available_slots
    booked_pairs = set(
        Booking.objects.filter(
            volunteer_id__in= [slot.volunteer_id for slot in slots],
            start_time__in= [slot.start_time for slot in slots],
        ).values_list("volunteer_id", "start_time")
    )
    return [slot for slot in slots
        if (slot.volunteer_id, slot.start_time) not in booked_pairs
    ]
