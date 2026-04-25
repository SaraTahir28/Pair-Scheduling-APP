import { useState, useEffect } from "react";
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
import {
  isValidDate,
  isValidTime,
  parseLocalDate,
  parseLocalDateTime,
  formatLocalDate,
  formatLocalTime,
} from "../../utilities/dateTime";

const TraineeBookingFlow = () => {
  const [allVolunteersData, setAllVolunteersData] = useState(null);
  const [activeVolunteer, setActiveVolunteer] = useState(null);

  const { selectedDate, selectedTime, status, volunteerId, slotRuleId } =
    useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isInvalidDate =
    selectedDate !== undefined && !isValidDate(selectedDate);
  const isInvalidTime =
    selectedTime !== undefined && !isValidTime(selectedTime);
  const selectedDateObj =
    selectedDate && !isInvalidDate ? parseLocalDate(selectedDate) : null;

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

  if (isInvalidDate || isInvalidTime) {
    return (
      <div className="booking-box">
        {isInvalidDate && <div role="alert">Invalid Date</div>}
        {isInvalidTime && <div role="alert">Invalid Time</div>}
      </div>
    );
  }

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
  const now = new Date();
  const onlySlots24hrsFromNow = slotsToProcess.filter((slot) => {
    const slotTime = new Date(slot.start_time);
    const timeDifferenceInHours =
      (slotTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return timeDifferenceInHours >= 24;
  });

  const sortedSlots = [...onlySlots24hrsFromNow].sort(
    (a, b) => new Date(a.start_time) - new Date(b.start_time)
  );
  for (let slot of sortedSlots) {
    const convertedToString = slot.start_time;
    const dateOnlyStr = formatLocalDate(new Date(convertedToString));

    if (
      !convertedAllVDataToFrontendFormat.availableDates.includes(dateOnlyStr)
    ) {
      convertedAllVDataToFrontendFormat.availableDates.push(dateOnlyStr);
    }

    if (selectedDate && dateOnlyStr === selectedDate) {
      const timeInFormathhmm = formatLocalTime(new Date(convertedToString));

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

  const updateUrlWithDate = (newDate) => {
    if (!newDate) {
      navigate("/trainee-booking");
      return;
    }

    navigate(`/trainee-booking/${formatLocalDate(newDate)}`);
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
    if (!volunteerId || !slotRuleId || !selectedDate || !selectedTime) {
      alert("Missing booking details");
      return;
    }

    const timeSlotForBackend = parseLocalDateTime(
      selectedDate,
      selectedTime
    ).toISOString();

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
                <>
                  <div className="session-details-div">
                    <h1>Book 1:1 session</h1>
                    <p className="session-icon-text-line">
                      Viewing availability from all volunteers
                    </p>
                  </div>
                </>
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
