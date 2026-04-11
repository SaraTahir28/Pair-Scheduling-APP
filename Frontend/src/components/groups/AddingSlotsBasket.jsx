import React from "react";
import { ActionBtn } from "../elements/Button";
import { X } from "lucide-react";

const AddingSlotsBasket = ({ addedSlots, removeSlot, saveAll }) => {
	if (!addedSlots || addedSlots.length === 0) {
		return null;
	}

	return (
		<div className="basket-container">
			<h3 className="basket-title">Entries to save:</h3>

			<div className="basket-list">
				{addedSlots.map((entry, index) => (
					<div className="basket-row" key={index}>
						<div className="flex items-center gap-4">
							{entry.regular ? (
								<span>Every {entry.weekday}</span>
							) : (
								<span>
									{`On ${entry.start_time
										.split("T")[0]
										.split("-")
										.reverse()
										.join("-")}
								`}
								</span>
							)}
							<span className="font-bold">
								{`at ${entry.start_time.split("T")[1].slice(0, 5)}`}
							</span>

							{entry.regular && (
								<span>
									{`(starting on ${entry.start_time
										.split("T")[0]
										.split("-")
										.reverse()
										.join("-")})`}
								</span>
							)}
						</div>
						<ActionBtn
							additionalBtnClass="btn-tertiary"
							onClick={() => removeSlot(index)}
						>
							✕
						</ActionBtn>
					</div>
				))}

					<ActionBtn
						additionalBtnClass="btn-tertiary"
						onClick={() => removeSlot(index)}
					>
						✕
					</ActionBtn>
				</div>
			))}

			<ActionBtn additionalBtnClass="btn-primary" onClick={saveAll}>
				Save all
			</ActionBtn>
		</div>
	);
};

export default AddingSlotsBasket;
