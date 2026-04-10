describe("Trainee booking flow", () => {
	it("allows a trainee to book a session from start to finish", () => {
		cy.intercept("GET", "**/auth/user/", {
			body: { id: 1, name: "Duncan Parkinson", email: "duncan@test.com" },
		}).as("getUser");

		cy.intercept("POST", "**/api/create-meeting/", { statusCode: 201 }).as(
			"postBooking"
		);

		cy.visit("/trainee-booking");
		cy.wait("@getUser");

		cy.get(".cal-day-available").first().click();
		cy.get(".timeslot-group-div button").first().click();

		cy.get("input.form-input").first().clear().type("Kaska Test");
		cy.get("button").contains("Book meeting").click();

		cy.wait("@postBooking");

		cy.url().should("include", "/confirmation");

		cy.get(".conf-page-div").should("be.visible");

		cy.get(".session-details-col").should("not.exist");
	});
});
