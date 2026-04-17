from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone

from core.models import SlotRule
from core.services.booking_validation import slot_rule_covers_time

User = get_user_model()


@pytest.fixture
def volunteer_user(db):
    return User.objects.create_user(
        username="volunteer",
        password="testpass",
        email="volunteer@example.com",
    )


@pytest.mark.django_db
class TestSlotRuleCoversTime:
    def test_one_off_rule_accepts_exact_matching_time(self, volunteer_user):
        start = timezone.now() + timedelta(hours=25)

        slot_rule = SlotRule.objects.create(
            volunteer=volunteer_user,
            start_time=start,
            repeat_until=None,
            group=None,
        )

        assert slot_rule_covers_time(slot_rule, start) is True

    def test_one_off_rule_rejects_different_time(self, volunteer_user):
        start = timezone.now() + timedelta(hours=25)

        slot_rule = SlotRule.objects.create(
            volunteer=volunteer_user,
            start_time=start,
            repeat_until=None,
            group=None,
        )

        invalid_time = start + timedelta(hours=1)

        assert slot_rule_covers_time(slot_rule, invalid_time) is False

    def test_recurring_rule_accepts_same_time_within_date_range(self, volunteer_user):
        start = timezone.now() + timedelta(days=2)
        repeat_until = start.date() + timedelta(days=14)

        slot_rule = SlotRule.objects.create(
            volunteer=volunteer_user,
            start_time=start,
            repeat_until=repeat_until,
            group=None,
        )

        valid_time = start + timedelta(days=7)

        assert slot_rule_covers_time(slot_rule, valid_time) is True

    def test_recurring_rule_rejects_different_time_of_day(self, volunteer_user):
        start = timezone.now() + timedelta(days=2)
        repeat_until = start.date() + timedelta(days=14)

        slot_rule = SlotRule.objects.create(
            volunteer=volunteer_user,
            start_time=start,
            repeat_until=repeat_until,
            group=None,
        )

        invalid_time = (start + timedelta(days=7)).replace(hour=(start.hour + 1) % 24)

        assert slot_rule_covers_time(slot_rule, invalid_time) is False

    def test_recurring_rule_rejects_time_after_repeat_until(self, volunteer_user):
        start = timezone.now() + timedelta(days=2)
        repeat_until = start.date() + timedelta(days=7)

        slot_rule = SlotRule.objects.create(
            volunteer=volunteer_user,
            start_time=start,
            repeat_until=repeat_until,
            group=None,
        )

        invalid_time = start + timedelta(days=10)

        assert slot_rule_covers_time(slot_rule, invalid_time) is False
