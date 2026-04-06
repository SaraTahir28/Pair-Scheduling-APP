import pytest
from django.urls import reverse
from core.models import User


@pytest.mark.django_db
class TestUserListCreateView:

    def test_list_users_returns_ordered_list(self, client):
        user1 = User.objects.create(username="a", email="a@example.com")
        user2 = User.objects.create(username="b", email="b@example.com")

        url = reverse("user-list-create")
        response = client.get(url)

        assert response.status_code == 200
        data = response.json()

        assert len(data) == 2
        assert data[0]["id"] == user1.id
        assert data[1]["id"] == user2.id

    def test_create_user_returns_201(self, client):
        url = reverse("user-list-create")

        payload = {
            "username": "sara",
            "email": "sara@example.com",
            "role": "trainee",
            "status": "active",
        }

        response = client.post(url, payload)

        assert response.status_code == 201
        assert User.objects.count() == 1
        assert response.json()["email"] == "sara@example.com"

    def test_invalid_user_payload_returns_400(self, client):
        url = reverse("user-list-create")

        payload = {
            "username": "",
            "email": "not-an-email",
            "role": "invalid-role",
        }

        response = client.post(url, payload)

        assert response.status_code == 400
