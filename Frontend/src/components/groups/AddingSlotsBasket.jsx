import { ActionBtn } from "../elements/Button";
import { X } from "lucide-react";
import { formatLocalDate, formatLocalTime } from "../../utilities/dateTime";

const toDisplayDate = (isoString) =>
	formatLocalDate(new Date(isoString)).split("-").reverse().join("-");

const toDisplayTime = (isoString) => formatLocalTime(new Date(isoString));

const AddingSlotsBasket = ({
	addedSlots,
	removeSlot,
	saveAll,
	layout = "bottom",
	title = "Current selection to save",
}) => {
	if (!addedSlots || addedSlots.length === 0) {
		return null;
	}

	return (
		<div className="basket-container">
			<h3 className="basket-title">{title}</h3>

			<div className="basket-list">
				{addedSlots.map((entry, index) => (
					<div className="basket-row" key={index}>
						<div className="basket-entries">
							{entry.regular ? (
								<span>Every {entry.weekday} </span>
							) : (
								<span>{`On ${toDisplayDate(entry.start_time)} `}</span>
							)}
							<span className="font-bold">
								{`at ${toDisplayTime(entry.start_time)}`}
							</span>

							{entry.regular && (
								<span>
									{`(starting on ${toDisplayDate(
										entry.start_time
									)} until ${entry.repeat_until
										.split("-")
										.reverse()
										.join("-")})`}
								</span>
							)}
						</div>
						{removeSlot && (
							<ActionBtn
								additionalBtnClass="btn-tertiary"
								onClick={() => removeSlot(index)}
							>
								<X className="basket-delete-btn" />
							</ActionBtn>
						)}
					</div>
				))}
			</div>

			{saveAll && (
				<ActionBtn additionalBtnClass="btn-primary" onClick={saveAll}>
					Save all
				</ActionBtn>
			)}
		</div>
	);
};

export default AddingSlotsBasket;
