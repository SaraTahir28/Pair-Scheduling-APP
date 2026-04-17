import React, { useState } from "react";
import { ActionBtn } from "../elements/Button";

const BookingForm = ({ whenFormSubmit, trainee }) => {
  const name = trainee?.name;

  const [agenda, setAgenda] = useState("");
  const checkInputsValid = (e) => {
    e.preventDefault();
    const cleanAgenda = agenda.trim();

    if (cleanAgenda.length < 10 || cleanAgenda.length > 500) {
      alert("Agenda should be between 10 and 500 chars.");
      return;
    }

    whenFormSubmit({
      agenda: cleanAgenda,
    });
  };

  return (
    <div className="booking-form-container">
      <h2 className="form-title">Your session details</h2>
      <form>
        <div className="form-input-group">
          <label className="form-label">
            {name
              ? `Okay ${name}, what would you like to discuss?`
              : `What would you like to discuss?`}
          </label>
          <textarea
            className="form-input"
            placeholder="Share the specific topic you would like to cover."
            value={agenda}
            rows="6"
            onChange={(e) => setAgenda(e.target.value)}
          />
        </div>

        <ActionBtn additionalBtnClass="btn-primary" onClick={checkInputsValid}>
          Book meeting
        </ActionBtn>
      </form>
    </div>
  );
};

export default BookingForm;
