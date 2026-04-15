import pytest
from django.urls import reverse
from core.models import User


@pytest.mark.django_db
class TestUserListCreateView:
    def test_list_users_returns_ordered_list(self, client):
        # Authenticate first
        auth_user = User.objects.create_user(
            username="emiliano",
            email="emiliano@example.com",
            password="securepass123",
            role="trainee",
            status="active",
        )
        client.login(username="emiliano", password="securepass123")

        user1 = User.objects.create(username="a", email="a@example.com")
        user2 = User.objects.create(username="b", email="b@example.com")

        url = reverse("user-list-create")
        response = client.get(url)

        assert response.status_code == 200
        data = response.json()

        assert len(data) == 3

        returned_ids = [u["id"] for u in data]
        assert user1.id in returned_ids
        assert user2.id in returned_ids

    def test_create_user_returns_201(self, client):

        auth_user = User.objects.create_user(
            username="emiliano",
            email="emiliano@example.com",
            password="securepass123",
            role="trainee",
            status="active",
        )
        client.login(username="emiliano", password="securepass123")

        url = reverse("user-list-create")
        payload = {
            "username": "sara",
            "email": "sara@example.com",
            "role": "trainee",
            "status": "active",
        }

        response = client.post(url, payload)
        assert response.status_code == 201
        assert User.objects.count() == 2
        assert response.json()["email"] == "sara@example.com"

    def test_invalid_user_payload_returns_400(self, client):

        auth_user = User.objects.create_user(
            username="emiliano",
            email="emiliano@example.com",
            password="securepass123",
            role="trainee",
            status="active",
        )
        client.login(username="emiliano", password="securepass123")

        url = reverse("user-list-create")
        payload = {
            "username": "",
            "email": "not-an-email",
            "role": "invalid-role",
        }

        response = client.post(url, payload)
        assert response.status_code == 400
