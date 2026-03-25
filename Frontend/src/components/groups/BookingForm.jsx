import React, { useState } from "react";
import { ActionBtn } from "../elements/Button";

const BookingForm = ({ whenFormSubmit }) => {
	//set up local state that will be passed to app
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	const checkInputsValid = (e) => {
		//stop reload
		e.preventDefault();
		const cleanName = name.trim().replace(/[^a-zA-Z\s]/g, "");
		const cleanEmail = email.trim();

		if (cleanName.length < 2 || cleanName.length > 50) {
			alert("Name should be between 2 and 50 chars.");
			return;
		}

		if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
			alert("Please enter a valid email.");
			return;
		}

		whenFormSubmit({
			traineeName: cleanName,
			traineeEmail: cleanEmail,
		});
	};

	{
		/* onChange grabs keystroke and saves it to state onChange={(e) => setName(e.target.value)} */
	}
	return (
		<div className="booking-form-container">
			<h2 className="form-title">Enter your details</h2>
			<form>
				<div className="form-input-group">
					<label className="form-label">Name</label>
					<input
						className="form-input"
						type="text"
						placeholder="Enter your name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>

				<div className="form-input-group">
					<label className="form-label">Email</label>
					<input
						className="form-input"
						type="email"
						label="Email"
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<br></br>
				<ActionBtn className="btn-schedule-event" onClick={checkInputsValid}>
					Book Meeting
				</ActionBtn>
			</form>
		</div>
	);
};

export default BookingForm;
