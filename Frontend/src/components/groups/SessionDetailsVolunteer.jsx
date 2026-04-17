import { Calendar } from "lucide-react";
import { useAuth } from "../../AuthContext";

const VolunteerSessionDetails = ({ onManageAvailabilityClick }) => {
	const { user } = useAuth() || {};

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
};

export default VolunteerSessionDetails;