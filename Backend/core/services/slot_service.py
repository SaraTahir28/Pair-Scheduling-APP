from core.policies.min_booking_window import MinimumBookingWindowPolicy


def filter_slots(slots):
    """Apply the minimum booking window rule to a list of slot objects."""
    return [
        slot
        for slot in slots
        if MinimumBookingWindowPolicy.is_outside_window(slot.start_time)
    ]
