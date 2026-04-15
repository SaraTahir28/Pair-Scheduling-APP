import Calendar from "../../src/components/groups/Calendar";

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
    cy.mount(
      <Calendar
        selectedDateProps={null}
        setSelectedDateProps={() => {}}
        availableDates={[15, 20]}
      />
    );

    cy.contains(".cal-day", "15").should("have.class", "cal-day-available");
    cy.contains(".cal-day", "20").should("have.class", "cal-day-available");
  });

  it("does not highlight dates that are unavailable", () => {
    cy.mount(
      <Calendar
        selectedDateProps={null}
        setSelectedDateProps={() => {}}
        availableDates={[15, 20]}
      />
    );

    cy.contains(".cal-day", "25").should("not.have.class", "cal-day-available");
  });
});
