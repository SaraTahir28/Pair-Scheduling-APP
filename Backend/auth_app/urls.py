from django.urls import path

from .views.csrf import CsrfTokenView
from .views.loginlogout import LogoutView, UserView
from .views.test_login import TestLoginView

urlpatterns = [
    path("user/", UserView.as_view(), name="user"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("csrf/", CsrfTokenView.as_view(), name="csrf-token"),
    path("test-login/", TestLoginView.as_view(), name="test-login"),
]
