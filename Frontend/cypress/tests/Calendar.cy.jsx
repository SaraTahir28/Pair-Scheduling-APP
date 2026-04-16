import Calendar from "../../src/components/groups/Calendar";

const getCurrentMonthDates = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const formatDate = (day) => {
    const date = new Date(year, month, day);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return {
    day15: formatDate(15),
    day20: formatDate(20),
  };
};

describe("Basic Calendar Component Tests", () => {
  it("shows the current month and year on load", () => {
    cy.mount(
      <Calendar selectedDateProps={null} setSelectedDateProps={() => {}} />
    );

    const today = new Date();
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
    const expectedHeading = `${
      monthNames[today.getMonth()]
    } ${today.getFullYear()}`;

    cy.get(".cal-month-year-heading").should("have.text", expectedHeading);
  });

  it("highlights the dates that are available", () => {
    const { day15, day20 } = getCurrentMonthDates();

    cy.mount(
      <Calendar
        selectedDateProps={null}
        setSelectedDateProps={() => {}}
        availableDates={[day15, day20]}
      />
    );

    cy.contains(".cal-day", "15").should("have.class", "cal-day-available");
    cy.contains(".cal-day", "20").should("have.class", "cal-day-available");
  });

  it("does not highlight dates that are unavailable", () => {
    const { day15, day20 } = getCurrentMonthDates();

    cy.mount(
      <Calendar
        selectedDateProps={null}
        setSelectedDateProps={() => {}}
        availableDates={[day15, day20]}
      />
    );

    cy.contains(".cal-day", "25").should("not.have.class", "cal-day-available");
  });
});
