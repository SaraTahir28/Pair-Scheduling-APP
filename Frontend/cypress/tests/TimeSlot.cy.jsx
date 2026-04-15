import TimeSlotGroup from "../../src/components/groups/TimeSlotGroup";

describe("TimeSlotGroup component tests", () => {
	it("shows the prompt when no date is selected", () => {
		cy.mount(
			<TimeSlotGroup
				selectedDateProps={null}
				setSelectedTimeProps={() => {}}
				availableTimes={[]}
			/>
		);

		cy.contains("Select a date to see available times.").should("be.visible");
	});

	it("shows the tested date and available times when a date is picked", () => {
		const testedDate = new Date(2026, 4, 30);
		const testedTimes = ["09:00", "14:30"];

		cy.mount(
			<TimeSlotGroup
				selectedDateProps={testedDate}
				setSelectedTimeProps={() => {}}
				availableTimes={testedTimes}
			/>
		);

		cy.contains(testedDate.toDateString()).should("be.visible");
		cy.contains("09:00").should("be.visible");
		cy.contains("14:30").should("be.visible");
	});

	it("does not show times that are not in the tested list", () => {
		const testedDate = new Date(2026, 4, 30);
		const testedTimes = ["09:00", "14:30"];

		cy.mount(
			<TimeSlotGroup
				selectedDateProps={testedDate}
				setSelectedTimeProps={() => {}}
				availableTimes={testedTimes}
			/>
		);
		cy.contains("16:00").should("not.exist");
	});
});
