describe("Trainee booking flow", () => {
	beforeEach(() => {
		cy.intercept("GET", "**/auth/user/", {
			statusCode: 200,
			body: { id: 1, name: "Duncan Parkinson", email: "duncan@example.com" },
		}).as("getUser");

		cy.intercept("GET", "**/auth/csrf/", {
			statusCode: 200,
			body: { detail: "CSRF cookie set" },
		}).as("getCsrf");

		cy.intercept("POST", "**/api/create-meeting/", {
			statusCode: 201,
			body: { message: "Meeting created successfully.", event_id: "abc123" },
		}).as("postBooking");
	});

	it("allows a trainee to book a session from start to finish", () => {
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
