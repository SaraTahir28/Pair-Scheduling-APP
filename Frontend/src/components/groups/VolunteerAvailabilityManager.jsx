import React, { useState, useEffect } from "react";
import { ActionBtn, BackBtn } from "../elements/Button";
import VolunteerAvailabilityForm from "./VolunteerAvailabilityForm";
import api from "../../api/axiosClient";

const VolunteerAvailabilityManager = ({ volunteerId, onBackToDash }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [myOldSlotsFromApi, setMyOldSlotsFromApi] = useState([]);
	const [slotsInBasket, setSlotsInBasket] = useState([]);

	useEffect(() => {
		api
			.get("/api/available-slots/")
			.then((res) => {
				const mySlots = res.data.filter(
					(slot) => slot.volunteer_id === volunteerId
				);
				setMyOldSlotsFromApi(mySlots);
			})
			.catch((err) => console.log("Error fetching slots:", err));
	}, [volunteerId]);

	const startEditing = () => {
		setSlotsInBasket(myOldSlotsFromApi);
		setIsEditing(true);
	};

	const addSlotToBasket = (newSlotObj) => {
		setSlotsInBasket([...slotsInBasket, newSlotObj]);
	};

	const removeSlotFromBasket = (indexToRemove) => {
		setSlotsInBasket(
			slotsInBasket.filter((_, index) => index !== indexToRemove)
		);
	};

	const sendNewSlotsToDb = () => {
		const onlyNewSlots = slotsInBasket.filter((slot) => !slot.id);

		if (onlyNewSlots.length === 0) {
			alert("No new slots added.");
			setIsEditing(false);
			return;
		}

		Promise.all(
			onlyNewSlots.map((slot) =>
				api.post("/api/slot-rules/", {
					start_time: slot.start_time,
					repeat_until: slot.repeat_until,
					group: "all",
				})
			)
		)
			.then(() => {
				const updatedSlotsCollection = [...myOldSlotsFromApi, ...onlyNewSlots];
				setMyOldSlotsFromApi(updatedSlotsCollection);
				setSlotsInBasket([]);
				alert("Availability updated successfully!");
				setIsEditing(false);
			})
			.catch((error) => {
				console.error("Error saving slots:", error);
				alert("Failed to save availability. Please try again.");
			});
	};

	return (
		<div className="availability-outer-div">
			{isEditing && (
				<>
					<div className="availability-header-container">
						<div className="availability-header-row">
							<h2 className="edit-form-title">Edit my availability</h2>
							<BackBtn onClick={() => setIsEditing(false)} />
						</div>
						<div>
							<p className="edit-form-p">
								View the time slots you offer for 1:1 sessions.
							</p>
						</div>
					</div>

					<div className="edit-mode-container">
						<VolunteerAvailabilityForm
							volunteerId={volunteerId}
							mode="edit"
							whenFormSubmit={addSlotToBasket}
							addedSlots={slotsInBasket}
							removeSlot={removeSlotFromBasket}
							saveAll={sendNewSlotsToDb}
						/>
					</div>
				</>
			)}

			{!isEditing && (
				<>
					<div className="availability-header-container">
						<div className="availability-header-row">
							<h2 className="edit-form-title">My availability</h2>
							<BackBtn onClick={onBackToDash} />
						</div>
						<div>
							<p className="edit-form-p">
								Manage the time slots you offer for 1:1 sessions.
							</p>
						</div>
					</div>

					<div>
						<div className="basket-container-availability">
							<div className="basket-list">
								{myOldSlotsFromApi.length > 0 &&
									myOldSlotsFromApi.map((entry, index) => (
										<div className="basket-row" key={index}>
											<div className="basket-entries">
												{entry.regular && <span>Every {entry.weekday}</span>}
												{!entry.regular && (
													<span>
														{`On ${entry.start_time
															.split("T")[0]
															.split("-")
															.reverse()
															.join("-")}
                          `}
													</span>
												)}
												<span className="">
													{` at ${entry.start_time.split("T")[1].slice(0, 5)}`}
												</span>

												{entry.regular && entry.repeat_until && (
													<span>
														{`(until ${entry.repeat_until
															.split("-")
															.reverse()
															.join("-")})`}
													</span>
												)}
											</div>
										</div>
									))}

								{myOldSlotsFromApi.length === 0 && (
									<p>
										No availability sessions set. You can add some by clicking
										`Edit`.
									</p>
								)}
							</div>
						</div>

						<ActionBtn
							additionalBtnClass="btn-primary mt-4"
							onClick={startEditing}
						>
							Edit my slots
						</ActionBtn>
					</div>
				</>
			)}
		</div>
	);
};

export default VolunteerAvailabilityManager;
