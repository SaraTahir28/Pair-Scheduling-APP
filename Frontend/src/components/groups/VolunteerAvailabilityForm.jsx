import React, { useState } from "react";
import { ActionBtn } from "../elements/Button";

const VolunteerAvailabilityForm = ({ whenFormSubmit, volunteerId, mode }) => {
	//this is with repeated date initially set to off
	const [isRecurring, setIsRecurring] = useState(false);
	const [specificDate, setSpecificDate] = useState(
		new Date().toISOString().split("T")[0]
	);
	const [dropdownSelectionDay, setDropdownSelectionDay] = useState("");
	const [startTime, setStartTime] = useState("09:00");
	// const [endTime, setEndTime] = useState(""); //TODO nice to haves

	const checkInputsValid = (e) => {
		e.preventDefault();

		if (!isRecurring && !specificDate) {
			alert("Please pick a date.");
			return;
		}

		if (isRecurring && !dropdownSelectionDay) {
			alert("Please select a day of the week.");
			return;
		}

		if (startTime === "") {
			alert("please enter a start time.");
			return;
		}

		// dates logic
		const isToday = new Date().toISOString().split("T")[0];
		const startDate = isRecurring ? isToday : specificDate;
		const timeWithDate = `${startDate}T${startTime}:00`;

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
			weekday: isRecurring ? dropdownSelectionDay : null,
			start_time: timeWithDate,
			repeat_until: null,
			// TODO repeat_until: isRecurring ? futureDate.toISOString() : null,
			// endTime: endTime, // this is for future now no end
		};
		console.log("obj for db", slotsObj);
		whenFormSubmit(slotsObj);
		setDropdownSelectionDay("");
		setStartTime("09:00");
		setIsRecurring(false);
	};

	return (
		<div className="booking-form-container">
			<h2 className="form-title">Select your availability</h2>

			<form onSubmit={checkInputsValid}>
				<div className="form-input-group">
					<label className="form-label">recurring weekly?</label>
					<input
						type="checkbox"
						checked={isRecurring}
						value={startTime}
						onChange={(e) => setIsRecurring(e.target.checked)}
					/>
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
					<div className="form-input-group">
						<label className="form-label">Select day</label>
						<select
							className="form-input"
							disabled={mode === "view"}
							onChange={(e) => setDropdownSelectionDay(e.target.value)} // NAPRAWIONE: było setDay
						>
							<option value="">Select...</option>
							<option value="monday">Monday</option>
							<option value="tuesday">Tuesday</option>
							<option value="wednesday">Wednesday</option>
							<option value="thursday">Thursday</option>
							<option value="friday">Friday</option>
							<option value="saturday">Saturday</option>
							<option value="sunday">Sunday</option>
						</select>
					</div>
				)}

				<div className="form-input-group">
					<label className="form-label">Time</label>
					<input
						className="form-input"
						type="time"
						disabled={mode === "view"}
						onChange={(e) => setStartTime(e.target.value)}
					/>
				</div>

				{mode !== "view" && (
					<ActionBtn onClick={checkInputsValid}>Add to list</ActionBtn>
				)}
			</form>
		</div>
	);
};

export default VolunteerAvailabilityForm;
