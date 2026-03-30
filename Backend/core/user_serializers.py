from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    We use Serializers to bridge the gap between our database and the frontend

    Responsibilities:
    - Convert User model instances into JSON (for API responses)
    - Convert JSON into User model (for incoming requests)
    - Validate incoming data before saving to the database
    """

    class Meta:

        model = User

        # Fields that will be exposed in the API (GET / PATCH responses)
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "status",
            "last_login",
            "date_joined",
            "is_active",
            "is_staff",
            "is_superuser",
        ]

        # Fields that cannot be modified via API (read-only)
        read_only_fields = [
            "id",
            "last_login",
            "date_joined",
            "is_staff",
            "is_superuser",
        ]

    def validate_role(self, value):
        """
        Validate that the role value is one of the allowed options,
        It runs automatically when serializer.is_valid() is called
        """
        allowed_roles = {"volunteer", "trainee", "admin"}
        if value not in allowed_roles:
            raise serializers.ValidationError("Invalid role.")
        return value

    def validate_status(self, value):
        """
        Validate that the status value is one of the allowed options.
        """
        allowed_statuses = {"active", "disable", "banned"}
        if value not in allowed_statuses:
            raise serializers.ValidationError("Invalid status.")
        return value

    def validate_email(self, value):
        """
        Ensure email is unique across users
        """
        qs = User.objects.filter(email=value)

        # If updating an existing user, exclude itself from the check
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError("A user with this email already exists.")

        return value

    def create(self, validated_data):
        """
        create method (only for testing)
        Since authentication is handled via Google, we do NOT handle passwords here

        This method is used when
        POST /api/users/  (for testing because users will be created via Google auth)
        """
        user = User(**validated_data)

        # Prevent password-based login
        user.set_unusable_password()

        # Save user to database
        user.save()

        return user