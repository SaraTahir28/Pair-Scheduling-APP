import { Clock, Video } from "lucide-react";
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
				<h1>Welcome back</h1>
				<div className="availableVolunteersDiv">
					<div className="avatar-row">
						<img src={user?.img} className="avatar" alt="profile avatar" />
					</div>
					<p>
						You are logged in as <br />
						<strong>{user?.name || "Volunteer"}</strong>
					</p>
					{onManageAvailabilityClick && (
						<button
							className="btn-secondary mt-4"
							onClick={onManageAvailabilityClick}
						>
							Manage my availability
						</button>
					)}
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
					</div>
				)}
			</>
		);
	}

	return null;
};

export default SessionDetails;
