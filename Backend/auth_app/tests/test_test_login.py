import pytest
from django.test import override_settings
from rest_framework.test import APIClient

from core.models import User


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestTestLoginEndpoint:
    def test_creates_user_and_logs_in(self, api_client, settings):
        settings.DEBUG = True
        response = api_client.post(
            "/auth/test-login/",
            {"email": "volunteer@example.com", "name": "V One"},
            format="json",
        )
        assert response.status_code == 200
        assert User.objects.filter(email="volunteer@example.com").exists()

        # session is established: subsequent /auth/user/ returns 200
        who = api_client.get("/auth/user/")
        assert who.status_code == 200
        assert who.data["email"] == "volunteer@example.com"

    def test_reuses_existing_user(self, api_client, settings):
        settings.DEBUG = True
        User.objects.create_user(
            username="v", email="v@example.com", password="pw", first_name="Existing"
        )
        response = api_client.post(
            "/auth/test-login/", {"email": "v@example.com"}, format="json"
        )
        assert response.status_code == 200
        assert User.objects.filter(email="v@example.com").count() == 1

    def test_requires_email(self, api_client, settings):
        settings.DEBUG = True
        response = api_client.post("/auth/test-login/", {}, format="json")
        assert response.status_code == 400

    @override_settings(DEBUG=False)
    def test_returns_404_when_debug_false(self, api_client):
        response = api_client.post(
            "/auth/test-login/", {"email": "v@example.com"}, format="json"
        )
        assert response.status_code == 404
