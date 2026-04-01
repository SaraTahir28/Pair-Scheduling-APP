from rest_framework import serializers
from core.models import User, Booking
from core.policies.min_booking_window import MinimumBookingWindowPolicy

class BookingSerializer(serializers.Serializer):
    trainee_email = serializers.EmailField()
    volunteer_email = serializers.EmailField()
    start_time = serializers.DateTimeField()
    google_meet_link = serializers.CharField(max_length=128, required=False, allow_blank=True)
    agenda = serializers.CharField(max_length=500, required=False, allow_blank=True)

    def validate_start_time(self, value):
        if not MinimumBookingWindowPolicy.is_outside_window(value):
            raise serializers.ValidationError(
                "Bookings must be made at least 24 hours in advance."
            )
        return value

    def validate(self, attrs):
        trainee_email = attrs["trainee_email"]
        volunteer_email = attrs["volunteer_email"]

        if trainee_email == volunteer_email:
            raise serializers.ValidationError(
                "Trainee and volunteer cannot be the same user."
            )

        try:
            trainee = User.objects.get(email=trainee_email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"trainee_email": "Trainee user not found."})

        try:
            volunteer = User.objects.get(email=volunteer_email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"volunteer_email": "Volunteer user not found."})

        if trainee.role != "trainee":
            raise serializers.ValidationError({"trainee_email": "Selected user is not a trainee."})

        if volunteer.role != "volunteer":
            raise serializers.ValidationError({"volunteer_email": "Selected user is not a volunteer."})

        attrs["trainee"] = trainee
        attrs["volunteer"] = volunteer
        return attrs
