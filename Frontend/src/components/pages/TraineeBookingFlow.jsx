import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SessionDetails from "../groups/SessionDetails";
import Calendar from "../groups/Calendar";
import TimeSlotGroup from "../groups/TimeSlotGroup";
import BookingForm from "../groups/BookingForm";
import { volunteersDetails } from "../../data/UserData";
import api from "../../api/axiosClient";
import BookingConfirmation from "../groups/BookingConfirmation";
import { BackBtn } from "../elements/Button";

const TraineeBookingFlow = () => {
	//App holds state and sends as props to children as props, children change state and rerender is triggered

	const { selectedDate, selectedTime, status } = useParams();
	const navigate = useNavigate();

	//we have selectedDate - a stering from url and need obj for Calendar in next step
	const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
	// instead of changing local state changing url replace setSelectedDate and setSelectedTime
import { useAuth } from "../../AuthContext";

const TraineeBookingFlow = () => {
	const { selectedDate, selectedTime, status } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

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
	//here we select state of activeVolunteer that will be passed to session details volunteers div
	//for now Duncan is an active volunteer
	const [activeVolunteer, setActiveVolunteer] = useState(
		volunteersDetails.find((volunteer) => volunteer.id === 1)
	);

	const createBookingDetailsObj = (bookingFormData) => {
		const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
		const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

		const bookingDetailsObj = {
			trainee_name: bookingFormData.traineeName,
			trainee_email: bookingFormData.traineeEmail,
			start_time: startDateTime.toISOString(),
			end_time: endDateTime.toISOString(),
			volunteer_name: activeVolunteer.name,
			volunteer_email: activeVolunteer.email,
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

					{/* when user selects date and time we render booking form and hide the cal */}
					{/* {selectedTime && !isBookingConfirmed && ( */}
					{selectedTime && !isConfirmationPage && (
						<div className="timeslot-col trainee-timeslot-width">
							<div style={{ marginBottom: "16px" }}>
								<BackBtn onClick={handleGoBack} />
							</div>
							<BookingForm whenFormSubmit={createBookingDetailsObj} />
					{selectedTime && !isConfirmationPage && (
						<div className="timeslot-col trainee-timeslot-width">
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
