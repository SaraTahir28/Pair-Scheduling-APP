from rest_framework import serializers
from core.models import User, Booking, SlotRule
from core.policies.min_booking_window import MinimumBookingWindowPolicy
from datetime import timedelta

class BookingSerializer(serializers.Serializer):
    volunteer_id = serializers.IntegerField()
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
        volunteer_id = attrs["volunteer_id"]
        slot_rule_id = attrs["slot_rule_id"]
        time_slot = attrs["time_slot"]

        try:
            volunteer = User.objects.get(id=volunteer_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"volunteer_id": "Volunteer user not found."})

        try:
            slot_rule = SlotRule.objects.get(id=slot_rule_id)
        except SlotRule.DoesNotExist:
            raise serializers.ValidationError({"slot_rule_id": "Slot rule not found."})

        if slot_rule.volunteer_id != volunteer.id:
            raise serializers.ValidationError(
                {"slot_rule_id": "This slot rule does not belong to the selected volunteer."}
            )


        attrs["volunteer"] = volunteer
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
