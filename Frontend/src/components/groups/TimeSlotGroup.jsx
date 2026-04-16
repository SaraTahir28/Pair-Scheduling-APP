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

  availableTimes.forEach((slot, index) => {
    availableTimeSlotsInDivs.push(
      <div
        key={`${slot.time}-${slot.volunteerId}-${slot.slotRuleId}-${index}`}
        onClick={() =>
          setSelectedTimeProps(slot.time, slot.volunteerId, slot.slotRuleId)
        }
      >
        <TimeSlotBtn time={slot.time} name={slot.name} />
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
