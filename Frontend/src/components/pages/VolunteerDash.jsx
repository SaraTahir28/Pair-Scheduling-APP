import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { volunteersDetails, traineeDetails } from "../../data/UserData";
import { bookedSessions } from "../../data/BookedSessions";
import BookingCard from "../groups/BookingCard";
import SessionDetails from "../groups/SessionDetails";
import VolunteerEditSession from "../groups/VolunteerEditSession";
import VolunteerViewSession from "../groups/VolunteerViewSession";

import VolunteerAvailabilityForm from "../groups/VolunteerAvailabilityForm";
import { ActionBtn } from "../elements/Button";

const VolunteerDash = () => {
	const { id } = useParams();

	const editSessionMode = window.location.pathname.includes("edit");

	//here we select state of activeVolunteer that will be passed to session details volunteers div
	//for now Duncan is an active volunteer
	const [activeVolunteer, setActiveVolunteer] = useState(
		volunteersDetails.find((volunteer) => volunteer.id === 1)
	);

	const [allBookedSessionsForAllUsers, setAllBookedSessionsForAllUsers] =
		useState(bookedSessions);

	//adding the step of adding slots before form is sent
	const [hasUserSetAvailability, setHasUserSetAvailability] = useState(false);
	const [temporaryAddedSlotsStorage, setTemporaryAddedSlotsStorage] = useState(
		[]
	);
	const volunteerSubmitedFormWithSlots = (newSlotObj) => {
		setTemporaryAddedSlotsStorage([...temporaryAddedSlotsStorage, newSlotObj]);
	};

	const sendVolunteerSlotsToDb = () => {
		console.log("Ready to send to db", temporaryAddedSlotsStorage);
		alert("Availability is saved.");

		setHasUserSetAvailability(true);
	};

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
	const removeSlotFromTemporaryStorage = (indexToRemove) => {
		setTemporaryAddedSlotsStorage(
			temporaryAddedSlotsStorage.filter((_, index) => index !== indexToRemove)
		);
	};
	// once completed adding slots
	return (
		<div className="booking-box">
			<div className="session-details-col">
				<SessionDetails
					activeVolunteerProps={activeVolunteer}
					volunteerView={true}
				/>
			</div>
			<div className="bookings-col">
				{/* onboarding if slots are not selected - form shows */}
				{!hasUserSetAvailability && (
					<div className="">
						{/* <h1 className="form-title">Welcome {activeVolunteer.name}!</h1> */}
						<p className="">
							Let's start by selecting your availability for 1:1 sessions.
						</p>

						<VolunteerAvailabilityForm
							volunteerId={activeVolunteer.id}
							mode="edit"
							whenFormSubmit={volunteerSubmitedFormWithSlots}
						/>

						{/* slots already added by the volunteer show here */}
						{temporaryAddedSlotsStorage.length > 0 && (
							<div className="saved-entries-card">
								<h3>Entries to save:</h3>

								{/* React bierze koszyk i dla każdego wpisu rysuje zwykłego diva */}
								{temporaryAddedSlotsStorage.map((entry, index) => (
									<div key={index}>
										<p>Time: {entry.start_time.split("T")[1]}</p>

										{entry.regular === true ? (
											<p>
												<input type="checkbox" checked={true} readOnly />
												Recurring every: {entry.weekday}
											</p>
										) : (
											<p>
												<input type="checkbox" checked={false} readOnly />
												Specific date: {entry.start_time.split("T")[0]}
											</p>
										)}
									</div>
								))}

								<ActionBtn onClick={sendVolunteerSlotsToDb}>Save All</ActionBtn>
							</div>
						)}
					</div>
				)}
				{/* view after adding sessions */}
				{hasUserSetAvailability && (
					<>
						{id ? (
							editSessionMode ? (
								<VolunteerEditSession
									sessions={allBookedSessionsForAllUsers}
									onSave={saveEditedSession}
								/>
							) : (
								<VolunteerViewSession sessions={allBookedSessionsForAllUsers} />
							)
						) : (
							<>
								<div className="all-cards-container">
									<h2 className="bookings-heading-selectdt">
										Upcoming sessions
									</h2>
									{renderedSessions.length > 0 ? (
										renderedSessions
									) : (
										<p>You do not have any booked sessions.</p>
									)}
								</div>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default VolunteerDash;
