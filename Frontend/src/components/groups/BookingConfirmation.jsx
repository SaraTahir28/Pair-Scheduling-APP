import React from "react";
import { CheckCircle2, User, Calendar, Globe, Video } from "lucide-react";

const BookingConfirmation = ({
	selectedDateObj,
	selectedTime,
	volunteerProps,
}) => {
	const formattedDate = selectedDateObj.toLocaleDateString("en-CA");

	return (
		<div className="confirmation-container">
			<img
				src={volunteerProps?.img}
				alt="Volunteer Avatar"
				className="avatar"
			/>

			<div className="confirmation-header">
				<div className="confirmation-title">
					<CheckCircle2 className="confirmation-icon" />
					<span>You are scheduled</span>
				</div>
				<p className="confirmation-subtitle">
					A calendar invitation has been sent to your email address.
				</p>
			</div>
			<div className="confirmation-details-card">
				<h3 className="role-tile">Your 1:1 session details</h3>

				<div className="confirmation-detail-row">
					<User className="confirmation-detail-icon" />
					<span>{volunteerProps?.name}</span>
				</div>

				<div className="confirmation-detail-row">
					<Calendar className="confirmation-detail-icon" />
					<span>
						{formattedDate} at {selectedTime} - {parseInt(selectedTime) + 1}:00
					</span>
				</div>

				<div className="confirmation-detail-row">
					<Globe className="confirmation-detail-icon" />
					<span>UK, Ireland, Lisbon Time</span>
				</div>

				<div className="confirmation-detail-row">
					<Video className="confirmation-detail-icon" />
					<span className="text-muted">Google Meet link</span>
				</div>
			</div>
		</div>
	);
};

export default BookingConfirmation;
