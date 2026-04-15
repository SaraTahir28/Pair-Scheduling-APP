import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SessionDetails from "../groups/SessionDetails";
import Calendar from "../groups/Calendar";
import TimeSlotGroup from "../groups/TimeSlotGroup";
import BookingForm from "../groups/BookingForm";
import api from "../../api/axiosClient";
import BookingConfirmation from "../groups/BookingConfirmation";
import { BackBtn } from "../elements/Button";
import { useAuth } from "../../AuthContext";
import { isValidDate, isValidTime, parseLocalDate, parseLocalDateTime, formatLocalDate } from "../../utilities/dateTime";

const TraineeBookingFlow = () => {
  const [allVolunteersData, setAllVolunteersData] = useState(null);
  //TODO next PR show all slots from all volunteers
  const [activeVolunteer, setActiveVolunteer] = useState(null);

  const { selectedDate, selectedTime, status } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isInvalidDate = selectedDate !== undefined && !isValidDate(selectedDate);
  const isInvalidTime = selectedTime !== undefined && !isValidTime(selectedTime);
  const selectedDateObj = selectedDate && !isInvalidDate ? parseLocalDate(selectedDate) : null;

  useEffect(() => {
    api
      .get("/api/available-slots/")
      .then((res) => {
        setAllVolunteersData(res.data);
        if (res.data && res.data.length > 0) {
          setActiveVolunteer({
            id: res.data[0].volunteer_id,
            name: res.data[0].name,
            img: res.data[0].img,
          });
        }
      })
      .catch((err) => console.log(err));
  }, []);

  if (allVolunteersData === null || activeVolunteer === null) {
    return (
      <div className="booking-box">
        <h2>Loading volunteers...</h2>
      </div>
    );
  }

  if (allVolunteersData.length === 0) {
    return (
      <div className="booking-box">
        <h2>No volunteers are available at this time.</h2>
      </div>
    );
  }

  const convertedAllVDataToFrontendFormat = {
    availableDates: [],
    availableTimes: [],
  };

  if (allVolunteersData && allVolunteersData.length > 0) {
    const activeVolunteerSlots = allVolunteersData.filter((slot) => {
      return slot.volunteer_id === activeVolunteer.id;
    });

    for (let i = 0; i < activeVolunteerSlots.length; i++) {
      //starting str one is "2026-03-20T09:00:00Z"
      let slotWeAreOn = activeVolunteerSlots[i];
      let convertedToString = slotWeAreOn.start_time; //TODO/question - converting to str if not a str from backend, is that ever possible?
      let dateOnlyStr = convertedToString.split("T")[0];
      let dateBitsArr = dateOnlyStr.split("-");
      let dayString = dateBitsArr[2];
      let dayNumber = Number(dayString);

      if (
        convertedAllVDataToFrontendFormat.availableDates.includes(dayNumber) ===
        false
      ) {
        convertedAllVDataToFrontendFormat.availableDates.push(dayNumber);
      }
      if (selectedDate && convertedToString.includes(selectedDate)) {
        let timeOnlyStr = convertedToString.split("T")[1];
        let timeBitsArr = timeOnlyStr.split(":");
        let timeInFormathhmm = timeBitsArr[0] + ":" + timeBitsArr[1];
        convertedAllVDataToFrontendFormat.availableTimes.push(timeInFormathhmm);
      }
    }
  }

  const updateUrlWithDate = (newDate) => {
    navigate(`/trainee-booking/${formatLocalDate(newDate)}`);
  };

  const updateUrlWithTime = (newTime) => {
    navigate(`/trainee-booking/${selectedDate}/${newTime}`);
  };

  const handleGoBack = () => {
    navigate(`/trainee-booking/${selectedDate}`);
  };

  const isConfirmationPage = status === "confirmation";

  const createBookingDetailsObj = (bookingFormData) => {
    const timeSlotForBackend = parseLocalDateTime(selectedDate, selectedTime).toISOString();

    const bookingDetailsObj = {
      volunteer_id: activeVolunteer.id,
      slot_rule_id: 1, //TODO will be updated in the next PR
      time_slot: timeSlotForBackend,
      agenda: bookingFormData.agenda || "No agenda provided.",
    };
    api
      .post("/api/create-meeting/", bookingDetailsObj)
      .then(() => {
        navigate(
          `/trainee-booking/${selectedDate}/${selectedTime}/confirmation`
        );
      })
      .catch((error) => console.log("Error:", error));
  };

  if (isInvalidDate || isInvalidTime) {
    return (
      <div className="booking-box">
        {isInvalidDate && <div role="alert">Invalid Date</div>}
        {isInvalidTime && <div role="alert">Invalid Time</div>}
      </div>
    );
  }

  return (
    <div className="booking-box">
      {isConfirmationPage ? (
        <div className="conf-page-div">
          <BookingConfirmation
            selectedDateObj={selectedDateObj}
            selectedTime={selectedTime}
            volunteerProps={activeVolunteer}
          />
        </div>
      ) : (
        <>
          <div className="session-details-col">
            {!isConfirmationPage && (
              <SessionDetails
                selectedDateProps={selectedDateObj}
                activeVolunteerProps={activeVolunteer}
              />
            )}
          </div>

          {!selectedTime && (
            <>
              <div className="calendar-col">
                <Calendar
                  selectedDateProps={selectedDateObj}
                  setSelectedDateProps={updateUrlWithDate}
                  availableDates={
                    convertedAllVDataToFrontendFormat.availableDates
                  }
                />
              </div>
              <div className="timeslot-col">
                <TimeSlotGroup
                  selectedDateProps={selectedDateObj}
                  setSelectedTimeProps={updateUrlWithTime}
                  availableTimes={
                    convertedAllVDataToFrontendFormat.availableTimes
                  }
                />
              </div>
            </>
          )}

          {selectedTime && !isConfirmationPage && (
            <div className="timeslot-col trainee-timeslot-width">
              <div className="back-btn-div">
                <BackBtn onClick={handleGoBack} />
              </div>
              <BookingForm
                whenFormSubmit={createBookingDetailsObj}
                trainee={user}
                key={user?.email || "guest"}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TraineeBookingFlow;
