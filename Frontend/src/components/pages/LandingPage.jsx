import React from "react";
import { Link } from "react-router-dom";
import { Laptop, Users } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1 className="landing-tile">Welcome to the Pair Scheduling App</h1>
      <p>Please select your role to continue</p>

      <div className="role-selection-grid">
        <Link to="/trainee-booking" className="role-tile role-tile-trainee">
          <div className="role-title-icon">
            <Laptop size={32} strokeWidth={2} />
          </div>
          <h2 className="title-lg">I am a Trainee</h2>
          <p>Book a 1:1 pair programming session with a CYF volunteer.</p>
        </Link>
        <Link to="/volunteer-dash" className="role-tile role-tile-volunteer">
          <div className="role-title-icon">
            <Users size={32} strokeWidth={2} />
          </div>
          <h2 className="title-lg">I am a Volunteer</h2>
          <p>Manage your availability and view upcoming sessions.</p>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
