import pytest
from django.test import override_settings
from rest_framework.test import APIClient

from core.models import User


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestTestLoginEndpoint:
    @override_settings(ENABLE_TEST_LOGIN=True)
    def test_creates_user(self, api_client, django_user_model):
        response = api_client.post("/auth/test-login/", {"email": "sara@example.com"})
        assert response.status_code == 200
        assert django_user_model.objects.filter(email="sara@example.com").exists()

    @override_settings(ENABLE_TEST_LOGIN=True)
    def test_reuses_existing_user(self, api_client):
        User.objects.create_user(
            username="v", email="v@example.com", password="pw", first_name="Existing"
        )
        response = api_client.post("/auth/test-login/", {"email": "kaska@example.com"})
        assert response.status_code == 200
        assert User.objects.filter(email="kaska@example.com").count() == 1

    @override_settings(ENABLE_TEST_LOGIN=True)
    def test_returns_400_when_email_missing(self, api_client):
        response = api_client.post("/auth/test-login/", {})
        assert response.status_code == 400

    @override_settings(ENABLE_TEST_LOGIN=False)
    def test_returns_404_when_test_login_disabled(self, api_client):
        response = api_client.post("/auth/test-login/", {"email": "sara@example.com"})
        assert response.status_code == 404

    @override_settings(ENABLE_TEST_LOGIN=True)
    def test_returns_200_when_enabled(self, api_client):
        response = api_client.post("/auth/test-login/", {"email": "sara@example.com"})
        assert response.status_code == 200

    @override_settings(ENABLE_TEST_LOGIN=False)
    def test_disabled_endpoint_does_not_create_user(
        self, api_client, django_user_model
    ):
        api_client.post("/auth/test-login/", {"email": "evil@example.com"})
        assert not django_user_model.objects.filter(email="evil@example.com").exists()

    @override_settings(ENABLE_TEST_LOGIN=False)
    def test_disabled_endpoint_does_not_create_session(self, api_client):
        api_client.post("/auth/test-login/", {"email": "evil@example.com"})
        who = api_client.get("/auth/user/")
        assert who.status_code in (401, 403)
