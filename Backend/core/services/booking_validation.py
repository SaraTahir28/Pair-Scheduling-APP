from datetime import timedelta


def slot_rule_covers_time(slot_rule, time_slot) -> bool:
    if slot_rule.repeat_until is None:
        return time_slot == slot_rule.start_time

    return (
        time_slot.time() == slot_rule.start_time.time()
        and time_slot.date() >= slot_rule.start_time.date()
        and time_slot.date() <= slot_rule.repeat_until
        and time_slot.weekday() == slot_rule.start_time.weekday()
    )
