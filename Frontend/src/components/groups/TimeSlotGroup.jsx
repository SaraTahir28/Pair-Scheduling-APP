import { TimeSlotBtn } from "../elements/Button.jsx";
const TimeSlotGroup = ({
	selectedDateProps,
	setSelectedTimeProps,
	availableTimes,
}) => {
	// const TimeSlotGroup = () => { this is replaced with the props from App
	if (!selectedDateProps) {
		return (
			<div className="timeslot-group-div">
				<div className="timeslot-group-div">
					<p>Select a date to see available times.</p>
				</div>
			</div>
		);
	}

	const availableTimeSlotsInDivs = [];

	availableTimes.forEach((time, index) => {
		availableTimeSlotsInDivs.push(
			// was hardcoded here before as this but now we get from volunteer object
			// <div onClick={() => setSelectedTimeProps("14:00")}>
			// 	<TimeSlotBtn time="14:00" />
			// </div>
			//indexz comes from firEach
			<div key={index} onClick={() => setSelectedTimeProps(time)}>
				<TimeSlotBtn time={time} />
			</div>
		);
	});
	return (
		<div className="timeslot-group-div">
			<p>{selectedDateProps.toDateString()}</p>

			{/*
			here we were initailly showing each clickable time slot in own div
			 <div onClick={() => setSelectedTimeProps("14:30")}>
				<TimeSlotBtn time="14:30" />
			</div> now instead we do render */}
			{availableTimeSlotsInDivs}
		</div>
	);
};

export default TimeSlotGroup;
