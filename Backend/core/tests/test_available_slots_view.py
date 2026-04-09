import pytest
from datetime import timedelta

from django.utils import timezone
from django.urls import reverse

from rest_framework.test import APIClient

from core.models import SlotRule, User

NOW = timezone.now()
FUTURE = timezone.now() + timedelta(days=1)

def make_user(username, group=None):
    user = User.objects.create(
        username=username,
        email=f"{username}@example.com",
        group=group,
    )
    user.set_unusable_password()
    user.save()
    return user

URL = reverse("available-slots")

def auth_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client

@pytest.mark.django_db
def test_auth_required():
    response = APIClient().get(URL)
    assert response.status_code == 403

@pytest.mark.django_db
def test_slots_returned():
    trainee = make_user("trainee",group="itd")
    volunteer = make_user("volunteer")

    SlotRule.objects.create(volunteer=volunteer, start_time=FUTURE, group="itd")

    response = auth_client(trainee).get(URL)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == volunteer.id
    assert response.data[0]["group"] == "itd"

@pytest.mark.django_db
def test_filter_by_volunteer():
    trainee = make_user("trainee")
    volunteer_duncan = make_user("duncan")
    volunteer_fred = make_user("fred")
    SlotRule.objects.create(volunteer=volunteer_duncan, start_time=FUTURE, group="all")
    SlotRule.objects.create(volunteer=volunteer_fred, start_time=FUTURE, group="all")

    response = auth_client(trainee).get(URL, {"volunteer_id": volunteer_duncan.id})

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == volunteer_duncan.id

@pytest.mark.django_db
def test_user_only_sees_slots_for_their_group():
    trainee = make_user("trainee", group="itd")
    volunteer = make_user("volunteer")

    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="piscine",)

    response = auth_client(trainee).get(URL)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == volunteer.id

@pytest.mark.django_db
def test_user_sees_slots_for_their_group_and_all():
    trainee = make_user("trainee_itd", group="itd")

    volunteer = make_user("volunteer")

    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="all",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="piscine",)

    response = auth_client(trainee).get(URL)

    assert response.status_code == 200
    assert len(response.data) == 2

@pytest.mark.django_db
def test_users_with_different_groups_see_different_slots():
    trainee_itd = make_user("trainee_itd", group="itd")
    trainee_piscine = make_user("trainee_piscine", group="piscine")
    volunteer = make_user("volunteer")

    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="piscine",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=volunteer,start_time=FUTURE,group="all",)

    response_itd = auth_client(trainee_itd).get(URL)
    response_piscine = auth_client(trainee_piscine).get(URL)

    assert response_itd.status_code == 200
    assert len(response_itd.data) == 3

    assert response_piscine.status_code == 200
    assert len(response_piscine.data) == 2

@pytest.mark.django_db
def test_filter_by_host_role_trainee():
    trainee = make_user("trainee", group="itd")

    volunteer_host = make_user("volunteer_host")
    volunteer_host.role = "volunteer"
    volunteer_host.save()

    trainee_host = make_user("trainee_host")
    trainee_host.role = "trainee"
    trainee_host.save()

    SlotRule.objects.create(volunteer=volunteer_host,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=trainee_host,start_time=FUTURE,group="itd",)

    response = auth_client(trainee).get(URL, {"role": "trainee"})

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == trainee_host.id

@pytest.mark.django_db
def test_filter_by_host_role_admin():
    trainee = make_user("trainee", group="itd")
 
    admin_host = make_user("admin_host")
    admin_host.role = "admin"
    admin_host.save()

    volunteer_host = make_user("volunteer_host")
    volunteer_host.role = "volunteer"
    volunteer_host.save()

    SlotRule.objects.create(volunteer=admin_host,start_time=FUTURE,group="itd",)
    SlotRule.objects.create(volunteer=volunteer_host,start_time=FUTURE,group="itd",)

    response = auth_client(trainee).get(URL, {"role": "admin"})

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["volunteer_id"] == admin_host.id
