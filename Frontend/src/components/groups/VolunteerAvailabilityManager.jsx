import { useState, useEffect } from "react";
import { ActionBtn, BackBtn } from "../elements/Button";
import VolunteerAvailabilityForm from "./VolunteerAvailabilityForm";
import api from "../../api/axiosClient";
import AddingSlotsBasket from "./AddingSlotsBasket";

const VolunteerAvailabilityManager = ({ volunteerId, onBackToDash }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [myOldSlotRulesFromApi, setMyOldSlotRulesFromApi] = useState([]);
	const [slotRulesInBasketDraft, setSlotRulesInBasketDraft] = useState([]);

	useEffect(() => {
		api
			.get("/api/slot-rules/")
			.then((res) => {
				const mySlots = res.data.filter(
					(slot) => slot.volunteer_id === volunteerId
				);
				setMyOldSlotRulesFromApi(mySlots);
			})
			.catch((err) => console.log("Error fetching slots:", err));
	}, [volunteerId]);

	const startEditing = () => {
		setSlotRulesInBasketDraft(myOldSlotRulesFromApi);
		setIsEditing(true);
	};

	const addSlotToBasket = (newSlotObj) => {
		setSlotRulesInBasketDraft([...slotRulesInBasketDraft, newSlotObj]);
	};

	const removeSlotFromBasket = (indexToRemove) => {
		const slotRuleToRemoveFromApiOrUi = slotRulesInBasketDraft[indexToRemove];
		if (slotRuleToRemoveFromApiOrUi.id) {
			api
				.delete(`/api/slot-rules/${slotRuleToRemoveFromApiOrUi.id}/`)
				.then(() => {
					const updatedSlotRuleBasketNotYetSent = slotRulesInBasketDraft.filter(
						(_, i) => i !== indexToRemove
					);
					setSlotRulesInBasketDraft(updatedSlotRuleBasketNotYetSent);
					setMyOldSlotRulesFromApi(updatedSlotRuleBasketNotYetSent);
				})
				.catch((err) => {
					console.error("Failed to delete slot rule:", err);
					alert("Could not delete the slot. Please try again.");
				});
		} else {
			const updatedSlotRuleBasketNotYetSent = slotRulesInBasketDraft.filter(
				(_, i) => i !== indexToRemove
			);
			setSlotRulesInBasketDraft(updatedSlotRuleBasketNotYetSent);
		}
	};

	const sendNewSlotsToDb = () => {
		const onlyNewSlots = slotRulesInBasketDraft.filter((slot) => !slot.id);

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
			.then((responses) => {
				const newlyCreatedSlots = responses.map((res) => res.data);
				const updatedSlotsCollection = [
					...myOldSlotRulesFromApi,
					...newlyCreatedSlots,
				];
				setMyOldSlotRulesFromApi(updatedSlotsCollection);
				setSlotRulesInBasketDraft([]);
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
							addedSlots={slotRulesInBasketDraft}
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
						{myOldSlotRulesFromApi.length > 0 && (
							<AddingSlotsBasket
								addedSlots={myOldSlotRulesFromApi}
								title="Current availability"
							/>
						)}
						{myOldSlotRulesFromApi.length === 0 && (
							<div className="basket-container">
								<h3 className="basket-title">Current availability</h3>
								<div className="basket-list">
									<p>
										No availability sessions set. You can add some by clicking
										&apos;Edit&apos; below.
									</p>
								</div>
							</div>
						)}

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
