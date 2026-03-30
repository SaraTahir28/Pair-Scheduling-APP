from rest_framework import serializers
from core.policies.min_booking_window import MinimumBookingWindowPolicy

class BookingSerializer(serializers.Serializer):
    trainee_email = serializers.EmailField()
    volunteer_email = serializers.EmailField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()

    def validate_start_time(self, value):
        if not MinimumBookingWindowPolicy.is_outside_window(value):
            raise serializers.ValidationError(
                "Bookings must be made at least 24 hours in advance."
            )
        return value
