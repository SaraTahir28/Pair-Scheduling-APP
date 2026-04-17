const buildDynamicSlot = () => {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  const appNow = new Date(Date.UTC(year, month, 15, 8, 0, 0));
  const start = new Date(Date.UTC(year, month, 20, 9, 0, 0));
  const end = new Date(Date.UTC(year, month, 20, 10, 0, 0));

  return {
    appNow,
    selectedDate: start.toISOString().split("T")[0],
    selectedTime: "09:00",
    start_time: start.toISOString(),
    end_time: end.toISOString(),
  };
};

describe("Trainee booking flow", () => {
  let slot;

  beforeEach(() => {
    slot = buildDynamicSlot();

    cy.clock(slot.appNow.getTime(), ["Date"]);

    cy.intercept("GET", "**/auth/user/", {
      statusCode: 200,
      body: { id: 100, name: "Kaska", email: "kaska@example.com" },
    }).as("getUser");

    cy.intercept("GET", "**/api/available-slots/", {
      statusCode: 200,
      body: [
        {
          start_time: slot.start_time,
          end_time: slot.end_time,
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

  it("books a meeting successfully", () => {
    cy.visit("/trainee-booking");

    cy.wait(["@getUser", "@getSlots"]);

    cy.contains(".cal-day-available", "20").click();

    cy.contains(".btn-time-slot", slot.selectedTime).click();

    cy.get(".booking-form-container").should("be.visible");
    cy.get(".form-title").should("contain", "Your session details");
    cy.contains("label", "Okay Kaska, what would you like to discuss?");

    cy.get("textarea.form-input").type(
      "I'd like to discuss React state management."
    );

    cy.contains("button", "Book meeting").click();

    cy.wait("@postBooking")
      .its("request.body")
      .should((body) => {
        expect(body.volunteer_id).to.equal(1);
        expect(body.slot_rule_id).to.equal(1);
        expect(body.agenda).to.equal(
          "I'd like to discuss React state management."
        );
        expect(body.time_slot).to.be.a("string");
      });

    cy.url().should(
      "include",
      `/trainee-booking/${slot.selectedDate}/${slot.selectedTime}/confirmation/1/1`
    );

    cy.get(".confirmation-container").should("be.visible");
    cy.contains("You are scheduled").should("be.visible");
    cy.contains("Duncan Parkinson").should("be.visible");
    cy.get(".confirmation-container").should("be.visible");
    cy.contains("You are scheduled").should("be.visible");
    cy.contains("Duncan Parkinson").should("be.visible");
    cy.contains(slot.selectedTime).should("be.visible");
    cy.contains("1 hour").should("be.visible");
  });

  it("shows validation and does not submit when agenda is too short", () => {
    const alertStub = cy.stub();
    cy.on("window:alert", alertStub);

    cy.visit("/trainee-booking");

    cy.wait(["@getUser", "@getSlots"]);

    cy.contains(".cal-day-available", "20").click();

    cy.contains(".btn-time-slot", slot.selectedTime).click();

    cy.get("textarea.form-input").type("Too short");
    cy.contains("button", "Book meeting").click();

    cy.then(() => {
      expect(alertStub).to.have.been.calledWith(
        "Agenda should be between 10 and 500 chars."
      );
    });

    cy.get("@postBooking.all").should("have.length", 0);
  });
});
