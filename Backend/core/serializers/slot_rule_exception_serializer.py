from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied, ValidationError

from core.models import Booking, SlotRule, SlotRuleException


class SlotRuleExceptionSerializer(serializers.ModelSerializer):
    slot_rule_id = serializers.PrimaryKeyRelatedField(
        source="slot_rule",
        queryset=SlotRule.objects.all(),
        write_only=True,
    )

    class Meta:
        model = SlotRuleException
        fields = ["id", "slot_rule_id", "start_time"]
        read_only_fields = ["id"]

    def validate(self, data):
        user = self.context["request"].user
        rule = data["slot_rule"]
        start_time = data["start_time"]

        if rule.volunteer_id != user.id:
            raise PermissionDenied("You do not own this slot rule.")

        valid_times = set(rule.occurrence_start_times())
        if start_time not in valid_times:
            raise ValidationError(
                {"start_time": "This start_time is not part of the slot rule."}
            )

        if Booking.objects.filter(
            volunteer=rule.volunteer,
            start_time=start_time,
        ).exists():
            raise ValidationError({"start_time": "Cannot delete a booked slot."})

        return data
