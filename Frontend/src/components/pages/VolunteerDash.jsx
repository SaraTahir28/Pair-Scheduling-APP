import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { volunteersDetails, traineeDetails } from "../../data/UserData";
import { bookedSessions } from "../../data/BookedSessions";
import BookingCard from "../groups/BookingCard";
import SessionDetails from "../groups/SessionDetails";
import VolunteerEditSession from "../groups/VolunteerEditSession";
import VolunteerViewSession from "../groups/VolunteerViewSession";
import VolunteerAvailabilityManager from "../groups/VolunteerAvailabilityManager";

import VolunteerAvailabilityForm from "../groups/VolunteerAvailabilityForm";
import { useAuth } from "../../AuthContext";
import api from "../../api/axiosClient";

const VolunteerDash = () => {
	const { id } = useParams();
	const { user } = useAuth();
	const editSessionMode = window.location.pathname.includes("edit");

	const activeVolunteer =
		volunteersDetails.find((v) => v.email === user?.email) || user;
	if (activeVolunteer && !activeVolunteer.img) {
		activeVolunteer.img = "/placeholder.png";
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
	const [showManager, setShowManager] = useState(false);

	useEffect(() => {
		if (activeVolunteer?.id) {
			api
				.get("/api/slot-rules/")
				.then((res) => {
					const mySlots = res.data.filter(
						(slot) => slot.volunteer_id === activeVolunteer.id
					);
					if (mySlots.length > 0) {
						setHasUserSetAvailability(true);
					}
				})
				.catch((err) => console.log("Error checking API:", err));
		}
	}, [activeVolunteer?.id]);

	const sendVolunteerSlotsToDb = () => {
		Promise.all(
			temporaryAddedSlotsStorage.map((slot) =>
				api.post("/api/slot-rules/", {
					start_time: slot.start_time,
					repeat_until: slot.repeat_until,
					volunteer: activeVolunteer.id,
					group: "all",
				})
			)
		)
			.then(() => {
				setHasUserSetAvailability(true);
				setTemporaryAddedSlotsStorage([]);
				alert("Availability is saved.");
			})
			.catch((error) => {
				console.error("Error saving slots:", error);
				alert("Failed to save availability. Please try again.");
			});
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

		// const objectToSendToBackendToDelete = {
		// 	session_id: idToDelete,
		// };

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
					onManageAvailabilityClick={() => setShowManager(true)}
				/>
			</div>
			<div className="bookings-col">
				{!hasUserSetAvailability && (
					<div className="">
						<p className="">
							Let&apos;s start by selecting your availability for 1:1 sessions.
						</p>

						<VolunteerAvailabilityForm
							volunteerId={activeVolunteer.id}
							mode="onboarding"
							whenFormSubmit={volunteerSubmitedFormWithSlots}
							addedSlots={temporaryAddedSlotsStorage}
							removeSlot={removeSlotFromTemporaryStorage}
							saveAll={sendVolunteerSlotsToDb}
						/>
					</div>
				)}

				{hasUserSetAvailability && !showManager && (
					<>
						{id && editSessionMode && (
							<VolunteerEditSession
								sessions={allBookedSessionsForAllUsers}
								onSave={saveEditedSession}
							/>
						)}

						{id && !editSessionMode && (
							<VolunteerViewSession sessions={allBookedSessionsForAllUsers} />
						)}

						{!id && (
							<div className="all-cards-container">
								<h2 className="bookings-heading-selectdt">Upcoming sessions</h2>
								{renderedSessions.length > 0 ? (
									renderedSessions
								) : (
									<p>You do not have any booked sessions.</p>
								)}
							</div>
						)}
					</>
				)}

				{hasUserSetAvailability && showManager && (
					<VolunteerAvailabilityManager
						volunteerId={activeVolunteer.id}
						onBackToDash={() => setShowManager(false)}
					/>
				)}
			</div>
		</div>
	);
};

export default VolunteerDash;
