import React, { useState } from "react";
import { ActionBtn } from "../elements/Button";

const BookingForm = ({ whenFormSubmit, trainee }) => {
	const [name, setName] = useState(trainee?.name || "");

	const checkInputsValid = (e) => {
		e.preventDefault();
		const cleanName = name.trim().replace(/[^a-zA-Z\s]/g, "");
		const currentEmail = trainee?.email || "";

		if (cleanName.length < 2 || cleanName.length > 50) {
			alert("Name should be between 2 and 50 chars.");
			return;
		}

		if (!currentEmail.includes("@") || !currentEmail.includes(".")) {
			alert("Please enter a valid email.");
			return;
		}

		whenFormSubmit({
			traineeName: cleanName,
			traineeEmail: currentEmail,
		});
	};

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
						className="form-input form-input-disabled"
						type="email"
						label="Email"
						value={trainee?.email || ""}
						readOnly
					/>
				</div>
				<br></br>
				<ActionBtn additionalBtnClass="btn-primary" onClick={checkInputsValid}>
					Book meeting
				</ActionBtn>
			</form>
		</div>
	);
};

export default BookingForm;
