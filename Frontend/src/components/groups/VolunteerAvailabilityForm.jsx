import React, { useState } from "react";
import { ActionBtn } from "../elements/Button";
import AddingSlotsBasket from "./AddingSlotsBasket";

const VolunteerAvailabilityForm = ({
	whenFormSubmit,
	volunteerId,
	mode,
	addedSlots,
	removeSlot,
	saveAll,
}) => {
	const getDayName = (dateStr) => {
		return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
			weekday: "long",
		});
	};
	//this is with repeated date initially set to off
	const [isRecurring, setIsRecurring] = useState(false);
	const [specificDate, setSpecificDate] = useState(
		new Date().toISOString().split("T")[0]
	);
	const [dropdownSelectionDay, setDropdownSelectionDay] = useState("");
	const [startTime, setStartTime] = useState("09:00");
	// const [endTime, setEndTime] = useState(""); //TODO nice to haves

	const matchDateToDaySelectedIfRecurring = (userSelectedDayName) => {
		if (!userSelectedDayName || !specificDate) return;

		const daysToNums = {
			Sunday: 0,
			Monday: 1,
			Tuesday: 2,
			Wednesday: 3,
			Thursday: 4,
			Friday: 5,
			Saturday: 6,
		};

		const whatNumIsDay = daysToNums[userSelectedDayName];
		let userSelectedDate = new Date(specificDate + "T00:00:00");

		while (userSelectedDate.getDay() !== whatNumIsDay) {
			userSelectedDate.setDate(userSelectedDate.getDate() + 1);
		}
		const fixedDateStr = userSelectedDate.toISOString().split("T")[0];
		setSpecificDate(fixedDateStr);
	};

	const checkInputsValid = (e) => {
		e.preventDefault();

		if (!isRecurring && !specificDate) {
			alert("Please pick a date.");
			return;
		}

		if (isRecurring && !dropdownSelectionDay) {
			alert("Please select a day of the week.");
			return;
		}

		if (startTime === "") {
			alert("please enter a start time.");
			return;
		}

		// dates logic
		// const isToday = new Date().toISOString().split("T")[0];
		// const startDate = isRecurring ? isToday : specificDate;
		const timeWithDate = `${specificDate}T${startTime}:00`;

		// TODO - nice to haves
		// for now no tim limit
		// const futureDate = new Date();
		// futureDate.setMonth(today.getMonth() + 3);
		// const endDateStr = isRecurring
		// 	? futureDate.toISOString().split("T")[0]
		// 	: startDateStr;

		// build slotsObj
		const slotsObj = {
			volunteer_id: volunteerId,
			regular: isRecurring,
			weekday: isRecurring ? dropdownSelectionDay : null,
			start_time: timeWithDate,
			repeat_until: null,
			// TODO repeat_until: isRecurring ? futureDate.toISOString() : null,
			// endTime: endTime, // this is for future now no end
			group: null,
		};
		console.log("obj for db", slotsObj);
		whenFormSubmit(slotsObj);
		setDropdownSelectionDay("");
		setStartTime("09:00");
		setIsRecurring(false);
	};

	return (
		<>
			<div className="booking-form-container">
				<form onSubmit={checkInputsValid}>
					<h2 className="form-title">Select your availability</h2>
					<div className="form-input-group-row">
						<input
							className="form-checkbox"
							type="checkbox"
							checked={isRecurring}
							onChange={(e) => setIsRecurring(e.target.checked)}
						/>
						<label className="form-label">recurring weekly?</label>
					</div>

					{!isRecurring && (
						<div className="form-input-group">
							<label className="form-label">Select date</label>
							<input
								className="form-input"
								type="date"
								disabled={mode === "view"}
								//TODO admin view later and view selected availability
								value={specificDate}
								onChange={(e) => setSpecificDate(e.target.value)}
							/>
						</div>
					)}
					{isRecurring && (
						<>
							<div className="form-input-group">
								<label className="form-label">Starting on</label>
								<input
									className="form-input"
									type="date"
									disabled={mode === "view"}
									value={specificDate}
									onChange={(e) => {
										const newDate = e.target.value;
										setSpecificDate(newDate);
										setDropdownSelectionDay(getDayName(newDate));
									}}
								/>
							</div>
							<div className="form-input-group">
								<label className="form-label">Repeat every</label>
								<select
									className="form-input"
									disabled={mode === "view"}
									value={dropdownSelectionDay}
									onChange={(e) => {
										setDropdownSelectionDay(e.target.value);
										matchDateToDaySelectedIfRecurring(e.target.value);
									}}
								>
									<option value="">Select...</option>
									<option value="Monday">Monday</option>
									<option value="Tuesday">Tuesday</option>
									<option value="Wednesday">Wednesday</option>
									<option value="Thursday">Thursday</option>
									<option value="Friday">Friday</option>
									<option value="Saturday">Saturday</option>
									<option value="Sunday">Sunday</option>
								</select>
							</div>
						</>
					)}

					<div className="form-input-group">
						<label className="form-label">Time</label>
						<input
							className="form-input"
							type="time"
							disabled={mode === "view"}
							value={startTime}
							onChange={(e) => setStartTime(e.target.value)}
						/>
					</div>

					{mode !== "view" && (
						<ActionBtn type="submit" additionalBtnClass={"btn-primary"}>
							Add to list
						</ActionBtn>
					)}
				</form>
			</div>

			<div>
				<AddingSlotsBasket
					addedSlots={addedSlots}
					removeSlot={removeSlot}
					saveAll={saveAll}
				/>
			</div>
		</>
	);
};

export default VolunteerAvailabilityForm;
