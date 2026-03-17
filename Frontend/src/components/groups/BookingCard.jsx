import React, { useState } from "react";
import { Clock, Video } from "lucide-react";
import { ActionBtn } from "../elements/Button";

const BookingCard = ({ trainee, deleteBookedSession }) => {
	const [isUserClickingDelete, setIsUserClickingDelete] = useState(false);

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
					<ActionBtn
						additionalBtnClass="btn-secondary"
						onClick={() => console.log("Edit btn clicked")}
					>
						Make changes
					</ActionBtn>

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
