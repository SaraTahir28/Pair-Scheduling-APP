import React from "react";
import {
  CheckCircle2,
  User,
  Calendar,
  Globe,
  Video,
  Clock,
} from "lucide-react";

const BookingConfirmation = ({
  selectedDateObj,
  selectedTime,
  volunteerProps,
}) => {
  const formattedDate = selectedDateObj.toLocaleDateString();

  return (
    <div className="confirmation-container">
      <img
        src={volunteerProps?.img}
        alt="Volunteer Avatar"
        className="avatar-conf"
      />

      <div className="confirmation-header">
        <h2 className="confirmation-title">
          <CheckCircle2 className="confirmation-icon" />
          <span>You are scheduled</span>
        </h2>
        <p className="confirmation-subtitle">
          A calendar invitation has been sent to your email address.
        </p>
      </div>
      <div className="confirmation-details-card">
        <h3 className="role-title">Your 1:1 session details</h3>

        <div className="confirmation-detail-row">
          <User className="confirmation-detail-icon" />
          <span>{volunteerProps?.name}</span>
        </div>

        <div className="confirmation-detail-row">
          <Calendar className="confirmation-detail-icon" />
          <span>
            {formattedDate} at {selectedTime}
          </span>
        </div>
        <div className="confirmation-detail-row">
          <Clock className="confirmation-detail-icon" />
          <span>1 hour</span>
        </div>
        {/* hiding this as it timezone will be added in nice to haves */}
        {/* <div className="confirmation-detail-row">
					<Globe className="confirmation-detail-icon" />
					<span>UK, Ireland, Lisbon Time</span>
				</div> */}

        <div className="confirmation-detail-row">
          <Video className="confirmation-detail-icon" />
          <span className="text-muted">Google Meet link</span>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
