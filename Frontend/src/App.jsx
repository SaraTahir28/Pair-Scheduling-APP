import React, { useState } from "react";
import SessionDetails from "./components/groups/SessionDetails";
import Calendar from "./components/groups/Calendar";
import TimeSlotGroup from "./components/groups/TimeSlotGroup";
import { ActionBtn } from "./components/elements/Button";

function App() {
	//this is moved here deom Calendar so the TimeSlotGroup knows what date was selected
	const [userClickedOnDate, setUserClickedOnDate] = useState(null);

	return (
		<div className="booking-box">
			<div className="session-details-col">
				<SessionDetails />
			</div>
			<div className="calendar-col">
				{/* so instead of Calendar  selectedDay= prop from calendar */}
				<Calendar
					userClickedOnDateFromApp={userClickedOnDate}
					setUserClickedOnDateFromApp={setUserClickedOnDate}
				/>
			</div>
			<div className="timeslot-col">
				<TimeSlotGroup selectedDay={userClickedOnDate} />
			</div>
		</div>
	);
}

export default App;
