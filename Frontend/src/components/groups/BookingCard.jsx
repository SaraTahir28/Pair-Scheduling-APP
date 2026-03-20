import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Video } from "lucide-react";
import { ActionBtn } from "../elements/Button";
import { Link } from "react-router-dom";

const BookingCard = ({
	trainee,
	session,
	deleteBookedSession,
	//fix -updated so when user clicks on edit the div does not dissapear and editing div opens
	// saveEditedSession, - this is not needed anymore with routing
}) => {
	const [isUserClickingDelete, setIsUserClickingDelete] = useState(false);

	//routing update split into url - not needed
	// // const [isEditing, setIsEditing] = useState(false);

	// const handleEditSubmit = (e) => {
	// 	e.preventDefault();
	// 	const formData = new FormData(e.target);

	// 	const updatedSession = {
	// 		...session,
	// 		date: formData.get("new_date"),
	// 		time: formData.get("new_time"),
	// 	};

	// 	saveEditedSession(updatedSession);
	// 	setIsEditing(false);
	// };

	//ask for a confirmation if clicked on delete
	if (isUserClickingDelete) {
		return (
			<div className="confirm-delete-div">
				<p>Do you want to delete this session?</p>
				<ActionBtn
					additionalBtnClass="btn-destructive"
					onClick={deleteBookedSession}
				>
					Yes
				</ActionBtn>
				<ActionBtn
					additionalBtnClass="btn-secondary"
					onClick={() => setIsUserClickingDelete(false)}
				>
					Cancel
				</ActionBtn>
			</div>
		);
	}

	// routing - this is not needed
	//edit is moved from app
	// if (isEditing) {
	// 	return (
	// 		<div className="booking-card-div">
	// 			<div className="booking-card">
	// 				<h3>Edit Session</h3>
	// 				<form className="edit-session-form" onSubmit={handleEditSubmit}>
	// 					<label>
	// 						New Date:
	// 						<input type="date" name="new_date" defaultValue={session.date} />
	// 					</label>
	// 					<br />
	// 					<label>
	// 						New Time:
	// 						<input type="time" name="new_time" defaultValue={session.time} />
	// 					</label>
	// 					<br />
	// 					<div className="booking-card-btns">
	// 						<button type="submit" className="action-btn save-btn">
	// 							Save
	// 						</button>
	// 						<ActionBtn
	// 							additionalBtnClass="btn-secondary"
	// 							onClick={() => setIsEditing(false)}
	// 						>
	// 							Cancel
	// 						</ActionBtn>
	// 					</div>
	// 				</form>
	// 			</div>
	// 		</div>
	// 	);
	// }
	//if not clicked delete render the div with booked session
	return (
		<div className="booking-card-div">
			<div className="booking-card">
				<div className="session-plus-trainee-details-div">
					<div>
						<img src={trainee.img} alt="Profile picture" className="avatar" />
						<p>
							Your session is with <br></br>
							<strong>{trainee.name}</strong>
						</p>
					</div>

					<div className="session-details-div-booking-card">
						<div className="session-icon-text-line">
							<Clock className="session-icon" />
							<p>
								{session.date} at {session.time}
							</p>
						</div>

						<div className="session-icon-text-line">
							<Video className="session-icon" />
							<a
								href={session.meetLink}
								target="_blank"
								rel="noopener noreferrer"
								className="video-link"
							>
								Google Meet Link
							</a>
						</div>
					</div>
				</div>

				<div className="booking-card-btns">
					{/* <ActionBtn
						additionalBtnClass="btn-secondary"
						onClick={() => setIsEditing(true)}
					>
						Edit
					</ActionBtn> */}
					<Link
						to={`/volunteer-dash/bookings/${session.id}/edit`}
						className="action-btn btn-secondary"
						style={{ textDecoration: "none", textAlign: "center" }}
					>
						Edit
					</Link>

					<ActionBtn
						additionalBtnClass="btn-tertiary"
						onClick={() => setIsUserClickingDelete(true)}
					>
						Delete
					</ActionBtn>
				</div>
			</div>
		</div>
	);
};

export default BookingCard;
