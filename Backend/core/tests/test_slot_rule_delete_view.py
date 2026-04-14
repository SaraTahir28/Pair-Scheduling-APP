import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from core.models import SlotRule, User, Booking


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def volunteer(db):
    return User.objects.create_user(
        username="volunteer",
        email="volunteer@example.com",
        password="password123",
    )


@pytest.fixture
def other_volunteer(db):
    return User.objects.create_user(
        username="other_volunteer",
        email="other_volunteer@example.com",
        password="password123",
    )


@pytest.mark.django_db
class TestSlotRuleDeleteView:
    def get_url(self, slot_rule_id):
        return reverse("slot-rule-delete", kwargs={"pk": slot_rule_id})

    def test_authenticated_user_can_soft_delete_own_slot_rule(self, api_client, volunteer):
        slot_rule = SlotRule.objects.create(
            volunteer=volunteer,
            start_time="2026-04-12T10:00:00Z",
            repeat_until="2026-04-20",
            group="sdc",
        )

        api_client.force_authenticate(user=volunteer)
        response = api_client.delete(self.get_url(slot_rule.id))

        assert response.status_code == 204

        slot_rule.refresh_from_db()
        assert slot_rule.deleted_at is not None

    def test_soft_deleted_slot_rule_remains_in_database(self, api_client, volunteer):
        slot_rule = SlotRule.objects.create(
            volunteer=volunteer,
            start_time="2026-04-12T10:00:00Z",
            repeat_until="2026-04-20",
            group="sdc",
        )

        api_client.force_authenticate(user=volunteer)
        response = api_client.delete(self.get_url(slot_rule.id))

        assert response.status_code == 204
        assert SlotRule.objects.filter(id=slot_rule.id).exists()

        slot_rule.refresh_from_db()
        assert slot_rule.deleted_at is not None

    def test_unauthenticated_user_cannot_delete_slot_rule(self, api_client, volunteer):
        slot_rule = SlotRule.objects.create(
            volunteer=volunteer,
            start_time="2026-04-12T10:00:00Z",
            repeat_until="2026-04-20",
            group="sdc",
        )

        response = api_client.delete(self.get_url(slot_rule.id))

        assert response.status_code in [401, 403]

        slot_rule.refresh_from_db()
        assert slot_rule.deleted_at is None

    def test_deleting_other_volunteer_slot_rule_is_forbidden(self, api_client, volunteer, other_volunteer):
        slot_rule = SlotRule.objects.create(
            volunteer=other_volunteer,
            start_time="2026-04-12T10:00:00Z",
            repeat_until="2026-04-20",
            group="sdc",
        )

        api_client.force_authenticate(user=volunteer)
        response = api_client.delete(self.get_url(slot_rule.id))

        assert response.status_code == 403

        slot_rule.refresh_from_db()
        assert slot_rule.deleted_at is None

    def test_existing_bookings_remain_intact_after_soft_delete(self, api_client, volunteer):
        slot_rule = SlotRule.objects.create(
            volunteer=volunteer,
            start_time="2026-04-12T10:00:00Z",
            repeat_until=None,
            group="sdc",
        )

        trainee = User.objects.create_user(
            username="trainee",
            email="trainee@example.com",
            password="password123",
        )

        booking = Booking.objects.create(
            trainee=trainee,
            volunteer=volunteer,
            slot_rule=slot_rule,
            start_time=slot_rule.start_time,
            google_meet_link="https://meet.google.com/test-link",
        )

        api_client.force_authenticate(user=volunteer)
        response = api_client.delete(self.get_url(slot_rule.id))

        assert response.status_code == 204

        slot_rule.refresh_from_db()
        assert slot_rule.deleted_at is not None

        assert Booking.objects.filter(id=booking.id).exists()
        booking.refresh_from_db()
        assert booking.volunteer == volunteer
        assert booking.slot_rule == slot_rule

    def test_cannot_delete_already_soft_deleted_slot_rule(self, api_client, volunteer):
        slot_rule = SlotRule.objects.create(
            volunteer=volunteer,
            start_time="2026-04-12T10:00:00Z",
            repeat_until="2026-04-20",
            group="sdc",
            deleted_at=timezone.now(),
        )

        api_client.force_authenticate(user=volunteer)
        response = api_client.delete(self.get_url(slot_rule.id))

        assert response.status_code == 404