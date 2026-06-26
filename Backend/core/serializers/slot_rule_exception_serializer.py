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
        fields = ["id", "slot_rule_id", "date"]
        read_only_fields = ["id"]

    def validate(self, data):
        user = self.context["request"].user
        rule = data["slot_rule"]
        date = data["date"]

        if rule.volunteer_id != user.id:
            raise PermissionDenied("You do not own this slot rule.")

        valid_dates = {dt.date() for dt in rule.occurrence_start_times()}
        if date not in valid_dates:
            raise ValidationError({"date": "This date is not part of the slot rule."})

        if Booking.objects.filter(
            volunteer=rule.volunteer,
            start_time__date=date,
        ).exists():
            raise ValidationError({"date": "Cannot delete a booked slot."})

        return data
