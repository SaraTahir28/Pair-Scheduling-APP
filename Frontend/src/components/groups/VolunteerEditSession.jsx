import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ActionBtn } from "../elements/Button";
import { bookedSessions } from "../../data/BookedSessions";

const VolunteerEditSession = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const session = bookedSessions.find((s) => s.id === id);

	const handleEditSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);

		const updatedSession = {
			...session,
			date: formData.get("new_date"),
			time: formData.get("new_time"),
		};

		console.log("Saving session:", updatedSession);

		navigate("/volunteer-dash");
	};

	if (!session) {
		return <div>Session not found</div>;
	}

	return (
		<div className="booking-card-div">
			<h2 className="bookings-heading-selectdt">Edit booked session</h2>
			<div className="booking-card">
				<form className="session-edit-div" onSubmit={handleEditSubmit}>
					<label>
						New Date:
						<input type="date" name="new_date" defaultValue={session.date} />
					</label>
					<br />
					<label>
						New Time:
						<input type="time" name="new_time" defaultValue={session.time} />
					</label>
					<br />
					<div className="booking-card-btns">
						<button type="submit" className="action-btn btn-primary">
							Save
						</button>
						<ActionBtn
							additionalBtnClass="btn-secondary"
							onClick={() => navigate("/volunteer-dash")}
						>
							Cancel
						</ActionBtn>
					</div>
				</form>
			</div>
		</div>
	);
};

export default VolunteerEditSession;
