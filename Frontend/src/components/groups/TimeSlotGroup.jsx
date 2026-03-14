import { TimeSlotBtn } from "../elements/Button.jsx";
const TimeSlotGroup = ({ selectedDate, setSelectedTime }) => {
	// const TimeSlotGroup = () => { this is replaced with the props from App
	if (!selectedDate) {
		return (
			<div className="timeslot-group-div">
				<p className="timeslot-date-label">
					Select a date to see available times.
				</p>
			</div>
		);
	}
	return (
		<div className="timeslot-group-div">
			<p className="timeslot-date-label">{selectedDate.toDateString()}</p>
			<div onClick={() => setSelectedTime("14:00")}>
				<TimeSlotBtn time="14:00" />
			</div>
			<div onClick={() => setSelectedTime("14:30")}>
				<TimeSlotBtn time="14:30" />
			</div>
			<div onClick={() => setSelectedTime("15:00")}>
				<TimeSlotBtn time="15:00" />
			</div>
			<div onClick={() => setSelectedTime("15:30")}>
				<TimeSlotBtn time="15:30" />
			</div>
			<div onClick={() => setSelectedTime("16:00")}>
				<TimeSlotBtn time="16:00" />
			</div>
			<div onClick={() => setSelectedTime("16:30")}>
				<TimeSlotBtn time="16:30" />
			</div>
		</div>
	);
};

export default TimeSlotGroup;
