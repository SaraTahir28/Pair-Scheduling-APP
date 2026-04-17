import pytest
from django.urls import reverse

from core.models import User


@pytest.mark.django_db
class TestUserDetailView:
    def test_retrieve_existing_user(self, client):
        auth_user = User.objects.create_user(
            username="emiliano",
            email="emiliano@example.com",
            password="securepass123",
            role="trainee",
            status="active",
        )
        client.login(username="emiliano", password="securepass123")

        sara = User.objects.create(username="sara", email="sara@example.com")

        url = reverse("user-detail", args=[sara.id])
        response = client.get(url)
        assert response.status_code == 200
        assert response.json()["email"] == "sara@example.com"

    def test_retrieve_nonexistent_user_returns_404(self, client):
        auth_user = User.objects.create_user(
            username="emiliano",
            email="emiliano@example.com",
            password="securepass123",
            role="trainee",
            status="active",
        )
        client.login(username="emiliano", password="securepass123")

        url = reverse("user-detail", args=[9999])
        response = client.get(url)
        assert response.status_code == 404

    def test_patch_updates_user(self, client):
        auth_user = User.objects.create_user(
            username="emiliano",
            email="emiliano@example.com",
            password="securepass123",
            role="trainee",
            status="active",
        )
        client.login(username="emiliano", password="securepass123")

        kaska = User.objects.create(username="kaska", email="kaska@example.com")

        url = reverse("user-detail", args=[kaska.id])
        response = client.patch(
            url, {"username": "kaska-updated"}, content_type="application/json"
        )
        assert response.status_code == 200
        kaska.refresh_from_db()
        assert kaska.username == "kaska-updated"

    def test_invalid_patch_returns_400(self, client):
        auth_user = User.objects.create_user(
            username="emiliano",
            email="emiliano@example.com",
            password="securepass123",
            role="trainee",
            status="active",
        )
        client.login(username="emiliano", password="securepass123")

        sara = User.objects.create(username="sara", email="sara@example.com")

        url = reverse("user-detail", args=[sara.id])
        response = client.patch(
            url, {"role": "invalid-role"}, content_type="application/json"
        )
        assert response.status_code == 400
