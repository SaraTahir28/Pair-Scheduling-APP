import React from "react";
import { Clock, Video } from "lucide-react";
import { ActionBtn } from "../elements/Button";
// here i will pass the hardcoded array of trainees from app for now
const BookingCard = ({ trainee }) => {
	return (
		<div className="booking-card">
			<div className="session-plus-trainee-details-div">
				<div>
					<img src={trainee.img} alt="Profile picture" className="avatar" />
					<h3 className="trainee-name">{trainee.name}</h3>
				</div>

				<div className="session-details-div-booking-card">
					<div className="session-icon-text-line">
						<Clock className="session-icon" />
						<p>15:00 - 16:00 (1 hour)</p>
					</div>

					<div className="session-icon-text-line">
						<Video className="session-icon" />
						<a
							href="https://google.com"
							target="_blank"
							rel="noopener noreferrer"
							className="video-link"
						>
							Google Meet
						</a>
					</div>
				</div>
			</div>

			<div className="booking-card-btns">
				<ActionBtn
					additionalBtnClass="btn-secondary"
					onClick={() => console.log("Edit btn")}
				>
					Make changes
				</ActionBtn>

				<ActionBtn
					additionalBtnClass="btn-tertiary"
					onClick={() => console.log("Delete btn")}
				>
					Delete
				</ActionBtn>
			</div>
		</div>
	);
};

export default BookingCard;
