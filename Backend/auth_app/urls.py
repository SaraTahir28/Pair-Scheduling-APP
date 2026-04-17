from django.urls import path

from .views.csrf import CsrfTokenView
from .views.loginlogout import LogoutView, UserView

urlpatterns = [
    path("user/", UserView.as_view(), name="user"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("csrf/", CsrfTokenView.as_view(), name="csrf-token"),
]
