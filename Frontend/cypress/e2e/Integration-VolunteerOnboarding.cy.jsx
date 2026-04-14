describe("Volunteer flow", () => {
	beforeEach(() => {
		cy.intercept("GET", "**/auth/user/", {
			statusCode: 200,
			body: {
				id: 1,
				name: "Duncan Parkinson",
				email: "duncan@example.com",
			},
		}).as("getUser");

		cy.intercept("GET", "**/auth/csrf/", {
			statusCode: 200,
			body: { detail: "CSRF cookie set" },
		}).as("getCsrf");

		cy.intercept("POST", "**/api/**", {
			statusCode: 200,
			body: { message: "OK" },
		}).as("postApi");
		cy.intercept("DELETE", "**/api/**", {
			statusCode: 200,
			body: { message: "OK" },
		}).as("deleteApi");
	});

	it("allows volunteer to save a single date availability", () => {
		cy.visit("/volunteer-dash");
		cy.wait("@getUser");

		cy.contains(
			"Let's start by selecting your availability for 1:1 sessions."
		).should("be.visible");

		cy.get('input[type="date"]').clear().type("2026-05-20");
		cy.get('input[type="date"]').should("have.value", "2026-05-20");
		cy.get('input[type="time"]').clear().type("10:00");
		cy.get('input[type="time"]').should("have.value", "10:00");

		cy.contains("button", "Add to list").click();

		cy.on("window:alert", (text) => {
			expect(text).to.contains("Availability is saved.");
		});

		cy.contains(/save all/i).click();

		cy.contains("Upcoming sessions").should("be.visible");
		cy.get(".all-cards-container").should("be.visible");
	});

	it("allows volunteer to save a recurring availability", () => {
		cy.visit("/volunteer-dash");
		cy.wait("@getUser");

		cy.contains(
			"Let's start by selecting your availability for 1:1 sessions."
		).should("be.visible");

		cy.get('input[type="date"]').clear().type("2026-05-15");
		cy.get('input[type="date"]').should("have.value", "2026-05-15");
		cy.get('input[type="time"]').clear().type("14:30");
		cy.get('input[type="time"]').should("have.value", "14:30");

		cy.get(".form-checkbox").should("not.be.checked");
		cy.get(".form-checkbox").check();
		cy.get(".form-checkbox").should("be.checked");

		cy.get('input[type="date"]').eq(1).clear().type("2026-06-15");
		cy.get('input[type="date"]').eq(1).should("have.value", "2026-06-15");

		cy.contains("Select date").should("not.exist");
		cy.contains("label", "Starting on").should("be.visible");
		cy.contains("This session will repeat every Friday").should("be.visible");

		cy.contains("button", "Add to list").click();

		cy.on("window:alert", (text) => {
			expect(text).to.contains("Availability is saved.");
		});

		cy.contains(/save all/i).click();

		cy.contains("Upcoming sessions").should("be.visible");
		cy.get(".all-cards-container").should("be.visible");
	});

	it("allows volunteer to remove an item from the basket", () => {
		cy.visit("/volunteer-dash");
		cy.wait("@getUser");

		cy.get('input[type="date"]').clear().type("2026-05-20");
		cy.get('input[type="date"]').should("have.value", "2026-05-20");
		cy.get('input[type="time"]').clear().type("10:00");
		cy.get('input[type="time"]').should("have.value", "10:00");

		cy.contains("button", "Add to list").click();

		cy.contains("Entries to save:").should("be.visible");

		cy.get(".basket-delete-btn").click();

		cy.contains("Entries to save:").should("not.exist");
		cy.contains(/save all/i).should("not.exist");
	});

	it("hides onboarding after successful slots save", () => {
		cy.visit("/volunteer-dash");
		cy.wait("@getUser");

		cy.get('input[type="date"]').clear().type("2026-05-20");
		cy.get('input[type="date"]').should("have.value", "2026-05-20");
		cy.contains("button", "Add to list").click();

		cy.contains(/save all/i).click();

		cy.contains("Let's start by selecting your availability").should(
			"not.exist"
		);
		cy.get("form").should("not.exist");
		cy.contains("Upcoming sessions").should("be.visible");
		cy.get(".all-cards-container").should("be.visible");
		cy.contains("button", "Add to list").should("not.exist");
	});
});
