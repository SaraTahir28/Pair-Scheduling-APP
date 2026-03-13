import React, { useState } from "react";
import SessionDetails from "./components/groups/SessionDetails";
import Calendar from "./components/groups/Calendar";
import TimeSlotGroup from "./components/groups/TimeSlotGroup";
import BookingForm from "./components/groups/BookingForm";

function App() {
	//this is moved here from Calendar so the TimeSlotGroup knows what date was selected
	const [userClickedOnDate, setUserClickedOnDate] = useState(null);
	//here adding state of time that user selected in timeslot
	const [selectedTime, setSelectedTime] = useState(null);

	// here after the form is submitted we will change state of this
	const [bookingIsConfirmed, readyToShowBookingConfirmation] = useState(false);
	//to show confirmation rendered where the booking form was

	// here we set up what will be returned from BookingForm.jsx to send to the be
	const createBookingDetailsObj = (bookingFormData) => {
		// crete an obj note backend uses end time and different time format
		/////////////////////////////////
		const bookingDetailsObj = {
			trainee_name: bookingFormData.traineeName,
			trainee_email: bookingFormData.traineeEmail,
			//these 2 come are grabbed from states above
			start_date: userClickedOnDate,
			start_time: selectedTime,
			// end_time: selectedTime, //i dont have this yet anywhere - also fe uses 1 hour not fin time
			volunteer_name: bookingFormData.traineeName,
			// volunteer_email: bookingFormData.volunteerEmail, - volunteerEmail does not yet exist
		};

		console.log("obj created", bookingDetailsObj);
		readyToShowBookingConfirmation(true);
	};

	return (
		<div className="booking-box">
			<div className="session-details-col">
				<SessionDetails />
			</div>

			{/* here we conditionall y render the other groups/sections of the screen so no clutter in UI 
			first if not time selected we show calendar and then timeslots*/}
			{!selectedTime && (
				// <>  this empty tag is added here becauee not possible to generate 2 divs and our sections come in 2 separate divs so we have invisible to not mess with the styling</>
				<>
					<div className="calendar-col">
						{/* here we send as props to component and component changes state then react rerenders when stae is changed */}
						<Calendar
							userClickedOnDateFromApp={userClickedOnDate}
							setUserClickedOnDateFromApp={setUserClickedOnDate}
						/>
					</div>
					<div className="timeslot-col">
						<TimeSlotGroup
							selectedDay={userClickedOnDate}
							setSelectedTimeFromApp={setSelectedTime}
						/>
					</div>
				</>
			)}

			{/* when user selects date and time we show booking form and hide the cal */}
			{selectedTime && !bookingIsConfirmed && (
				<div className="timeslot-col">
					<BookingForm whenUserClicksBookMeeting={createBookingDetailsObj} />
				</div>
			)}

			{/* show confirmation when booking is made*/}
			{bookingIsConfirmed && (
				<div className="timeslot-col">
					<div>
						<h2>Your session is booked</h2>
						<p>
							Your meeting is on {userClickedOnDate.toLocaleDateString()} at
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
