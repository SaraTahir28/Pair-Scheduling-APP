import { Clock, Video, Calendar } from "lucide-react";
import { useAuth } from "../../AuthContext";

const SessionDetails = ({
	activeVolunteerProps,
	volunteers = [],
	onVolunteerSelect,
	volunteerView,
	traineeView,
	onManageAvailabilityClick,
}) => {
	const { user } = useAuth() || {};

	if (volunteerView) {
		return (
			<div className="session-details-div">
				<h1>Welcome</h1>

				<div className="session-icon-text">
					<div className="session-icon-text-line">
						<p>You are logged in as</p>
						<p>
							<strong>{user?.name || "a Volunteer"}</strong>
						</p>
					</div>
					<div className="avatar-row mt-2">
						<img src={user?.img} className="avatar" alt="profile avatar" />
					</div>
					<div className="session-icon-text-line mt-4">
						<p>You can view and manage your availability for 1:1 sessions.</p>
					</div>
					<div className="session-icon-text-line">
						{onManageAvailabilityClick && (
							<button
								className="btn-with-icon"
								onClick={onManageAvailabilityClick}
							>
								<Calendar className="btn-icon" />
								Manage my availability
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}

	if (traineeView) {
		return (
			<>
				<div className="session-details-div">
					<h1>Book 1:1 session</h1>

					<div className="session-icon-text">
						<div className="session-icon-text-line">
							<Clock className="session-icon" />
							<p>1 hour</p>
						</div>

						<div className="session-icon-text-line">
							<Video className="session-icon" />
							<p>Google Meet link provided upon confirmation.</p>
						</div>
					</div>
				</div>

				{activeVolunteerProps && (
					<div className="availableVolunteersDiv">
						<div className="avatar-row">
							<img
								src={activeVolunteerProps.img}
								className="avatar"
								alt="profile avatar"
							/>
						</div>

						<p>
							You are booking a session with <br />
							<strong>{activeVolunteerProps.name}</strong>
						</p>
					</div>
				)}

				{!activeVolunteerProps && volunteers.length > 0 && (
					<div className="availableVolunteersDiv">
						<div className="avatar-row">
							{volunteers.map((volunteer) => (
								<img
									key={volunteer.id}
									src={volunteer.img}
									className="avatar"
									alt={volunteer.name}
									onClick={() => onVolunteerSelect?.(volunteer)}
									style={{ cursor: "pointer" }}
								/>
							))}
						</div>

						<p>Please select from the available volunteers</p>
					</div>
				)}
			</>
		);
	}

	return null;
};

export default SessionDetails;
