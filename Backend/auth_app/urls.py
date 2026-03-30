from django.urls import path
from .views import  user_view,logout_view

urlpatterns = [
    path("user/", user_view),
    path("logout/", logout_view),  # CSRF-exempt logout
   
]
