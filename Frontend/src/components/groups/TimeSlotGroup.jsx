import { TimeSlotBtn } from "../elements/Button.jsx";

const TimeSlotGroup = ({
  selectedDateProps,
  setSelectedTimeProps,
  availableTimes,
}) => {
  if (!selectedDateProps) {
    return (
      <div className="timeslot-group-div">
        <p>Select a date to see available times.</p>
      </div>
    );
  }

  if (availableTimes.length === 0) {
    return (
      <div className="timeslot-group-div">
        <p>{selectedDateProps.toDateString()}</p>
        <p className="timeslot-empty">No available times for this date</p>
      </div>
    );
  }

  const availableTimeSlotsInDivs = [];

  availableTimes.forEach((slot, index) => {
    availableTimeSlotsInDivs.push(
      <TimeSlotBtn
        key={`${slot.time}-${slot.volunteerId}-${slot.slotRuleId}-${index}`}
        time={slot.time}
        name={slot.name}
        onClick={() =>
          setSelectedTimeProps(slot.time, slot.volunteerId, slot.slotRuleId)
        }
      />
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
