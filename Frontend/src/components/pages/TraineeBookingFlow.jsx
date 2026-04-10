import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SessionDetails from "../groups/SessionDetails";
import Calendar from "../groups/Calendar";
import TimeSlotGroup from "../groups/TimeSlotGroup";
import BookingForm from "../groups/BookingForm";
import { volunteersDetails } from "../../data/UserData";
import api from "../../api/axiosClient";
import BookingConfirmation from "../groups/BookingConfirmation";
import { useAuth } from "../../AuthContext";

const TraineeBookingFlow = () => {
	const { user } = useAuth();
	const { selectedDate, selectedTime, status } = useParams();
	const navigate = useNavigate();

	//we have selectedDate - a stering from url and need obj for Calendar in next step
	const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
	// instead of changing local state changing url replace setSelectedDate and setSelectedTime
	const updateUrlWithDate = (newDate) => {
		const dateString = newDate.toLocaleDateString("en-CA");
		navigate(`/trainee-booking/${dateString}`);
	};

	const updateUrlWithTime = (newTime) => {
		navigate(`/trainee-booking/${selectedDate}/${newTime}`);
	};

	const isConfirmationPage = status === "confirmation";
	//here we select state of activeVolunteer that will be passed to session details volunteers div
	//for now Duncan is an active volunteer
	const [activeVolunteer, setActiveVolunteer] = useState(
		volunteersDetails.find((volunteer) => volunteer.id === 1)
	);

	// here we set up booking obj that will be sent to backend
	const createBookingDetailsObj = (bookingFormData) => {
		const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
		const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

		const bookingDetailsObj = {
			trainee_name: bookingFormData.traineeName,
			trainee_email: bookingFormData.traineeEmail,
			start_time: startDateTime.toISOString(),
			end_time: endDateTime.toISOString(),
			volunteer_name: activeVolunteer.name,
			volunteer_email: "duncan_volunteer@test.com",
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
					{/* this is the full width view of confirmation view */}
					<BookingConfirmation
						selectedDateObj={selectedDateObj}
						selectedTime={selectedTime}
						volunteerProps={activeVolunteer}
					/>
				</div>
			) : (
				<>
					<div className="session-details-col">
						{/* this is standard view with split cols 
						cond to show left panel only if no confirmation yet */}
						{/* {!isBookingConfirmed && ( changed */}

						{!isConfirmationPage && (
							<SessionDetails
								// here left is prop passed to component rihght data sent from app
								// selectedDateProps={selectedDate} now the date obj instead of str
								selectedDateProps={selectedDateObj}
								// again label for data sent = data sent
								activeVolunteerProps={activeVolunteer}
							/>
						)}
					</div>

					{/* here we conditionally render groups/sections of the screen so no clutter in UI 
				first if not time selected we show calendar and timeslots*/}
					{!selectedTime && (
						// <>  this empty tag is added here because as it is not possible to generate 2 divs and our sections
						// come in 2 separate divs so the invisible div is to not mess with the styling
						<>
							<div className="calendar-col">
								{/* here we send as props to component and component changes state then react rerenders when stae is changed */}
								<Calendar
									//here prop name = assigned to state from const [selectedDate, setSelectedDate] = useState(null)
									// so Calendar gets props(argument) selectedDate={null}
									// selectedDateProps={selectedDate}
									// setSelectedDateProps={setSelectedDate}
									// this is replaced instead of the old state setter
									selectedDateProps={selectedDateObj}
									setSelectedDateProps={updateUrlWithDate}
									availableDates={activeVolunteer.availableDates}
								/>
							</div>
							<div className="timeslot-col">
								<TimeSlotGroup
									// props = state
									// selectedDateProps={selectedDate} here also replaced with obj
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
