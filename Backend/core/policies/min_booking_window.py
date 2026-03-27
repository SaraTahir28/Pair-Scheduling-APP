from datetime import timedelta 
from django.utils import timezone

class MinimumBookingWindowPolicy:
    MINIMUM_BOOKING_WINDOW = timedelta(hours=24) #to represent a duration of time 

#using cls itself rather than object instance as the rule (24 hours) applies globally
    
    @classmethod 
    def is_outside_window(cls, slot_start_time):
        earliest_allowed = timezone.now() + cls.MINIMUM_BOOKING_WINDOW
        return slot_start_time >= earliest_allowed  #the slot is at least 24 hours in the future

