from django.urls import path #Django’s function for defining URL routes
from .views import mock_booking
#mapping a URL path to our view
urlpatterns = [
    path("book/", mock_booking, name="mock_booking"),
]
