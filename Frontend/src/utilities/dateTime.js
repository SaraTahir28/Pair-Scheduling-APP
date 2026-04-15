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

export const parseLocalDate = (dateStr) => {
  if (!isValidDate(dateStr)) throw new Error(`Invalid date: ${dateStr}`);
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const parseLocalDateTime = (dateStr, timeStr) => {
  if (!isValidDate(dateStr)) throw new Error(`Invalid date: ${dateStr}`);
  if (!isValidTime(timeStr)) throw new Error(`Invalid time: ${timeStr}`);
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
};

export const toDayOfWeekName = (dateStr) => {
  return parseLocalDate(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
  });
};

