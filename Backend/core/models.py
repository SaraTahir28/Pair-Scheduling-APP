from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    google_id = models.CharField(max_length=255, unique=True)
    full_name = models.CharField(max_length=255, blank=True)

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

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="trainee")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")

    def __str__(self):
        return self.email or self.username
    

