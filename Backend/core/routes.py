from django.urls import path #Django’s function for defining URL routes
from .views import mock_booking
from .base_views import index
#mapping a URL path to our view
urlpatterns = [
    path("", index, name="index"),
    path("book/", mock_booking, name="mock_booking"),
]
