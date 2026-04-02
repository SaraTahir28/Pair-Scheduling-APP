import pytest
from django.urls import reverse
from core.models import User


@pytest.mark.django_db
class TestUserDetailView:

    def test_retrieve_existing_user(self, client):
        user = User.objects.create(username="sara", email="sara@example.com")

        url = reverse("user-detail", args=[user.id])
        response = client.get(url)

        assert response.status_code == 200
        assert response.json()["email"] == "sara@example.com"

    def test_retrieve_nonexistent_user_returns_404(self, client):
        url = reverse("user-detail", args=[9999])
        response = client.get(url)

        assert response.status_code == 404

    def test_patch_updates_user(self, client):
        user = User.objects.create(username="old", email="old@example.com")

        url = reverse("user-detail", args=[user.id])
        response = client.patch(
            url,
            {"username": "new"},
            content_type="application/json"
        )

        assert response.status_code == 200
        user.refresh_from_db()
        assert user.username == "new"

    def test_invalid_patch_returns_400(self, client):
        user = User.objects.create(username="sara", email="sara@example.com")

        url = reverse("user-detail", args=[user.id])
        response = client.patch(
            url,
            {"role": "invalid-role"},
            content_type="application/json"
        )

        assert response.status_code == 400
