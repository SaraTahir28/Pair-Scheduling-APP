import React, { useState } from "react";
import { ActionBtn } from "../elements/Button";

const VolunteerAvailabilityForm = ({ whenFormSubmit, volId }) => {
	// set up local state that will be passed to app
	// like name and email
	const [isRecurring, setIsRecurring] = useState(false);
	const [day, setDay] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");

	const checkInputsValid = (e) => {
		// stop reload
		e.preventDefault();

		if (day === "") {
			alert("please select a day.");
			return;
		}

		if (startTime === "" || endTime === "") {
			alert("please enter time.");
			return;
		}

		// build slotsObj
		const today = new Date().toISOString().split("T")[0];

		const slotsObj = {
			volId: volId,
			isRecurring: isRecurring,
			startDate: today,
			endDate: isRecurring ? "2026-12-31" : today,
			day: day,
			start: startTime,
			end: endTime,
		};

		// send it up
		whenFormSubmit(slotsObj);
	};

	{
		/* onChange grabs keystroke and saves it to state */
	}
	return (
		<div className="booking-form-container">
			<h2 className="form-title">availability</h2>
			<form>
				<div className="form-input-group">
					<label className="form-label">recurring?</label>
					<input
						type="checkbox"
						onChange={(e) => setIsRecurring(e.target.checked)}
					/>
				</div>

				<div className="form-input-group">
					<label className="form-label">select day</label>
					<select
						className="form-input"
						onChange={(e) => setDay(e.target.value)}
					>
						<option value="">choose...</option>
						<option value="monday">monday</option>
						<option value="tuesday">tuesday</option>
						<option value="thursday">thursday</option>
					</select>
				</div>

				<div className="form-input-group">
					<label className="form-label">start time</label>
					<input
						className="form-input"
						type="time"
						onChange={(e) => setStartTime(e.target.value)}
					/>
				</div>

				<div className="form-input-group">
					<label className="form-label">end time</label>
					<input
						className="form-input"
						type="time"
						onChange={(e) => setEndTime(e.target.value)}
					/>
				</div>

				<br />
				<ActionBtn onClick={checkInputsValid}>Submit Availability</ActionBtn>
			</form>
		</div>
	);
};

export default VolunteerAvailabilityForm;
