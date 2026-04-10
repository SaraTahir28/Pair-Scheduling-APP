import pytest


@pytest.mark.django_db
def test_current_user_profile_get_authenticated(client, django_user_model):
    user = django_user_model.objects.create_user(
        username="sara",
        email="sara@example.com",
        password="securepass123",
        role="trainee",
        status="active",
    )
    client.login(username="sara", password="securepass123")

    response = client.get("/api/profile/")
    assert response.status_code == 200

    data = response.json()
    assert data["email"] == "sara@example.com"
    assert data["role"] == "trainee"
    assert data["status"] == "active"


@pytest.mark.django_db
def test_current_user_profile_get_unauthenticated(client):
    response = client.get("/api/profile/")
    assert response.status_code == 403


@pytest.mark.django_db
def test_current_user_profile_patch_updates_role(client, django_user_model):
    user = django_user_model.objects.create_user(
        username="emiliano",
        email="emiliano@example.com",
        password="strongpass456",
        role="trainee",
        status="active",
    )
    client.login(username="emiliano", password="strongpass456")

    response = client.patch(
        "/api/profile/", data={"role": "volunteer"}, content_type="application/json"
    )
    assert response.status_code == 200

    data = response.json()
    user.refresh_from_db()
    assert user.role == "volunteer"
    # Ensure response reflects the change
    assert data["role"] == "volunteer"


@pytest.mark.django_db
def test_current_user_profile_patch_invalid_role(client, django_user_model):
    user = django_user_model.objects.create_user(
        username="kaska",
        email="kaska@example.com",
        password="securepass678",
        role="trainee",
        status="active",
    )
    client.login(username="kaska", password="securepass678")

    response = client.patch(
        "/api/profile/",
        data={"role": "hacker"},  # invalid role
        content_type="application/json",
    )
    assert response.status_code == 400

    data = response.json()
    assert "role" in data

    assert data["role"][0] == '"hacker" is not a valid choice.'
