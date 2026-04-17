// Requires `make dev` running (needs /auth/test-login/, gated on DEBUG).

describe("VolunteerDash", () => {
  const volunteerEmail = "volunteer-dash-e2e@example.com";
  const slotStart = "2026-04-20T09:00:00Z";

  beforeEach(() => {
    cy.loginAsTestUser({ email: volunteerEmail, name: "Dash E2E" });
    cy.clearSlotRules();
    cy.seedSlotRule({ start_time: slotStart });
  });

  it("shows existing slot rules on the Manage My Availability screen", () => {
    cy.visit("/volunteer-dash");

    cy.contains("Manage my availability").click();

    cy.contains("My availability").should("be.visible");
    cy.contains("No availability sessions set").should("not.exist");
    cy.contains("20-04-2026").should("be.visible");
  });
});
