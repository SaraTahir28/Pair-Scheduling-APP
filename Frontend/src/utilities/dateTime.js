const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}$/;

export const isValidDate = (strDate) => {
  if (!ISO_DATE.test(strDate)) return false;
  const [year, month, day] = strDate.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return (utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() + 1 === month &&
    utcDate.getUTCDate() === day
  );
};

export const isValidTime = (strTime) => {
  if (!TIME.test(strTime)) return false;
  const [hours, minutes] = strTime.split(":").map(Number);
  return (hours >= 0 && hours <= 23 &&
    minutes >= 0 && minutes <= 59);
};

export const toUtcDateString = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
