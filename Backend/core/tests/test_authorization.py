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
    url = reverse("user-detail", args=[volunteer.id])
    response = api_client.patch(url, {"role": "admin"}, format="json")
    assert response.status_code == 403


@pytest.mark.django_db
def test_admin_can_promote_user_to_admin(api_client):
    admin = User.objects.create_user(
        username="sara",
        email="sara@example.com",
        password="securepass123",
        role="admin",
        status="active",
    )

    target = User.objects.create_user(
        username="kaska",
        email="kaska@example.com",
        password="securepass123",
        role="trainee",
        status="active",
    )

    # Authenticate as the admin
    api_client.force_authenticate(user=admin)

    # Admin promotes the target user to admin
    url = reverse("user-detail", args=[target.id])
    response = api_client.patch(url, {"role": "admin"}, format="json")

    assert response.status_code == 200
    assert response.data["role"] == "admin"


@pytest.mark.django_db
def test_admin_can_demote_an_admin(api_client):
    admin = User.objects.create_user(
        username="main_admin",
        email="main_admin@example.com",
        password="securepass123",
        role="admin",
        status="active",
    )

    other_admin = User.objects.create_user(
        username="other_admin",
        email="other_admin@example.com",
        password="securepass123",
        role="admin",
        status="active",
    )

    # Authenticate as the main admin
    api_client.force_authenticate(user=admin)
    # Admin demotes the other admin to volunteer
    url = reverse("user-detail", args=[other_admin.id])
    response = api_client.patch(url, {"role": "volunteer"}, format="json")

    assert response.status_code == 200
    assert response.data["role"] == "volunteer"
