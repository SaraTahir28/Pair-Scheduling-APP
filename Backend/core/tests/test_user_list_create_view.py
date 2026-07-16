import pytest
from django.urls import reverse

from core.models import User


@pytest.mark.django_db
class TestUserListCreateView:
    def test_list_users_returns_list(self, client):
        # Authenticate first
        auth_user = User.objects.create_user(
            username="emiliano",
            email="emiliano@example.com",
            password="securepass123",
            role="trainee",
            status="active",
            is_staff=True,
        )
        client.login(username="emiliano", password="securepass123")

        user1 = User.objects.create(username="a", email="a@example.com")
        user2 = User.objects.create(username="b", email="b@example.com")

        url = reverse("user-list")
        response = client.get(url)

        assert response.status_code == 200
        data = response.json()

        assert len(data) == 3

        returned_ids = [u["id"] for u in data]
        assert user1.id in returned_ids
        assert user2.id in returned_ids
