from django.urls import path
from . import views
# Connects the login URL to login_view, enabling the custom login page to load.
# forms the entry point for the Google OAuth sign-in flow
urlpatterns = [
    path("login/", views.login_view, name="login"),
]
