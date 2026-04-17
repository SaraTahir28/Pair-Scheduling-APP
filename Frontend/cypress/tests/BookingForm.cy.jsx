import BookingForm from "../../src/components/groups/BookingForm";

describe("BookingForm Component tests", () => {
  it("shows the name in label greting", () => {
    const testedTrainee = { name: "Kaska Test", email: "kaska@test.com" };

    cy.mount(<BookingForm trainee={testedTrainee} whenFormSubmit={() => {}} />);

    cy.get("label.form-label").should(
      "contain",
      "Okay Kaska Test, what would you like to discuss?"
    );
  });

  it("sends alert when agenda is too short", () => {
    const testedSubmit = cy.stub().as("testedSubmit");
    const testedTrainee = { name: "Kaska", email: "kaska@test.com" };

    cy.mount(
      <BookingForm trainee={testedTrainee} whenFormSubmit={testedSubmit} />
    );
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Agenda should be between 10 and 500 chars.");
    });

    cy.get("textarea.form-input").type("Too short");
    cy.get("button").contains("Book meeting").click();
    cy.get("@testedSubmit").should("not.have.been.called");
  });

  it("allows typing in the agenda field", () => {
    const testedTrainee = { name: "Kaska", email: "kaska@test.com" };

    cy.mount(<BookingForm trainee={testedTrainee} whenFormSubmit={() => {}} />);

    cy.get("textarea.form-input")
      .type("I want to learn about passing props between components in React")
      .should(
        "have.value",
        "I want to learn about passing props between components in React"
      );
  });
});
