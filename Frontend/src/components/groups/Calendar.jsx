import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const DayDot = ({
	children,
	isSelected,
	isAvailable,
	isUnavailable,
	onClick,
}) => {
	let className = "cal-day";
	if (isSelected) className += " cal-day-selected";
	else if (isAvailable) className += " cal-day-available";
	else if (isUnavailable) className += " cal-day-unavailable";

	return (
		<button onClick={onClick} className={className}>
			{children}
		</button>
	);
};

const Calendar = ({
	selectedDateProps,
	setSelectedDateProps,
	availableDates = [],
}) => {
	const setDefaultMonthView = new Date();

	const [currentDate, funcToChangeMonth] = useState(setDefaultMonthView);

	const month = currentDate.getMonth();
	const year = currentDate.getFullYear();

	const nextMonth = () => {
		funcToChangeMonth(new Date(year, month + 1, 1));
	};
	const prevMonth = () => {
		funcToChangeMonth(new Date(year, month - 1, 1));
	};

	const firstDay = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const numOfEmptyFieldsBeforeFirstDay = (firstDay.getDay() + 6) % 7;

	const emptyDaySquares = [];
	for (let i = 0; i < numOfEmptyFieldsBeforeFirstDay; i++) {
		emptyDaySquares.push(<div key={"emptyday_" + i}></div>);
	}

	const fullDaySquares = [];
	for (let i = 1; i <= daysInMonth; i++) {
		const isDayAvailable = availableDates.includes(i);

		const isDaySelectedInCal =
			selectedDateProps &&
			selectedDateProps.getDate() === i &&
			selectedDateProps.getMonth() === month;

		fullDaySquares.push(
			<div key={"day_" + i}>
				<DayDot
					isAvailable={isDayAvailable}
					isSelected={isDaySelectedInCal}
					onClick={() => {
						if (isDaySelectedInCal) {
							setSelectedDateProps(null);
						} else {
							const fullDateObj = new Date(year, month, i);
							setSelectedDateProps(fullDateObj);
						}
					}}
				>
					{i}
				</DayDot>
			</div>
		);
	}

	return (
		<div className="cal-div">
			<h2 className="cal-heading-selectdt">Select Date & Time</h2>
			<div className="cal-buttons-and-month-div">
				<button
					onClick={prevMonth}
					className={`cal-chevron ${isPastDate ? "invisible" : ""}`}
					disabled={isPastDate}
				>
					<ChevronLeft />
				</button>

				<p className="cal-month-year-heading">
					{monthNames[month]} {year}
				</p>

				<button onClick={nextMonth} className="cal-chevron">
					<ChevronRight />
				</button>
			</div>
			<div className="cal-day-grid">
				{dayNames.map((day) => (
					<div key={day} className="p font-bold">
						{day}
					</div>
				))}
				{emptyDaySquares}
				{fullDaySquares}
			</div>
		</div>
	);
};

export default Calendar;
