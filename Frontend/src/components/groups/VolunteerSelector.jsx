import React from "react";

const VolunteerSelector = ({
  volunteers,
  activeVolunteer,
  setActiveVolunteer,
}) => {
  const isActive = (volunteer) =>
    activeVolunteer && activeVolunteer.id === volunteer.id;

  return (
    <div className="volunteer-selector-div">
      <p className="volunteer-selector-title">Filter by volunteer</p>

      <div className="volunteer-selector-list">
        <div
          className={`volunteer-card volunteer-card-all ${
            activeVolunteer === null ? "selected" : ""
          }`}
          onClick={() => setActiveVolunteer(null)}
        >
          All volunteers
        </div>

        {volunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className={`volunteer-card ${
              isActive(volunteer) ? "selected" : ""
            }`}
            onClick={() =>
              isActive(volunteer)
                ? setActiveVolunteer(null)
                : setActiveVolunteer(volunteer)
            }
          >
            <img
              src={volunteer.img}
              className="volunteer-card-avatar"
              alt={volunteer.name}
            />
            <p className="volunteer-card-name">{volunteer.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerSelector;
