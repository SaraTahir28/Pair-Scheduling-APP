import React from "react";
import { ActionBtn } from "../elements/Button"; // Upewnij się, że ścieżka do przycisku jest poprawna

const AddingSlotsBasket = ({ addedSlots, removeSlot, saveAll }) => {
	if (!addedSlots || addedSlots.length === 0) {
		return null;
	}

	return (
		<div className="booking-form-container">
			<h3 className="form-title">Entries to save:</h3>

			{addedSlots.map((entry, index) => (
				<div classBame="" key={index}>
					<p>Time: {entry.start_time.split("T")[1]}</p>

					{entry.regular === true ? (
						<p>
							<input
								type="checkbox"
								checked={true}
								readOnly
								className="form-checkbox"
							/>
							Recurring every {entry.weekday}
						</p>
					) : (
						<p>
							<input
								type="checkbox"
								checked={false}
								readOnly
								className="form-checkbox"
							/>
							On date: {entry.start_time.split("T")[0]}
						</p>
					)}

					<ActionBtn
						additionalBtnClass="btn-tertiary"
						onClick={() => removeSlot(index)}
					>
						✕
					</ActionBtn>
				</div>
			))}

			<ActionBtn onClick={saveAll}>Save All</ActionBtn>
		</div>
	);
};

export default AddingSlotsBasket;
