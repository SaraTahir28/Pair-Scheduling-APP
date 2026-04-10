from django.urls import path
from .views.loginlogout import  user_view,logout_view
from .views.csrf import csrf_token_view

urlpatterns = [
    path("user/", user_view),
    path("logout/", logout_view),  
    path("csrf/", csrf_token_view),
   
]
