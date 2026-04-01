import React, { useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { ActionBtn } from "../elements/Button";
import { Link } from "react-router-dom";

const AvailabilityCard = ({
	volunteer,
	availableSlot,
	deleteAvailableSlot,
}) => {
	const [isUserClickingDelete, setIsUserClickingDelete] = useState(false);

	const dateStr = availableSlot.start_time.split("T")[0];
	const timeStr = availableSlot.start_time.split("T")[1].slice(0, 5);

	if (isUserClickingDelete) {
		return (
			<div className="confirm-delete-div">
				<p>Do you want to delete this availability slot?</p>
				<ActionBtn
					additionalBtnClass="btn-destructive"
					onClick={deleteAvailableSlot}
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
	return (
		<div className="booking-card-div">
			<div className="booking-card">
				<div className="session-plus-trainee-details-div">
					<div>
						<img src={volunteer.img} alt="Profile picture" className="avatar" />
						<p>
							Your session is <br></br>
							{availableSlot.regular && <strong>Recurring weekly</strong>}
						</p>
					</div>

					<div className="session-details-div-booking-card">
						<div className="session-icon-text-line">
							<Calendar className="session-icon" />
							<p>
								{availableSlot.regular &&
									`Every ${availableSlot.weekday} starting on ${dateStr}`}
								{!availableSlot.regular && `On ${dateStr}`}
							</p>
						</div>
						<div className="session-icon-text-line">
							<Clock className="session-icon" />
							<p>at {timeStr}</p>
						</div>
					</div>
				</div>

				<div className="booking-card-btns">
					<Link
						to={`/volunteer-dash/availability/${availableSlot.id}`}
						className="action-btn btn-secondary"
					>
						View
					</Link>
					<Link
						to={`/volunteer-dash/availability/${availableSlot.id}/edit`}
						className="action-btn btn-secondary"
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

export default AvailabilityCard;
