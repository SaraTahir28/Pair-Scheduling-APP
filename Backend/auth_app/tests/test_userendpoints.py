import pytest
from django.contrib.auth import get_user_model

@pytest.mark.django_db
def test_user_view_authenticated(client, django_user_model):
    user = django_user_model.objects.create_user(
        username="tester",
        email="test@example.com",
        password="password123",
        role="trainee",
        status="active"
    )

    client.login(username="tester", password="password123")

    response = client.get("/auth/user/")
    assert response.status_code == 200

    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "trainee"
    assert data["status"] == "active"
    
@pytest.mark.django_db
def test_user_view_unauthenticated(client):
    response = client.get("/auth/user/")
    assert response.status_code in (302, 401)