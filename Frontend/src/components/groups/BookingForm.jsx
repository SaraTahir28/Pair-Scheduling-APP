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
	return (
		<div>
			<form>
				<input
					type="text"
					label="Name"
					placeholder="Enter your name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<input
					type="email"
					label="Email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				{/* onChange grabs keystroke and saves it to state */}

				<ActionBtn onClick={checkInputsValid}>Book Meeting</ActionBtn>
			</form>
		</div>
	);
};

export default BookingForm;
