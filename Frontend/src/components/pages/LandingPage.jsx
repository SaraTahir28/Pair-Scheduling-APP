import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
	return (
		<div className="landing-page text-center">
			<h1>Welcome to the Booking App</h1>

			<p>I am a</p>
			<br />
			<div className="role-selection-btns">
				<Link to="/trainee-booking" className="action-btn btn-time-slot">
					Trainee
				</Link>
				<br />
				<Link to="/volunteer-dash" className="action-btn btn-time-slot">
					Volunteer
				</Link>
			</div>
		</div>
	);
};

export default LandingPage;
