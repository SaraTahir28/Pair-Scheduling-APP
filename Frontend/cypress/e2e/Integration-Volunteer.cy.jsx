describe("Volunteer flow", () => {
	it("allows volunteer to save a single date availability", () => {
		cy.intercept("GET", "**/auth/user/", {
			statusCode: 200,
			body: {
				id: 1,
				name: "Duncan Parkinson",
				email: "duncan@test.com",
				is_volunteer: true,
			},
		}).as("getUser");

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
		cy.intercept("GET", "**/auth/user/", {
			statusCode: 200,
			body: {
				id: 1,
				name: "Duncan Parkinson",
				email: "duncan@test.com",
				is_volunteer: true,
			},
		}).as("getUser");

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
		cy.intercept("GET", "**/auth/user/", {
			statusCode: 200,
			body: {
				id: 1,
				name: "Duncan Parkinson",
				email: "duncan@test.com",
				is_volunteer: true,
			},
		}).as("getUser");

		cy.visit("/volunteer-dash");
		cy.wait("@getUser");

		cy.get('input[type="date"]').clear().type("2026-05-20");
		cy.get('input[type="date"]').should("have.value", "2026-05-20");
		cy.get('input[type="time"]').clear().type("10:00");
		cy.get('input[type="time"]').should("have.value", "10:00");

		cy.contains("button", "Add to list").click();

		cy.contains("Entries to save:").should("be.visible");

		cy.contains("✕").click();

		cy.contains("Entries to save:").should("not.exist");
		cy.contains(/save all/i).should("not.exist");
	});
});
