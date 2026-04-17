import { useState, useEffect } from "react";
import { ActionBtn, BackBtn } from "../elements/Button";
import VolunteerAvailabilityForm from "./VolunteerAvailabilityForm";
import api from "../../api/axiosClient";
import AddingSlotsBasket from "./AddingSlotsBasket";

const VolunteerAvailabilityManager = ({ volunteerId, onBackToDash }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalSlotRulesFromApi, setOriginalSlotRulesFromApi] = useState([]);
  const [slotRulesInBasket, setSlotRulesInBasket] = useState([]);

  useEffect(() => {
    api
      .get("/api/slot-rules/")
      .then((res) => {
        const specificVolunteerSlots = res.data.filter(
          (slot) => slot.volunteer_id === volunteerId
        );
        setOriginalSlotRulesFromApi(specificVolunteerSlots);
      })
      .catch((err) => console.log("Error fetching slots:", err));
  }, [volunteerId]);

  const startEditing = () => {
    setSlotRulesInBasket(originalSlotRulesFromApi);
    setIsEditing(true);
  };

  const addSlotToBasket = (newSlot) => {
    const updatedBasket = [...slotRulesInBasket, newSlot];
    setSlotRulesInBasket(updatedBasket);
  };

  const removeSlotFromBasket = (indexToRemove) => {
    const updatedBasket = slotRulesInBasket.filter(
      (_, i) => i !== indexToRemove
    );
    setSlotRulesInBasket(updatedBasket);
  };

  const sendNewSlotRulesToDb = () => {
    const onlyNewSlots = slotRulesInBasket.filter((slot) => !slot.id);

    const slotsFromApiToDelete = originalSlotRulesFromApi.filter(
      (ogSlot) =>
        !slotRulesInBasket.some((slotInBasket) => slotInBasket.id === ogSlot.id)
    );
    const deleteRequests = slotsFromApiToDelete.map((slot) =>
      api.delete(`/api/slot-rules/${slot.id}/`)
    );

    const postRequests = onlyNewSlots.map((slot) => {
      return api.post("/api/slot-rules/", {
        volunteer: volunteerId,
        start_time: slot.start_time,
        repeat_until: slot.repeat_until,
        group: "all",
      });
    });

    if (deleteRequests.length === 0 && postRequests.length === 0) {
      alert("No changes to save.");
      return;
    }

    const allRequestsForApi = [...deleteRequests, ...postRequests];

    Promise.all(allRequestsForApi)
      .then(() => {
        return api.get("/api/slot-rules/");
      })
      .then((res) => {
        const specificVolunteerSlots = res.data.filter((slot) => {
          return slot.volunteer_id === volunteerId;
        });
        setOriginalSlotRulesFromApi(specificVolunteerSlots);
        setSlotRulesInBasket([]);
        alert("Your availability has been updated.");
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error saving availability:", error);
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
              addedSlots={slotRulesInBasket}
              removeSlot={removeSlotFromBasket}
              saveAll={sendNewSlotRulesToDb}
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
            {originalSlotRulesFromApi.length > 0 && (
              <AddingSlotsBasket
                addedSlots={originalSlotRulesFromApi}
                title="Current availability"
              />
            )}
            {originalSlotRulesFromApi.length === 0 && (
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
