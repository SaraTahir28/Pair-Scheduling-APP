import React, { useState } from "react";
import SessionDetails from "../components/groups/SessionDetails";
import Calendar from "../components/groups/Calendar";
import TimeSlotGroup from "../components/groups/TimeSlotGroup";
import BookingForm from "../components/groups/BookingForm";
import { volunteersDetails } from "../data/UserData";

const TraineeBookingFlow = () => {
	//App holds state and sends as props to children as props, children change state and rerender is triggered

	//here adding state of selected sent to Calendar and TimeSlotGroup as props
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);

	// here after the form is submitted we will change state of this
	//to show confirmation rendered where the booking form was
	const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

	//here we select state of activeVolunteer that will be passed to session details volunteers div
	//for now Duncan is an active volunteer
	const [activeVolunteer, setActiveVolunteer] = useState(
		volunteersDetails.find((volunteer) => volunteer.id === 1)
	);

	// here we set up booking obj that will be sent to backend
	const createBookingDetailsObj = (bookingFormData) => {
		const formattedDate = selectedDate.toLocaleDateString("en-CA");

		const bookingDetailsObj = {
			trainee_name: bookingFormData.traineeName,
			trainee_email: bookingFormData.traineeEmail,
			//start_date and start_time icome from the state
			//converted in fix ----- start
			// start_date: selectedDate,
			// // on fornt end I had start_date as date only but backedn uses date and time in one so below
			// start_time: selectedTime, now below this matches backend
			// start_date and start_time are one var
			start_time: `${formattedDate}T${selectedTime}:00Z`,
			//below is hardcoded as in fe it only exists as 1 hour meeting and no end_time exists
			end_time: `${formattedDate}T23:59:00Z`,
			volunteer_name: activeVolunteer.name,
			volunteer_email: activeVolunteer.email,
		};
		fetch("http://localhost:8000/api/create-meeting/", {
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
				{/* cond to show left panel only if no confirmation yet */}
				{!isBookingConfirmed && (
					<SessionDetails
						// here left is prop passed to component rihght data sent from app
						selectedDateProps={selectedDate}
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
							selectedDateProps={selectedDate}
							setSelectedDateProps={setSelectedDate}
							availableDates={activeVolunteer.availableDates}
						/>
					</div>
					<div className="timeslot-col">
						<TimeSlotGroup
							// props = state
							selectedDateProps={selectedDate}
							setSelectedTimeProps={setSelectedTime}
							availableTimes={activeVolunteer.availableTimes}
						/>
					</div>
				</>
			)}

			{/* when user selects date and time we render booking form and hide the cal */}
			{selectedTime && !isBookingConfirmed && (
				<div className="timeslot-col">
					<BookingForm whenFormSubmit={createBookingDetailsObj} />
				</div>
			)}

			{/* show confirmation when booking is made*/}
			{isBookingConfirmed && (
				<div className="timeslot-col">
					<div>
						<h2>Your session is booked</h2>
						<p>
							Your meeting is on {selectedDate.toLocaleDateString()} at
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
