import { useState } from "react";
import AddingSlotsBasket from "./AddingSlotsBasket";
import {
  toDayOfWeekName,
  formatLocalDate,
  parseLocalDateTime,
} from "../../utilities/dateTime";

const VolunteerAvailabilityForm = ({
  whenFormSubmit,
  volunteerId,
  mode,
  addedSlots,
  removeSlot,
  saveAll,
}) => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [specificDate, setSpecificDate] = useState(formatLocalDate(new Date()));
  const [startTime, setStartTime] = useState("09:00");
  const [repeatUntil, setRepeatUntil] = useState("");

  const checkInputsValid = (e) => {
    e.preventDefault();

    if (!specificDate) {
      alert("Please pick a date.");
      return;
    }

    if (startTime === "") {
      alert("Please enter a start time.");
      return;
    }

    if (isRecurring && !repeatUntil) {
      alert("Please select a 'Repeat until' date.");
      return;
    }

    const timeWithDate = parseLocalDateTime(
      specificDate,
      startTime
    ).toISOString();

    const checkForDuplicateSlot =
      addedSlots &&
      addedSlots.some((oldSlot) => {
        const isSameStartDateAndTime = oldSlot.start_time === timeWithDate;

        if (isRecurring) {
          const isOldRecurring = oldSlot.regular === true;
          const isSameRepeatUntil = oldSlot.repeat_until === repeatUntil;

          return isSameStartDateAndTime && isOldRecurring && isSameRepeatUntil;
        } else {
          return isSameStartDateAndTime;
        }
      });

    if (checkForDuplicateSlot) {
      alert("This slot is already added.");
      return;
    }

    const checkForOverlapSlot =
      addedSlots &&
      addedSlots.some((oldSlot) => {
        const oldSlotTimeInMs = new Date(oldSlot.start_time).getTime();
        const newSlotTimeInMs = new Date(timeWithDate).getTime();
        let timeDifferenceInMs;
        if (oldSlotTimeInMs > newSlotTimeInMs) {
          timeDifferenceInMs = oldSlotTimeInMs - newSlotTimeInMs;
        } else {
          timeDifferenceInMs = newSlotTimeInMs - oldSlotTimeInMs;
        }
        const slotIsTooClose = timeDifferenceInMs < 3600000;

        const oldSlotDate = new Date(oldSlot.start_time);
        const newSlotDate = new Date(timeWithDate);
        const isSameWeekday = oldSlotDate.getDay() === newSlotDate.getDay();
        const checkMinutesDifference = Math.abs(
          oldSlotDate.getHours() * 60 +
            oldSlotDate.getMinutes() -
            (newSlotDate.getHours() * 60 + newSlotDate.getMinutes())
        );
        if (oldSlot.regular && !isRecurring) {
          return (
            isSameWeekday &&
            checkMinutesDifference < 60 &&
            newSlotDate >= oldSlotDate &&
            newSlotDate <= new Date(oldSlot.repeat_until)
          );
        }

        if (isRecurring && !oldSlot.regular) {
          return (
            isSameWeekday &&
            checkMinutesDifference < 60 &&
            oldSlotDate >= newSlotDate &&
            oldSlotDate <= new Date(repeatUntil)
          );
        }

        return slotIsTooClose;
      });
    if (checkForOverlapSlot) {
      alert("Your sessions must be at least one hour apart.");
      return;
    }

    const slotsObj = {
      volunteer_id: volunteerId,
      regular: isRecurring,
      weekday: isRecurring ? toDayOfWeekName(specificDate) : null,
      start_time: timeWithDate,
      repeat_until: isRecurring ? repeatUntil : null,
      group: "all",
    };
    whenFormSubmit(slotsObj);

    setStartTime("09:00");
    setIsRecurring(false);
    setRepeatUntil("");
  };

  return (
    <>
      {mode === "edit" && (
        <AddingSlotsBasket
          addedSlots={addedSlots}
          removeSlot={removeSlot}
          saveAll={saveAll}
        />
      )}

      <div className="booking-form-container">
        <form onSubmit={checkInputsValid}>
          <h2 className="form-title">Select your availability</h2>
          <div className="form-input-group-row">
            <input
              id="recurring"
              className="form-checkbox"
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            <label htmlFor="recurring" className="form-label">
              Recurring weekly?
            </label>
          </div>

          {!isRecurring && (
            <div className="form-input-group">
              <label htmlFor="date" className="form-label">
                Select date
              </label>
              <input
                id="date"
                className="form-input"
                type="date"
                disabled={mode === "view"}
                value={specificDate}
                onChange={(e) => setSpecificDate(e.target.value)}
              />
            </div>
          )}
          {isRecurring && (
            <>
              <div className="form-input-group">
                <label htmlFor="startDate" className="form-label">
                  Starting on
                </label>
                <input
                  id="startDate"
                  className="form-input"
                  type="date"
                  disabled={mode === "view"}
                  value={specificDate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setSpecificDate(newDate);
                  }}
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="repeatUntil" className="form-label">
                  Repeat until
                </label>
                <input
                  id="repeatUntil"
                  className="form-input"
                  type="date"
                  disabled={mode === "view"}
                  min={specificDate}
                  value={repeatUntil}
                  onChange={(e) => setRepeatUntil(e.target.value)}
                />
              </div>

              <div className="form-input-group">
                <span>
                  This session will repeat every{" "}
                  <strong>{toDayOfWeekName(specificDate)}</strong>
                </span>
              </div>
            </>
          )}

          <div className="form-input-group">
            <label htmlFor="time" className="form-label">
              Time
            </label>
            <input
              id="time"
              className="form-input"
              type="time"
              disabled={mode === "view"}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          {mode !== "view" && (
            <button type="submit" className={"action-btn btn-secondary"}>
              Add to list
            </button>
          )}
        </form>
      </div>

      {mode !== "edit" && (
        <AddingSlotsBasket
          addedSlots={addedSlots}
          removeSlot={removeSlot}
          saveAll={saveAll}
        />
      )}
    </>
  );
};

export default VolunteerAvailabilityForm;
