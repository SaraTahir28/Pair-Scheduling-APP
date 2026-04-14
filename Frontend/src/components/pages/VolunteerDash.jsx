import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { volunteersDetails, traineeDetails } from "../../data/UserData";
import { bookedSessions } from "../../data/BookedSessions";
import BookingCard from "../groups/BookingCard";
import SessionDetails from "../groups/SessionDetails";
import VolunteerEditSession from "../groups/VolunteerEditSession";
import VolunteerViewSession from "../groups/VolunteerViewSession";

import VolunteerAvailabilityForm from "../groups/VolunteerAvailabilityForm";
import { useAuth } from "../../AuthContext";
import duncanImg from "../../assets/duncan.png";
import api from "../../api/axiosClient";

const VolunteerDash = () => {
	const { id } = useParams();
	const { user } = useAuth();
	const editSessionMode = window.location.pathname.includes("edit");

	const activeVolunteer =
		volunteersDetails.find((v) => v.email === user?.email) || user;
	if (activeVolunteer && !activeVolunteer.img) {
		activeVolunteer.img = duncanImg;
	}

	const [allBookedSessionsForAllUsers, setAllBookedSessionsForAllUsers] =
		useState(bookedSessions);

	const [hasUserSetAvailability, setHasUserSetAvailability] = useState(false);
	const [temporaryAddedSlotsStorage, setTemporaryAddedSlotsStorage] = useState(
		[]
	);
	const volunteerSubmitedFormWithSlots = (newSlotObj) => {
		setTemporaryAddedSlotsStorage([...temporaryAddedSlotsStorage, newSlotObj]);
	};

	const sendVolunteerSlotsToDb = () => {
		console.log("Ready to send to db", temporaryAddedSlotsStorage);
		for (let i = 0; i < temporaryAddedSlotsStorage.length; i++) {
			let slotWeAreOn = temporaryAddedSlotsStorage[i];

			let objectToSendToBackend = {
				volunteer: slotWeAreOn.volunteer,
				start_time: slotWeAreOn.start_time,
				repeat_until: slotWeAreOn.repeat_until,
				group: "all",
			};

			api
				.post("/api/slot-rules/", objectToSendToBackend)
				.then(() => {
					console.log("Slot zapisany w bazie!");
					setHasUserSetAvailability(true);
					setTemporaryAddedSlotsStorage([]);
				})
				.catch((error) => console.log("Error:", error));
		}

		alert("Availability is saved.");
		setHasUserSetAvailability(true);
	};

	const activeVolunteerSessions = allBookedSessionsForAllUsers.filter(
		(session) => session.volunteerId === activeVolunteer.id
	);
	const renderedSessions = [];

	const saveEditedSession = (updatedSessionFromCard) => {
		const updatedSessions = allBookedSessionsForAllUsers.map((session) => {
			if (session.id === updatedSessionFromCard.id) {
				return updatedSessionFromCard;
			}
			return session;
		});
		setAllBookedSessionsForAllUsers(updatedSessions);
	};

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
	return (
		<div className="booking-box">
			<div className="session-details-col">
				<SessionDetails
					activeVolunteerProps={activeVolunteer}
					volunteerView={true}
				/>
			</div>
			<div className="bookings-col">
				{!hasUserSetAvailability && (
					<div className="">
						<p className="">
							Let's start by selecting your availability for 1:1 sessions.
						</p>

						<VolunteerAvailabilityForm
							volunteerId={activeVolunteer.id}
							mode="edit"
							whenFormSubmit={volunteerSubmitedFormWithSlots}
							addedSlots={temporaryAddedSlotsStorage}
							removeSlot={removeSlotFromTemporaryStorage}
							saveAll={sendVolunteerSlotsToDb}
						/>
					</div>
				)}

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
