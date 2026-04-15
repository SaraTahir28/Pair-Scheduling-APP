import React from "react";
import VolunteerAvailabilityManager from "../../src/components/groups/VolunteerAvailabilityManager";

describe("Volunteer Availability Manager - Simple Flow", () => {
	beforeEach(() => {
		cy.intercept("POST", "**/api/slot-rules/", {
			statusCode: 201,
			body: { message: "Success" },
		}).as("saveAction");

		cy.intercept("GET", "**/api/slot-rules/", {
			statusCode: 200,
			body: [
				{
					id: 101,
					volunteer_id: 1,
					regular: true,
					weekday: "Monday",
					start_time: "2026-04-13T16:00:00Z",
					repeat_until: "2026-05-11",
					group: "all",
				},
			],
		}).as("loadAction");
	});

	it("should go from View to Edit, add a slot and save", () => {
		cy.mount(
			<VolunteerAvailabilityManager
				volunteerId={1}
				onBackToDash={() => console.log("Back")}
			/>
		);

		cy.wait("@loadAction");
		cy.contains("Every Monday").should("be.visible");

		cy.contains("Edit my slots").click();

		cy.get('input[type="time"]').type("12:00");
		cy.contains("Add to list").click();

		cy.contains("Save all").click();

		cy.wait("@saveAction");
		cy.contains("My availability").should("be.visible");
	});
});
