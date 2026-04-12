from rest_framework import serializers

class AvailableSlotSerializer(serializers.Serializer):
    slot_rule_id = serializers.IntegerField()
    start_time = serializers.DateTimeField()
    volunteer_id = serializers.IntegerField()
    name = serializers.CharField()
    img = serializers.CharField()