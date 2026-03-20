import React from "react";
import { Clock, Video } from "lucide-react";

const SessionDetails = ({ activeVolunteerProps, volunteerView }) => {
	if (volunteerView) {
		return (
			<div className="session-details-div">
				<h1>Welcome back</h1>
				<div className="availableVolunteersDiv">
					<div className="avatar-row">
						<img
							src={activeVolunteerProps.img}
							className="avatar"
							alt="Profile"
						/>
					</div>
					<p>
						Logged in as <br />
						<strong>{activeVolunteerProps.name}</strong>
					</p>
				</div>
			</div>
		);
	}

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

			{/* here we conditionally render available volunteers only if date is selected selectedDate 
			but becasue Duncan is hardcoded just his dates show instantly but not his info
			so for now this is commented out and when we have more volunteers 
			they will show based on selectedDateProps*/}
			{/* {selectedDateProps && ( */}
			<div className="availableVolunteersDiv">
				{/* <p className="volunteers-label">Available volunteers</p> for now only one  */}

				<div className="avatar-row">
					{/*  here we will eventually have all available volunteers for the day
						but for now only Duncan shows */}
					<img src={activeVolunteerProps.img} className="avatar" />
				</div>

				{/* <p className="volunteer-name">{volunteersDetailsProps[0].name}</p> */}
				<p>
					Your session is with <br></br>
					<strong>{activeVolunteerProps.name}</strong>
				</p>
			</div>
		</>
	);
};

export default SessionDetails;
