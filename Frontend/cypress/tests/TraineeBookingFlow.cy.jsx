import { MemoryRouter, Route, Routes } from "react-router-dom";
import TraineeBookingFlow from "../../src/components/pages/TraineeBookingFlow";
import { AuthProvider } from "../../src/AuthContext";
import { formatLocalDate, formatLocalTime } from "../../src/utilities/dateTime";

const mockUser = { id: 1, name: "Test Trainee", email: "trainee@test.com" };

const mountAtRoute = (path) => {
  cy.mount(
    <AuthProvider value={{ user: mockUser }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/trainee-booking" element={<TraineeBookingFlow />} />
          <Route
            path="/trainee-booking/:selectedDate"
            element={<TraineeBookingFlow />}
          />
          <Route
            path="/trainee-booking/:selectedDate/:selectedTime"
            element={<TraineeBookingFlow />}
          />
          <Route
            path="/trainee-booking/:selectedDate/:selectedTime/:status"
            element={<TraineeBookingFlow />}
          />
          <Route
            path="/trainee-booking/:selectedDate/:selectedTime/:status/:volunteerId/:slotRuleId"
            element={<TraineeBookingFlow />}
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
};

describe("TraineeBookingFlow URL validation", () => {
  it("renders normally for no date or time entered yet", () => {
    mountAtRoute("/trainee-booking/");
    cy.get("[role='alert']").should("not.exist");
  });

  it("shows an error for a date that doesn't exist", () => {
    mountAtRoute("/trainee-booking/2026-04-50");
    cy.get("[role='alert']").should("be.visible");
  });

  it("hides the booking flow for an invalid date", () => {
    mountAtRoute("/trainee-booking/2026-04-50");
    cy.get(".cal-div").should("not.exist");
    cy.get(".timeslot-group-div").should("not.exist");
  });

  it("hides the booking flow for an invalid time", () => {
    mountAtRoute("/trainee-booking/2026-04-01/25:67");
    cy.get(".booking-form-container").should("not.exist");
  });

  it("renders normally for a valid date", () => {
    mountAtRoute("/trainee-booking/2026-04-01");
    cy.get("[role='alert']").should("not.exist");
  });

  it("shows an error for a time that doesn't exist", () => {
    mountAtRoute("/trainee-booking/2026-01-01/25:67");
    cy.get("[role='alert']").should("be.visible");
  });

  it("renders normally for a valid date and time", () => {
    mountAtRoute("/trainee-booking/2026-04-01/09:00");
    cy.get("[role='alert']").should("not.exist");
  });

  it("shows slots in local time and submits the original UTC", () => {
    const advertisedUtc = "2026-07-01T09:00:00Z";
    const slotStart = new Date(advertisedUtc);
    const expectedLocalDate = formatLocalDate(slotStart);
    const expectedLocalTime = formatLocalTime(slotStart);
    console.log(expectedLocalDate, expectedLocalTime);

    cy.intercept("GET", "**/api/available-slots/", {
      statusCode: 200,
      body: [
        {
          volunteer_id: 1,
          slot_rule_id: 1,
          name: "Test Volunteer",
          img: "",
          start_time: advertisedUtc,
          end_time: new Date(
            slotStart.getTime() + 60 * 60 * 1000
          ).toISOString(),
        },
      ],
    }).as("availableSlots");

    cy.intercept("POST", "**/api/create-meeting/", {
      statusCode: 200,
      body: {},
    }).as("createMeeting");

    mountAtRoute(`/trainee-booking/${expectedLocalDate}`);
    cy.wait("@availableSlots");

    cy.contains(".btn-time-slot", expectedLocalTime)
      .should("be.visible")
      .click();

    cy.get("textarea").type("discuss how bad date handling is in javascript");
    cy.contains("Book meeting").click();

    cy.wait("@createMeeting")
      .its("request.body.time_slot")
      .should("equal", slotStart.toISOString());
  });
});
