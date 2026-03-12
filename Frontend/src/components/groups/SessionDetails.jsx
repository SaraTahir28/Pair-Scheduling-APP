import React from "react";
import { Clock, Video } from "lucide-react";

const SessionDetails = () => {
	return (
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
	);
};

export default SessionDetails;
