import { MemoryRouter, Route, Routes } from "react-router-dom";
import TraineeBookingFlow from "../../src/components/pages/TraineeBookingFlow";
import { AuthProvider } from "../../src/AuthContext";

const mockUser = { id: 1, name: "Test Trainee", email: "trainee@test.com" };

const mountAtRoute = (path) => {
  cy.mount(
    <AuthProvider value={{ user: mockUser }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/trainee-booking" element={<TraineeBookingFlow />} />
          <Route path="/trainee-booking/:selectedDate" element={<TraineeBookingFlow />} />
          <Route path="/trainee-booking/:selectedDate/:selectedTime" element={<TraineeBookingFlow />} />
          <Route path="/trainee-booking/:selectedDate/:selectedTime/:status" element={<TraineeBookingFlow />} />
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
});
