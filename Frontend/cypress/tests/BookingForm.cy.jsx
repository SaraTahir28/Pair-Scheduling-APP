import BookingForm from "../../src/components/groups/BookingForm";

describe("BookingForm Component tests", () => {
	it("shows the tested name and email and verifies email is readOnly", () => {
		const testedTrainee = { name: "Test Trainee", email: "trainee@test.com" };

		cy.mount(<BookingForm trainee={testedTrainee} whenFormSubmit={() => {}} />);

		cy.get("input.form-input").first().should("have.value", "Test Trainee");

		cy.get("input.form-input-disabled")
			.should("have.value", "trainee@test.com")
			.and("have.attr", "readonly");
	});

	it("triggers alert when the name is too short", () => {
		const testedTrainee = { name: "T", email: "trainee@test.com" };

		cy.mount(<BookingForm trainee={testedTrainee} whenFormSubmit={() => {}} />);

		cy.on("window:alert", (text) => {
			expect(text).to.contains("Name should be between 2 and 50 chars.");
		});

		cy.get("button").contains("Book meeting").click();
	});

	it("cleans name by removing numbers and symbols on submit", () => {
		const testedSubmit = cy.stub().as("testedSubmit");
		const testedTrainee = { name: "", email: "trainee@test.com" };

		cy.mount(
			<BookingForm trainee={testedTrainee} whenFormSubmit={testedSubmit} />
		);

		cy.get("input.form-input").first().type("Kaska123?");
		cy.get("button").contains("Book meeting").click();

		cy.get("@testedSubmit").should("have.been.calledWith", {
			traineeName: "Kaska",
			traineeEmail: "trainee@test.com",
		});
	});

	it("allows typing in the name input", () => {
		const testedTrainee = { name: "", email: "trainee@test.com" };

		cy.mount(<BookingForm trainee={testedTrainee} whenFormSubmit={() => {}} />);

		cy.get("input.form-input")
			.first()
			.type("New Name")
			.should("have.value", "New Name");
	});
});
