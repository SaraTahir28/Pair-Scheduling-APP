import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SessionDetails from "../groups/SessionDetails";
import VolunteerSelector from "../groups/VolunteerSelector";
import Calendar from "../groups/Calendar";
import TimeSlotGroup from "../groups/TimeSlotGroup";
import BookingForm from "../groups/BookingForm";
import api from "../../api/axiosClient";
import BookingConfirmation from "../groups/BookingConfirmation";
import { BackBtn } from "../elements/Button";
import { useAuth } from "../../AuthContext";

const TraineeBookingFlow = () => {
  const [allVolunteersData, setAllVolunteersData] = useState(null);
  const [activeVolunteer, setActiveVolunteer] = useState(null);

  const { selectedDate, selectedTime, status, volunteerId, slotRuleId } =
    useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/available-slots/")
      .then((res) => setAllVolunteersData(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!allVolunteersData || !volunteerId) return;

    const matchedVolunteer = allVolunteersData.find(
      (slot) => String(slot.volunteer_id) === String(volunteerId)
    );

    if (matchedVolunteer) {
      setActiveVolunteer({
        id: matchedVolunteer.volunteer_id,
        name: matchedVolunteer.name,
        img: matchedVolunteer.img,
      });
    }
  }, [allVolunteersData, volunteerId]);

  if (allVolunteersData === null) {
    return (
      <div className="booking-box">
        <h2>Loading volunteers...</h2>
      </div>
    );
  }

  const availableVolunteers = [
    ...new Map(
      allVolunteersData.map((slot) => [
        slot.volunteer_id,
        {
          id: slot.volunteer_id,
          name: slot.name,
          img: slot.img,
        },
      ])
    ).values(),
  ];

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

  const seenTimes = new Set();

  const slotsToProcess = activeVolunteer
    ? allVolunteersData.filter(
        (slot) => String(slot.volunteer_id) === String(activeVolunteer.id)
      )
    : allVolunteersData;

  for (let slot of slotsToProcess) {
    const convertedToString = slot.start_time;
    const dateOnlyStr = new Date(convertedToString).toLocaleDateString("en-CA");

    if (
      !convertedAllVDataToFrontendFormat.availableDates.includes(dateOnlyStr)
    ) {
      convertedAllVDataToFrontendFormat.availableDates.push(dateOnlyStr);
    }

    if (selectedDate && convertedToString.includes(selectedDate)) {
      const timeOnlyStr = convertedToString.split("T")[1];
      const timeInFormathhmm =
        timeOnlyStr.split(":")[0] + ":" + timeOnlyStr.split(":")[1];

      const slotKey = `${timeInFormathhmm}-${slot.volunteer_id}-${slot.slot_rule_id}`;

      if (!seenTimes.has(slotKey)) {
        seenTimes.add(slotKey);

        convertedAllVDataToFrontendFormat.availableTimes.push({
          time: timeInFormathhmm,
          volunteerId: slot.volunteer_id,
          slotRuleId: slot.slot_rule_id,
          name: slot.name,
        });
      }
    }
  }

  const selectedDateObj = selectedDate ? new Date(selectedDate) : null;

  const updateUrlWithDate = (newDate) => {
    if (!newDate) {
      navigate("/trainee-booking");
      return;
    }

    const dateString = newDate.toLocaleDateString("en-CA");
    navigate(`/trainee-booking/${dateString}`);
  };

  const updateUrlWithTime = (time, clickedVolunteerId, clickedSlotRuleId) => {
    navigate(
      `/trainee-booking/${selectedDate}/${time}/pending/${clickedVolunteerId}/${clickedSlotRuleId}`
    );
  };

  const handleGoBack = () => {
    navigate(`/trainee-booking/${selectedDate}`);
  };

  const isConfirmationPage = status === "confirmation";

  const createBookingDetailsObj = (bookingFormData) => {
    if (!volunteerId || !slotRuleId) {
      console.error("Missing volunteerId or slotRuleId");
      return;
    }

    const combinedDateAndTimeFromUrl = `${selectedDate}T${selectedTime}:00`;
    const timeSlotForBackend = `${combinedDateAndTimeFromUrl}Z`;

    const bookingDetailsObj = {
      volunteer_id: Number(volunteerId),
      slot_rule_id: Number(slotRuleId),
      time_slot: timeSlotForBackend,
      agenda: bookingFormData.agenda || "No agenda provided.",
    };

    api
      .post("/api/create-meeting/", bookingDetailsObj)
      .then(() => {
        navigate(
          `/trainee-booking/${selectedDate}/${selectedTime}/confirmation/${volunteerId}/${slotRuleId}`
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

            {!selectedTime && (
              <VolunteerSelector
                volunteers={availableVolunteers}
                activeVolunteer={activeVolunteer}
                setActiveVolunteer={setActiveVolunteer}
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
