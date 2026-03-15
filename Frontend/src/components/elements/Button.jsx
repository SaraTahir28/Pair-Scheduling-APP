// destructuring this:
// function ActionBtn(whole objejct props) {
// 	return <button onClick={props.onClick}>{props.children}</button>;
// }

//children is what is between <> like .textContent
const ActionBtn = ({ children, onClick }) => (
	<button type="button" className="btn-confirm" onClick={onClick}>
		{children}
	</button>
);

const TimeSlotBtn = ({ time, onClick }) => (
	<button type="button" className="btn-time-slot" onClick={onClick}>
		{time}
	</button>
);

export { ActionBtn, TimeSlotBtn };
