from datetime import timedelta
from django.utils import timezone
from core.policies.min_booking_window import MinimumBookingWindowPolicy
from freezegun import freeze_time

def test_slot_inside_minimum_window():
    now = timezone.now()
    slot_start = now + timedelta(hours=2)

    assert MinimumBookingWindowPolicy.is_outside_window(slot_start) is False


# Freezing time ensures timezone.now() inside the test and policy
# return the same value. Without freezing, microsecond drift would cause
# this boundary test to fail unpredictably.
@freeze_time("2026-03-30 22:57:58")
def test_slot_exactly_at_minimum_window():
    now = timezone.now()
    slot_start = now + MinimumBookingWindowPolicy.MINIMUM_BOOKING_WINDOW

    assert MinimumBookingWindowPolicy.is_outside_window(slot_start) is True


def test_slot_outside_minimum_window():
    now = timezone.now()
    slot_start = now + MinimumBookingWindowPolicy.MINIMUM_BOOKING_WINDOW + timedelta(minutes=1)

    assert MinimumBookingWindowPolicy.is_outside_window(slot_start) is True
