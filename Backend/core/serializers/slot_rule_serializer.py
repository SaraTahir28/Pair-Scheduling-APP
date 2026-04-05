from rest_framework import serializers
from core.models import SlotRule, User


class SlotRuleSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = SlotRule
        fields = [
            "id",
            "volunteer",
            "start_time",
            "repeat_until",
            "group",
        ]
        read_only_fields = [
            "id",
            "volunteer"
        ]

    def validate_date(self, attrs):
        
        start_time = attrs.get("start_time")
        repeat_until = attrs.get("repeat_until")

        if repeat_until is not None and start_time is not None:
            if repeat_until < start_time.date():
                raise serializers.ValidationError(
                    {"repeat_until": "repeat_until cannot be earlier than start_time date."}
                )

        return attrs

    def create(self, validated_data):

        slot_rule = SlotRule(**validated_data)
        slot_rule.full_clean()
        slot_rule.save()
        return slot_rule