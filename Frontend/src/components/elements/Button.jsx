// destructuring this:
// function ActionBtn(whole objejct props) {
// 	return <button onClick={props.onClick}>{props.children}</button>;
// }

//children is what is between <> like .textContent
// here all action buttons have by default acton-btn class
// with additional class passed as props when rendering
const ActionBtn = ({ children, onClick, additionalBtnClass }) => (
	<button
		type="button"
		className={`action-btn ${additionalBtnClass}`}
		onClick={onClick}
	>
		{children}
	</button>
);

const TimeSlotBtn = ({ time, onClick }) => (
	<button type="button" className="btn-time-slot" onClick={onClick}>
		{time}
	</button>
);

export { ActionBtn, TimeSlotBtn };
