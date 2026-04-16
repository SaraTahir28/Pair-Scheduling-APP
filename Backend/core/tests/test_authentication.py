import pytest


@pytest.mark.django_db
def test_user_view_requires_authentication(client, django_user_model):
    django_user_model.objects.create_user(
        username="sara",
        email="sara@example.com",
        password="securepass123",
        status="active",
    )
    response = client.get("/auth/user/")
    assert response.status_code == 403

    client.login(username="sara", password="securepass123")
    response = client.get("/auth/user/")
    assert response.status_code == 200
    assert response.json()["email"] == "sara@example.com"
