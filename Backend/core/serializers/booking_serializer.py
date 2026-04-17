from rest_framework import serializers
from core.models import Booking, SlotRule
from core.policies.min_booking_window import MinimumBookingWindowPolicy
from datetime import timedelta
from core.services.booking_validation import slot_rule_covers_time


class BookingSerializer(serializers.Serializer):
    slot_rule_id = serializers.IntegerField()
    time_slot = serializers.DateTimeField()
    agenda = serializers.CharField(max_length=500, required=False, allow_blank=True)

    def validate_time_slot(self, value):
        if not MinimumBookingWindowPolicy.is_outside_window(value):
            raise serializers.ValidationError(
                "Bookings must be made at least 24 hours in advance."
            )
        return value

    def validate(self, attrs):
        slot_rule_id = attrs["slot_rule_id"]
        time_slot = attrs["time_slot"]

        try:
            slot_rule = SlotRule.objects.get(id=slot_rule_id)
        except SlotRule.DoesNotExist:
            raise serializers.ValidationError({"slot_rule_id": "Slot rule not found."})

        if not slot_rule_covers_time(slot_rule, time_slot):
            raise serializers.ValidationError(
                {"time_slot": "This time is not available for the selected slot rule."}
            )

        attrs["volunteer"] = slot_rule.volunteer
        attrs["slot_rule"] = slot_rule
        attrs["start_time"] = time_slot
        return attrs

    def create(self, validated_data):
        trainee = validated_data["trainee"]
        volunteer = validated_data["volunteer"]
        slot_rule = validated_data["slot_rule"]
        start_time = validated_data["start_time"]
        google_meet_link = validated_data.get("google_meet_link", "")
        agenda = validated_data.get("agenda", "")

        booking = Booking(
            trainee=trainee,
            volunteer=volunteer,
            slot_rule=slot_rule,
            start_time=start_time,
            google_meet_link=google_meet_link,
            agenda=agenda,
        )

        booking.full_clean()
        booking.save()
        return booking

    def to_representation(self, instance):
        return {
            "id": instance.id,
            "volunteer_id": instance.volunteer.id,
            "time_slot": instance.start_time,
            "end_time": instance.start_time + timedelta(hours=1),
            "google_meet_link": instance.google_meet_link,
            "agenda": instance.agenda,
        }
