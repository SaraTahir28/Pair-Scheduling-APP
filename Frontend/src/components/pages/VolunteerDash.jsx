import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { volunteersDetails, traineeDetails } from "../../data/UserData";
import { bookedSessions } from "../../data/BookedSessions";
import BookingCard from "../groups/BookingCard";
import SessionDetails from "../groups/SessionDetails";
import VolunteerEditSession from "../pages/VolunteerEditSession";

const VolunteerDash = () => {
	const { id } = useParams();
	//here we select state of activeVolunteer that will be passed to session details volunteers div
	//for now Duncan is an active volunteer
	const [activeVolunteer, setActiveVolunteer] = useState(
		volunteersDetails.find((volunteer) => volunteer.id === 1)
	);

	const [allBookedSessionsForAllUsers, setAllBookedSessionsForAllUsers] =
		useState(bookedSessions);

	// grab all sessions for active user
	const activeVolunteerSessions = allBookedSessionsForAllUsers.filter(
		(session) => session.volunteerId === activeVolunteer.id
	);
	//set up where all booked sessions will go on cards
	const renderedSessions = [];

	//for now this is for volunteer only bc trainee will have limitations of times and will see rerender of cal + times
	const saveEditedSession = (updatedSessionFromCard) => {
		const updatedSessions = allBookedSessionsForAllUsers.map((session) => {
			if (session.id === updatedSessionFromCard.id) {
				return updatedSessionFromCard;
			}
			return session;
		});
		// rerender
		setAllBookedSessionsForAllUsers(updatedSessions);
	};

	//function for deleting booked session sent as props to BookingCard.jsx, runs when delete is confirmed
	// for the id we want to delete - grab all other ids and pass to update state
	const deleteBookedSession = (idToDelete) => {
		const varPassToUpdateStateBookedSessions =
			allBookedSessionsForAllUsers.filter(
				(session) => session.id !== idToDelete
			);
		setAllBookedSessionsForAllUsers(varPassToUpdateStateBookedSessions);

		const objectToSendToBackendToDelete = {
			session_id: idToDelete,
		};

		// add delete route
		//  fetch("http://localhost:8000/api/confirm-address-delete-booking/", {
		//      method: "DELETE",
		//      headers: {
		//          "Content-Type": "application/json",
		//      },
		//      body: JSON.stringify(objectToSendToBackendToDelete),
		//  })
		//      .then((response) => {
		//          if (response.ok) {
		//              console.log("session removed from db");
		//          }
		//      })
		//      .catch((error) => console.log("Error:", error));
	};

	//check all sessions from active vol and find id and match to traineeDetails by id
	activeVolunteerSessions.forEach((session) => {
		traineeDetails.forEach((trainee) => {
			if (trainee.id === session.traineeId) {
				renderedSessions.push(
					<BookingCard
						key={session.id}
						trainee={trainee}
						session={session}
						deleteBookedSession={() => deleteBookedSession(session.id)}
						saveEditedSession={saveEditedSession}
					/>
				);
			}
		});
	});

	return (
		<div className="booking-box">
			<div className="session-details-col">
				<SessionDetails activeVolunteerProps={activeVolunteer} />
			</div>
			<div className="timeslot-col">
				{id ? (
					<VolunteerEditSession />
				) : (
					<>
						<h2>Upcoming sessions</h2>
						<div className="all-cards-container">
							{renderedSessions.length > 0 ? (
								renderedSessions
							) : (
								<p>You do not have any booked sessions.</p>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default VolunteerDash;
