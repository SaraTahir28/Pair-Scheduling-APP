from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

class User(AbstractUser):
 
    ROLE_CHOICES = [
        ("volunteer", "Volunteer"),
        ("trainee", "Trainee"),
        ("admin", "Admin"),
    ]

    STATUS_CHOICES = [
        ("active", "Active"),
        ("disable", "Disable"),
        ("banned", "Banned"),
    ]

    GROUP_CHOICES = [
        ("all", "ALL"),
        ("itd", "ITD"),
        ("itp", "ITP"),
        ("piscine", "Piscine"),
        ("sdc", "SDC"),
        ("the_launch", "The Launch"),
    ]

    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    group = models.CharField(max_length=20,choices=GROUP_CHOICES,null=True,blank=True,)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="trainee")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")

    def __str__(self):
        return self.email or self.username

class SlotRule(models.Model):    

    volunteer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="slot_rules",
    )

    # For regular rules:
    # - the first datetime anchor, it will by used the hour (time-of-day) 
    # For non-regular rules:
    # - the exact datetime of the one-off slot
    start_time = models.DateTimeField()

    # End date for recurring rules, null for one-off slots.
    repeat_until = models.DateField(null=True, blank=True)

    group = models.CharField(max_length=20,choices=User.GROUP_CHOICES,null=True,blank=True,
    )

    class Meta:
        ordering = ["volunteer_id", "start_time"]

    def clean(self):
        
        errors = {}

        if self.volunteer_id and self.volunteer.role != "volunteer":
            errors["volunteer"] = "Only users with role 'volunteer' can have slot rules."

        if errors:
            raise ValidationError(errors)

    def __str__(self):
        return f"{self.volunteer} | {self.start_time}"


class Booking(models.Model):
    
    trainee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bookings_as_trainee",
    )
    volunteer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bookings_as_volunteer",
    )

    start_time = models.DateTimeField()

    google_meet_link = models.CharField(max_length=100)
    agenda = models.CharField(max_length=500, null=True, blank=True)

    class Meta:
        ordering = ["start_time"]
        constraints = [
            models.UniqueConstraint(
                fields=["volunteer", "start_time"],
                name="constraint_unique_volunteer_datetime", 
            ),
            models.UniqueConstraint(
                fields=["trainee", "start_time"],
                name="constraint_unique_trainee_datetime", 
            ),
        ]

    def clean(self):

        errors = {}

        if self.trainee_id and self.trainee.role != "trainee":
            errors["trainee"] = "Selected trainee must have role 'trainee'."

        if self.volunteer_id and self.volunteer.role != "volunteer":
            errors["volunteer"] = "Selected volunteer must have role 'volunteer'."

        if self.trainee_id and self.volunteer_id and self.trainee_id == self.volunteer_id:
            errors["volunteer"] = "A user cannot book a session with themselves."

        if errors:
            raise ValidationError(errors)

    def __str__(self):
        return f"session {self.date} | {self.trainee} and {self.volunteer}"
