import { useState } from "react";
//based on state react adds classes
// useState() returns [state value, function]
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

// const availableDates = [23, 24, 25, 26, 29, 30]; this now comes passed in to redned Calendar from App

const DayDot = ({
	children,
	// children is <date shown in cal> i in loop , i handed in from loop in Calendar to here
	isSelected,
	isAvailable,
	isUnavailable,
	onClick,
}) => {
	//set base class so we have same style for each day dot
	let className = "cal-day";
	//add class based on state
	// this is different to direct DOM manipulation .addClassList/remove - here we change component state/props
	//build string so react assigns when rendering
	if (isSelected) className += " cal-day-selected";
	else if (isAvailable) className += " cal-day-available";
	else if (isUnavailable) className += " cal-day-unavailable";

	return (
		<button onClick={onClick} className={className}>
			{children}
		</button>
	);
};

// const Calendar = () => {
// this becomes with props { userClickedOnDateFromApp, setUserClickedOnDateFromApp } because we now grab this from App to showtimes inm timeslots
const Calendar = ({
	selectedDateProps,
	setSelectedDateProps,
	availableDates,
}) => {
	const setDefaultMonthView = new Date(2026, 2, 1);

	// here add state (state is month - initially march)so the UI updates automatically
	// hook useState() returns [current value of state, function called to update state]

	const [currentDate, funcToChangeMonth] = useState(setDefaultMonthView);

	const month = currentDate.getMonth();
	const year = currentDate.getFullYear();

	//change month next prev from state which is object Date - new obj to render again
	const nextMonth = () => {
		funcToChangeMonth(new Date(year, month + 1, 1));
	};
	const prevMonth = () => {
		funcToChangeMonth(new Date(year, month - 1, 1));
	};

	//sort out how month is shown with empty days
	const firstDay = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const numOfEmptyFieldsBeforeFirstDay = (firstDay.getDay() + 6) % 7;

	//empty and full with dates divs to push into the cal grid
	const emptyDaySquares = [];
	for (let i = 0; i < numOfEmptyFieldsBeforeFirstDay; i++) {
		emptyDaySquares.push(<div key={"emptyday_" + i}></div>);
	}
	// const emptyDaySquares = Array.from({ length: numOfEmptyFieldsBeforeFirstDay }); //refactor later maybe map

	//first off no date selected by user - only here because user cant click on empty square
	// in js userClickedOnDate = i, here useState(state, func to change state)
	// const [userClickedOnDate, setUserClickedOnDate] = useState(null);
	// thwe above is now comig from the App as props

	const fullDaySquares = [];
	for (let i = 1; i <= daysInMonth; i++) {
		//check if day is available T/F
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
					// when the user clicks on date either set to no daye
					onClick={() => {
						if (isDaySelectedInCal) {
							//here because its not set here anymore but comes from props from App
							// setUserClickedOnDate(null); it becomes:
							setSelectedDateProps(null);
						} else {
							// setUserClickedOnDate(i); and this becomes new day in
							// setUserClickedOnDateFromApp(i);  but instead of just the number i we can send the date obj for the heading of the timeslots
							// so it becomes:
							const fullDateObj = new Date(year, month, i);
							setSelectedDateProps(fullDateObj);
							//no need to send the app the whole obj  so
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
				<button onClick={prevMonth} className="cal-chevron">
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
