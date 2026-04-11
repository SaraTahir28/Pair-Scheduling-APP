import React, { useState } from "react";
import { ActionBtn } from "../elements/Button";
import AddingSlotsBasket from "./AddingSlotsBasket";

const VolunteerAvailabilityForm = ({
	whenFormSubmit,
	volunteerId,
	mode,
	addedSlots,
	removeSlot,
	saveAll,
}) => {
	const getDayName = (dateStr) => {
		return new Date(dateStr + "T00:00:00").toLocaleDateString("en-CA", {
			weekday: "long",
		});
	};

	//this is with repeated date initially set to off
	const [isRecurring, setIsRecurring] = useState(false);
	const [specificDate, setSpecificDate] = useState(
		new Date().toISOString().split("T")[0]
	);
	const [startTime, setStartTime] = useState("09:00");
	// const [endTime, setEndTime] = useState(""); //TODO nice to haves

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

		const timeWithDate = `${specificDate}T${startTime}:00`;

		// TODO - nice to haves
		// for now no tim limit
		// const futureDate = new Date();
		// futureDate.setMonth(today.getMonth() + 3);
		// const endDateStr = isRecurring
		// 	? futureDate.toISOString().split("T")[0]
		// 	: startDateStr;

		// build slotsObj
		const slotsObj = {
			volunteer_id: volunteerId,
			regular: isRecurring,
			weekday: isRecurring ? getDayName(specificDate) : null,
			start_time: timeWithDate,
			repeat_until: null,
			// TODO repeat_until: isRecurring ? futureDate.toISOString() : null,
			// endTime: endTime, // this is for future now no end
			group: null,
		};
		console.log("obj for db", slotsObj);
		whenFormSubmit(slotsObj);

		setStartTime("09:00");
		setIsRecurring(false);
	};

	return (
		<>
			<div className="booking-form-container">
				<form onSubmit={checkInputsValid}>
					<h2 className="form-title">Select your availability</h2>
					<div className="form-input-group-row">
						<input
							className="form-checkbox"
							type="checkbox"
							checked={isRecurring}
							onChange={(e) => setIsRecurring(e.target.checked)}
						/>
						<label className="form-label">recurring weekly?</label>
					</div>

					{!isRecurring && (
						<div className="form-input-group">
							<label className="form-label">Select date</label>
							<input
								className="form-input"
								type="date"
								disabled={mode === "view"}
								//TODO admin view later and view selected availability
								value={specificDate}
								onChange={(e) => setSpecificDate(e.target.value)}
							/>
						</div>
					)}
					{isRecurring && (
						<>
							<div className="form-input-group">
								<label className="form-label">Starting on</label>
								<input
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
								<span>
									This session will repeat every{" "}
									<strong>{getDayName(specificDate)}</strong>
								</span>
							</div>
						</>
					)}

					<div className="form-input-group">
						<label className="form-label">Time</label>
						<input
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

			<div>
				<AddingSlotsBasket
					addedSlots={addedSlots}
					removeSlot={removeSlot}
					saveAll={saveAll}
				/>
			</div>
		</>
	);
};

export default VolunteerAvailabilityForm;
