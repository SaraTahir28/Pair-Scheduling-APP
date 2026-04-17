from rest_framework import serializers

from core.models import SlotRule


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
            "volunteer",
        ]

    def validate_repeat_until_is_after_start_time(self, attrs):
        start_time = attrs.get("start_time")
        repeat_until = attrs.get("repeat_until")
        if repeat_until is not None and start_time is not None:
            if repeat_until < start_time.date():
                raise serializers.ValidationError(
                    {
                        "repeat_until": "repeat_until cannot be earlier than start_time date."
                    }
                )
        return attrs

    def validate(self, attrs):
        attrs = self.validate_repeat_until_is_after_start_time(attrs)
        volunteer = (
            self.instance.volunteer if self.instance else self.context["request"].user
        )
        start_time = attrs.get("start_time")

        if start_time is not None:
            query_set = SlotRule.objects.filter(
                volunteer=volunteer,
                start_time=start_time,
                deleted_at__isnull=True,
            )

            if self.instance:
                query_set = query_set.exclude(pk=self.instance.pk)

            if query_set.exists():
                raise serializers.ValidationError(
                    {
                        "start_time": "This volunteer already has a slot rule at this time."
                    }
                )

        return attrs

    def create(self, validated_data):
        slot_rule = SlotRule(**validated_data)
        slot_rule.full_clean()
        slot_rule.save()
        return slot_rule
