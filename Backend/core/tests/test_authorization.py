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

    url = reverse("current-profile")
    response = api_client.patch(url, {"role": "admin"}, format="json")

    assert response.status_code == 200
    trainee.refresh_from_db()
    assert trainee.role == "trainee"


@pytest.mark.django_db
def test_volunteer_cannot_promote_themselves_to_admin(api_client):
    volunteer = User.objects.create_user(
        username="Emiliano",
        email="emiliano@example.com",
        password="securepass456",
        role="volunteer",
        status="active",
    )

    api_client.force_authenticate(user=volunteer)
    url = reverse("current-profile")
    response = api_client.patch(url, {"role": "admin"}, format="json")

    assert response.status_code == 200
    volunteer.refresh_from_db()
    assert volunteer.role == "volunteer"


@pytest.mark.django_db
def test_trainee_can_update_own_profile_without_changing_role(api_client):
    trainee = User.objects.create_user(
        username="kaska",
        email="kaska@example.com",
        password="securepass123",
        role="trainee",
        status="active",
    )

    api_client.force_authenticate(user=trainee)

    url = reverse("current-profile")
    response = api_client.patch(url, {"first_name": "Kaska"}, format="json")

    assert response.status_code == 200
    trainee.refresh_from_db()
    assert trainee.first_name == "Kaska"
