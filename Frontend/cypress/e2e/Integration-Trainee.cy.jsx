const buildDynamicSlot = () => {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  const appNow = new Date(Date.UTC(year, month, 15, 8, 0, 0));
  const start = new Date(Date.UTC(year, month, 20, 9, 0, 0));
  const end = new Date(Date.UTC(year, month, 20, 10, 0, 0));

  return {
    appNow,
    start_time: start.toISOString(),
    end_time: end.toISOString(),
  };
};

describe("Trainee booking flow", () => {
  beforeEach(() => {
    const { appNow, start_time, end_time } = buildDynamicSlot();

    cy.clock(appNow.getTime(), ["Date"]);

    cy.intercept("GET", "**/auth/user/", {
      statusCode: 200,
      body: { id: 100, name: "Kaska", email: "kaska@example.com" },
    }).as("getUser");

    cy.intercept("GET", "**/api/available-slots/", {
      statusCode: 200,
      body: [
        {
          start_time,
          end_time,
          volunteer_id: 1,
          slot_rule_id: 1,
          name: "Duncan Parkinson",
          img: "/public/placeholder.png",
        },
      ],
    }).as("getSlots");

    cy.intercept("GET", "**/auth/csrf/", {
      statusCode: 200,
      body: { detail: "CSRF cookie set" },
    }).as("getCsrf");

    cy.intercept("POST", "**/api/create-meeting/", {
      statusCode: 201,
      body: { message: "Meeting created successfully.", event_id: "abc123" },
    }).as("postBooking");
  });

  it("shows a guard when booking without selecting a volunteer", () => {
    cy.visit("/trainee-booking");

    cy.wait(["@getUser", "@getSlots"]);

    cy.get(".cal-day-available").first().click();
    cy.get(".timeslot-group-div button").first().click();

    cy.get("textarea.form-input").type(
      "I'd like to discuss React state management."
    );
    cy.get("button").contains("Book meeting").click();

    cy.get(".booking-box").should("be.visible");
  });
});
