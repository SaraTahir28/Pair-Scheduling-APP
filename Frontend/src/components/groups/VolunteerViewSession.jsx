import React, { useState } from "react";
import { Clock, Video } from "lucide-react";
import { ActionBtn } from "../elements/Button";
import { Link, useParams } from "react-router-dom";
import { bookedSessions } from "../../data/BookedSessions";
import { traineeDetails } from "../../data/UserData";

const ViewBooking = ({ deleteBookedSession }) => {
  const { id } = useParams();
  const session = bookedSessions.find((s) => String(s.id) === id);
  const trainee = traineeDetails.find((t) => t.id === session?.traineeId);

  const [isUserClickingDelete, setIsUserClickingDelete] = useState(false);

  if (!session || !trainee) return <div className="p-4">Session not found</div>;

  if (isUserClickingDelete) {
    return (
      <div className="confirm-delete-div">
        <p>Do you want to delete this session?</p>
        <ActionBtn
          additionalBtnClass="btn-destructive"
          onClick={deleteBookedSession}
        >
          Yes
        </ActionBtn>
        <ActionBtn
          additionalBtnClass="btn-secondary"
          onClick={() => setIsUserClickingDelete(false)}
        >
          Cancel
        </ActionBtn>
      </div>
    );
  }

  //edit is moved from app
  // if (isEditing) {
  //  return (
  //      <div className="booking-card-div">
  //          <div className="booking-card">
  //              <h3>Edit Session</h3>
  //              <form className="edit-session-form" onSubmit={handleEditSubmit}>
  //                  <label>
  //                      New Date:
  //                      <input type="date" name="new_date" defaultValue={session.date} />
  //                  </label>
  //                  <br />
  //                  <label>
  //                      New Time:
  //                      <input type="time" name="new_time" defaultValue={session.time} />
  //                  </label>
  //                  <br />
  //                  <div className="booking-card-btns">
  //                      <button type="submit" className="action-btn save-btn">
  //                          Save
  //                      </button>
  //                      <ActionBtn
  //                          additionalBtnClass="btn-secondary"
  //                          onClick={() => setIsEditing(false)}
  //                      >
  //                          Cancel
  //                      </ActionBtn>
  //                  </div>
  //              </form>
  //          </div>
  //      </div>
  //  );
  // }
  //if not clicked delete render the div with booked session
  return (
    <div className="booking-card-div">
      <h2 className="bookings-heading-selectdt">View session details</h2>

      <div className="view-booking-details-card">
        <div className="session-plus-trainee-details-div">
          <div>
            <img
              src={trainee.img}
              alt={
                trainee.name
                  ? `Profile picture of ${trainee.name}`
                  : "Trainee profile picture"
              }
              className="avatar"
            />

            <p>
              Your session is with <br></br>
              <strong>{trainee.name}</strong>
            </p>
          </div>

          <div className="session-details-div-booking-card">
            <div className="session-icon-text-line">
              <Clock className="session-icon" />
              <p>
                {session.date} at {session.time}
              </p>
            </div>

            <div className="session-icon-text-line">
              <Video className="session-icon" />
              <a
                href={session.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="video-link"
              >
                Google Meet Link
              </a>
            </div>
          </div>
        </div>

        <div className="booking-card-btns">
          <Link
            to={`/volunteer-dash/bookings/${session.id}`}
            className="action-btn btn-secondary"
          >
            View
          </Link>
          <Link
            to={`/volunteer-dash/bookings/${session.id}/edit`}
            className="action-btn btn-secondary"
          >
            Edit
          </Link>

          <ActionBtn
            additionalBtnClass="btn-tertiary"
            onClick={() => setIsUserClickingDelete(true)}
          >
            Delete
          </ActionBtn>
        </div>
      </div>
    </div>
  );
};

export default ViewBooking;
