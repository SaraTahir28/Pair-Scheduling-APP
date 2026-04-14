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

const TraineeBookingFlow = () => {
  const [allVolunteersData, setAllVolunteersData] = useState(null);
  //TODO next PR show all slots from all volunteers
  const [activeVolunteer, setActiveVolunteer] = useState(null);

  const { selectedDate, selectedTime, status } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/available-slots/")
      .then((res) => setAllVolunteersData(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (allVolunteersData === null) {
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
    const slotsToProcess = activeVolunteer
      ? allVolunteersData.filter(
          (slot) => slot.volunteer_id === activeVolunteer.id
        )
      : allVolunteersData;

    for (let slot of slotsToProcess) {
      const convertedToString = slot.start_time;
      const dateOnlyStr = new Date(convertedToString).toLocaleDateString(
        "en-CA"
      );

      if (
        !convertedAllVDataToFrontendFormat.availableDates.includes(dateOnlyStr)
      ) {
        convertedAllVDataToFrontendFormat.availableDates.push(dateOnlyStr);
      }

      if (selectedDate && convertedToString.includes(selectedDate)) {
        const timeOnlyStr = convertedToString.split("T")[1];
        const timeInFormathhmm =
          timeOnlyStr.split(":")[0] + ":" + timeOnlyStr.split(":")[1];
        convertedAllVDataToFrontendFormat.availableTimes.push(timeInFormathhmm);
      }
    }
  }

  const selectedDateObj = selectedDate ? new Date(selectedDate) : null;

  const updateUrlWithDate = (newDate) => {
    const dateString = newDate.toLocaleDateString("en-CA");
    navigate(`/trainee-booking/${dateString}`);
  };

  const updateUrlWithTime = (newTime) => {
    navigate(`/trainee-booking/${selectedDate}/${newTime}`);
  };

  const handleGoBack = () => {
    navigate(`/trainee-booking/${selectedDate}`);
  };

  const isConfirmationPage = status === "confirmation";

  const createBookingDetailsObj = (bookingFormData) => {
    const combinedDateAndTimeFromUrl = `${selectedDate}T${selectedTime}:00`;
    const timeSlotForBackend = `${combinedDateAndTimeFromUrl}Z`;

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
            {!isConfirmationPage &&
              (activeVolunteer ? (
                <SessionDetails
                  selectedDateProps={selectedDateObj}
                  activeVolunteerProps={activeVolunteer}
                />
              ) : (
                <p>Viewing availability from all volunteers</p>
              ))}
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
