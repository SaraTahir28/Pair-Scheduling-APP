import React, { useState } from "react";
import { ActionBtn } from "../elements/Button";

const BookingForm = ({ whenUserClicksBookMeeting }) => {
	return (
		<div>
			<form>
				<input type="name" label="Name" placeholder="Enter your name" />
				<input type="email" label="Email" placeholder="Enter your email" />

				<ActionBtn
					onClick={() =>
						whenUserClicksBookMeeting({
							traineeEmail: "kask@kaska.com",
							traineeName: "Kaska Kaz",
						})
					}
				>
					Book Meeting
				</ActionBtn>
			</form>
		</div>
	);
};

export default BookingForm;
