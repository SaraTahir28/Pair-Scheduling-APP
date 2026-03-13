import { TimeSlotBtn } from "../elements/Button.jsx";
const TimeSlotGroup = ({ selectedDay, setSelectedTimeFromApp }) => {
	// const TimeSlotGroup = () => { this is replaced with the props from App
	if (!selectedDay) {
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
			<p className="timeslot-date-label">{selectedDay.toDateString()}</p>
			<div onClick={() => setSelectedTimeFromApp("14:00")}>
				<TimeSlotBtn time="14:00" />
			</div>
			<div onClick={() => setSelectedTimeFromApp("14:30")}>
				<TimeSlotBtn time="14:30" />
			</div>
			<div onClick={() => setSelectedTimeFromApp("15:00")}>
				<TimeSlotBtn time="15:00" />
			</div>
			<div onClick={() => setSelectedTimeFromApp("15:30")}>
				<TimeSlotBtn time="15:30" />
			</div>
			<div onClick={() => setSelectedTimeFromApp("16:00")}>
				<TimeSlotBtn time="16:00" />
			</div>
			<div onClick={() => setSelectedTimeFromApp("16:30")}>
				<TimeSlotBtn time="16:30" />
			</div>
		</div>
	);
};

export default TimeSlotGroup;
