import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
	return (
		<div className="landing-page">
			<h1>Welcome to the Booking App</h1>
			<p>I am a</p>

			<div className="role-selection-btns">
				<Link to="/trainee-booking" className="action-btn">
					Trainee
				</Link>

				<Link to="/volunteer-dash" className="action-btn">
					Volunteer
				</Link>
			</div>
		</div>
	);
};

export default LandingPage;
