import React from "react";
import { Clock, Video } from "lucide-react";

const SessionDetails = ({ selectedDate }) => {
	//here added selectedDate as props to conditionally render volunteer availability div
	return (
		<>
			{/* here we conditionally render available volunteers only if date is selected selectedDate */}
			{selectedDate && (
				<div className="availableVolunteersDiv">
					<p className="volunteers-label">Available volunteers</p>

					<div className="avatar-row">
						<img src="../assets/duncan.png" className="avatar" />
						<img src="../assets/duncan.png" className="avatar" />
					</div>

					<p className="volunteer-name">Duncan Parkinson</p>
				</div>
			)}
			<div className="session-details-div">
				<h1>1:1 session</h1>

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
		</>
	);
};

export default SessionDetails;
