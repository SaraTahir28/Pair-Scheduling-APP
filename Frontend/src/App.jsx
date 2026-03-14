import React, { useState } from "react";
import SessionDetails from "./components/groups/SessionDetails";
import Calendar from "./components/groups/Calendar";
import TimeSlotGroup from "./components/groups/TimeSlotGroup";
import BookingForm from "./components/groups/BookingForm";

function App() {
	//App holds state and sends as props to children as props, children change state and rerender is triggered

	//here adding state of selected sent to Calendar and TimeSlotGroup as props
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);

	// here after the form is submitted we will change state of this
	//to show confirmation rendered where the booking form was
	const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

	// here we set up booking obj that will be sent to backend
	const createBookingDetailsObj = (bookingFormData) => {
		// TODO crete an obj note backend uses end time and different time format

		const bookingDetailsObj = {
			trainee_name: bookingFormData.traineeName,
			trainee_email: bookingFormData.traineeEmail,
			//these 2 come are grabbed from states above
			start_date: selectedDate,
			start_time: selectedTime,
			// end_time: selectedTime, //i dont have this yet anywhere - also fe uses 1 hour not fin time
			// volunteer_name: bookingFormData.traineeName,
			// volunteer_email: bookingFormData.volunteerEmail, - volunteerEmail does not yet exist in fe
		};

		console.log("obj created", bookingDetailsObj);
		setIsBookingConfirmed(true);
	};

	return (
		<div className="booking-box">
			<div className="session-details-col">
				{/* cond to show left panel only if no confirmation yet */}
				{!isBookingConfirmed && <SessionDetails />}
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
							selectedDate={selectedDate}
							setSelectedDate={setSelectedDate}
						/>
					</div>
					<div className="timeslot-col">
						<TimeSlotGroup
							// props = state
							selectedDate={selectedDate}
							setSelectedTime={setSelectedTime}
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
}

export default App;
