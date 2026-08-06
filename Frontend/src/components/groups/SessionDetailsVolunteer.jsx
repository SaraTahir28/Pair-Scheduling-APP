import { Calendar } from "lucide-react";

const VolunteerSessionDetails = ({
  onManageAvailabilityClick,
  user,
  showManageButton,
  isManageAvailabilityTabActive,
}) => {
  return (
    <div className="session-details-div">
      <h1>Welcome</h1>

      <div className="session-icon-div">
        <div className="session-icon-text-line">
          <p>
            You are logged in as <strong>{user?.name || "a Volunteer"}</strong>
          </p>
        </div>

        <div className="avatar-row mt-2">
          <img src={user?.img} className="avatar" alt="profile avatar" />
        </div>

        <div className="session-icon-text-line">
          {onManageAvailabilityClick && showManageButton && (
            <button
              className={
                isManageAvailabilityTabActive
                  ? "tab-btn-with-icon-active"
                  : "tab-btn-with-icon"
              }
              onClick={onManageAvailabilityClick}
              disabled={isManageAvailabilityTabActive}
            >
              <Calendar className="btn-icon" />
              {isManageAvailabilityTabActive
                ? "Managing availability"
                : "Manage my availability"}
            </button>
          )}
        </div>
        {showManageButton && !isManageAvailabilityTabActive && (
          <div className="session-icon-text-line px-2">
            <p>You can view and manage your availability for 1:1 sessions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerSessionDetails;
