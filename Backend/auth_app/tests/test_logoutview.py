import pytest


@pytest.mark.django_db
def test_logout_view_authenticated(client, django_user_model):
    # Create and log in a user (Sara)
    sara = django_user_model.objects.create_user(
        username="sara",
        email="sara@example.com",
        password="securepass123",
        status="active",
    )
    client.login(username="sara", password="securepass123")

    # Call logout endpoint
    response = client.post("/auth/logout/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Logged out"

    # After logout, Sara should not be authenticated anymore
    response = client.get("/auth/user/")
    assert response.status_code == 403


@pytest.mark.django_db
def test_logout_view_method_not_allowed(client, django_user_model):
    # Create and log in a user
    user = django_user_model.objects.create_user(
        username="tester",
        email="tester@example.com",
        password="securepass999",
        status="active",
    )
    client.login(username="tester", password="securepass999")

    response = client.get("/auth/logout/")
    assert response.status_code == 405
    data = response.json()
    assert data["error"] == "Method not allowed"


@pytest.mark.django_db
def test_logout_clears_session(client, django_user_model):

    kaska = django_user_model.objects.create_user(
        username="kaska",
        email="kaska@example.com",
        password="securepass678",
        status="active",
    )
    client.login(username="kaska", password="securepass678")

    # Confirm session contains auth user id before logout
    assert "_auth_user_id" in client.session
    response = client.post("/auth/logout/")
    assert response.status_code == 200
    assert response.json()["message"] == "Logged out"
    assert "_auth_user_id" not in client.session
