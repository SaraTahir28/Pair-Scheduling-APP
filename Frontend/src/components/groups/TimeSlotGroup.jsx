import { TimeSlotBtn } from "../elements/Button.jsx";
const TimeSlotGroup = ({
	selectedDateProps,
	setSelectedTimeProps,
	availableTimes,
}) => {
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
			<div key={index} onClick={() => setSelectedTimeProps(time)}>
				<TimeSlotBtn time={time} />
			</div>
		);
	});
	return (
		<div className="timeslot-group-div">
			<p>{selectedDateProps.toDateString()}</p>
			{availableTimeSlotsInDivs}
		</div>
	);
};

export default TimeSlotGroup;
