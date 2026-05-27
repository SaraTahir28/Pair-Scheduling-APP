import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from core.models import User


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
def test_trainee_cannot_promote_to_admin(api_client):
    trainee = User.objects.create_user(
        username="sara",
        email="sara@example.com",
        password="securepass123",
        role="trainee",
        status="active",
    )

    api_client.force_authenticate(user=trainee)

    url = reverse("user-detail", args=[trainee.id])
    response = api_client.patch(url, {"role": "admin"}, format="json")

    assert response.status_code == 403
