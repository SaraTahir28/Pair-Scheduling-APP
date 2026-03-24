import React, { useState } from "react";
import { ActionBtn } from "../elements/Button";

const VolunteerAvailabilityForm = ({ whenFormSubmit, volunteerId, mode }) => {
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

		// build dates logic
		const today = new Date();
		const startDateStr = today.toISOString().split("T")[0];

		// date + 3 months for recurring
		const futureDate = new Date();
		futureDate.setMonth(today.getMonth() + 3);
		const endDateStr = isRecurring
			? futureDate.toISOString().split("T")[0]
			: startDateStr;

		// build slotsObj
		const slotsObj = {
			volunteerId: volunteerId,
			isRecurring: isRecurring,
			startDate: startDateStr,
			endDate: endDateStr,
			day: day,
			startTime: startTime,
			endTime: endTime,
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
						disabled={mode === "view"}
						onChange={(e) => setIsRecurring(e.target.checked)}
					/>
				</div>

				<div className="form-input-group">
					<label className="form-label">select day</label>
					<select
						className="form-input"
						disabled={mode === "view"}
						onChange={(e) => setDay(e.target.value)}
					>
						<option value="">choose...</option>
						<option value="monday">monday</option>
						<option value="tuesday">tuesday</option>
						<option value="wednesday">wednesday</option>
						<option value="thursday">thursday</option>
						<option value="friday">friday</option>
						<option value="saturday">saturday</option>
						<option value="sunday">sunday</option>
					</select>
				</div>

				<div className="form-input-group">
					<label className="form-label">start time</label>
					<input
						className="form-input"
						type="time"
						disabled={mode === "view"}
						onChange={(e) => setStartTime(e.target.value)}
					/>
				</div>

				<div className="form-input-group">
					<label className="form-label">end time</label>
					<input
						className="form-input"
						type="time"
						disabled={mode === "view"}
						onChange={(e) => setEndTime(e.target.value)}
					/>
				</div>

				<br />
				{mode !== "view" && (
					<ActionBtn onClick={checkInputsValid}>Submit Availability</ActionBtn>
				)}
			</form>
		</div>
	);
};

export default VolunteerAvailabilityForm;
