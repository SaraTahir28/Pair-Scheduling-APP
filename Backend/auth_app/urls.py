from django.urls import path
from .views.loginlogout import UserView, LogoutView
from .views.csrf import CsrfTokenView

urlpatterns = [
    path("user/", UserView.as_view(), name="user"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("csrf/", CsrfTokenView.as_view(), name="csrf-token"),
]
