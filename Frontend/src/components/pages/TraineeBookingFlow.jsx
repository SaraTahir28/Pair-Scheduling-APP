import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SessionDetails from "../groups/SessionDetails";
import Calendar from "../groups/Calendar";
import TimeSlotGroup from "../groups/TimeSlotGroup";
import BookingForm from "../groups/BookingForm";
import { volunteersDetails } from "../../data/UserData";
import api from "../../api/axiosClient";
import BookingConfirmation from "../groups/BookingConfirmation";
import useSWR from "swr";

const TraineeBookingFlow = () => {
	const { selectedDate, selectedTime, status } = useParams();
	const navigate = useNavigate();

	const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
	const updateUrlWithDate = (newDate) => {
		const dateString = newDate.toLocaleDateString("en-CA");
		navigate(`/trainee-booking/${dateString}`);
	};

	const updateUrlWithTime = (newTime) => {
		navigate(`/trainee-booking/${selectedDate}/${newTime}`);
	};

	const isConfirmationPage = status === "confirmation";
	const [activeVolunteer, setActiveVolunteer] = useState(
		volunteersDetails.find((volunteer) => volunteer.id === 1)
	);
	const dataObjSWR = useSWR("/api/me/", (url) =>
		fetch(url).then((res) => res.json())
	);
	const activeTrainee = dataObjSWR.data;

	const createBookingDetailsObj = (bookingFormData) => {
		const bookingDetailsObj = {
			trainee_name: bookingFormData.traineeName,
			trainee_email: bookingFormData.traineeEmail,
			start_time: `${selectedDate}T${selectedTime}:00Z`,
			//below is hardcoded as in fe it only exists as 1 hour meeting and no end_time exists
			end_time: `${selectedDate}T23:59:00Z`,
			volunteer_name: activeVolunteer.name,
			volunteer_email: activeVolunteer.email,
		};
		fetch("/api/create-meeting/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(bookingDetailsObj),
		})
			.then((response) => {
				if (response.ok) {
					setIsBookingConfirmed(true);
				}
			})
			.catch((error) => console.log("Error:", error));
	};

	return (
		<div className="booking-box">
			<div className="session-details-col">
				{!isBookingConfirmed && (
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
							availableDates={activeVolunteer.availableDates}
						/>
					</div>
					<div className="timeslot-col">
						<TimeSlotGroup
							selectedDateProps={selectedDateObj}
							setSelectedTimeProps={updateUrlWithTime}
							availableTimes={activeVolunteer.availableTimes}
						/>
					</div>
				</>
			)}

			{selectedTime && !isBookingConfirmed && (
				<div className="timeslot-col trainee-timeslot-width">
					<BookingForm
						whenFormSubmit={createBookingDetailsObj}
						trainee={activeTrainee}
					/>
				</div>
			)}

			{isBookingConfirmed && (
				<div className="timeslot-col">
					<div>
						<h2>Your session is booked</h2>
						<p>
							Your meeting is on {selectedDateObj.toLocaleDateString()} at
							{selectedTime}.
						</p>
						<p>//link to google meet will be here//</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default TraineeBookingFlow;
