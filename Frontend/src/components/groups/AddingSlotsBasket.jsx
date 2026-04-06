import React from "react";
import { ActionBtn } from "../elements/Button";

const AddingSlotsBasket = ({ addedSlots, removeSlot, saveAll }) => {
	if (!addedSlots || addedSlots.length === 0) {
		return null;
	}

	return (
		<div className="booking-form-container">
			<h3 className="form-title">Entries to save:</h3>

			{addedSlots.map((entry, index) => (
				<div className="slots-basket-row" key={index}>
					<span>Time: {entry.start_time.split("T")[1].slice(0, 5)}</span>

					{entry.regular === true ? (
						<span>
							<input
								type="checkbox"
								checked={true}
								readOnly
								className="form-checkbox"
							/>
							Recurring every {entry.weekday}
						</span>
					) : (
						<span>
							On date:
							{entry.start_time.split("T")[0].split("-").reverse().join("-")}
						</span>
					)}

					<ActionBtn
						additionalBtnClass="btn-tertiary"
						onClick={() => removeSlot(index)}
					>
						✕
					</ActionBtn>
				</div>
			))}

			<ActionBtn additionalBtnClass="btn-primary" onClick={saveAll}>
				Save All
			</ActionBtn>
		</div>
	);
};

export default AddingSlotsBasket;
