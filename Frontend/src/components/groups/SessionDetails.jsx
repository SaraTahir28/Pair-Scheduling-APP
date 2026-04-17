import { Clock, Video } from "lucide-react";

const SessionDetails = ({ activeVolunteerProps }) => {

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

      <div className="availableVolunteersDiv">
        <div className="avatar-row">
          <img src={activeVolunteerProps.img} className="avatar" />
        </div>

        <p>
          You are booking a session with <br></br>
          <strong>{activeVolunteerProps.name}</strong>
        </p>
      </div>
    </>
  );
};

export default SessionDetails;
