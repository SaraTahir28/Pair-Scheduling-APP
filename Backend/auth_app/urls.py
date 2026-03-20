from django.urls import path
from .views import  user_view

urlpatterns = [
    path("user/", user_view),
   
]
