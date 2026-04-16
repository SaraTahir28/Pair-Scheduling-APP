import { ChevronLeft } from "lucide-react";

const ActionBtn = ({ children, onClick, additionalBtnClass }) => (
  <button
    type="button"
    className={`action-btn ${additionalBtnClass}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const TimeSlotBtn = ({ time, name, onClick }) => (
  <button type="button" className="btn-time-slot" onClick={onClick}>
    <div>{time}</div>
    <div className="text-sm opacity-70">{name}</div>
  </button>
);

const BackBtn = ({ onClick, additionalBtnClass }) => (
  <button
    type="button"
    className={`back-btn ${additionalBtnClass}`}
    onClick={onClick}
  >
    <ChevronLeft className="back-btn-icon" />
    Back
  </button>
);

export { ActionBtn, TimeSlotBtn, BackBtn };
