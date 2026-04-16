import VolunteerAvailabilityForm from "../../src/components/groups/VolunteerAvailabilityForm";

describe("VolunteerAvailabilityForm", () => {
  it("submits start_time as UTC", () => {
    const onSubmit = cy.stub().as("onSubmit");

    cy.mount(
      <VolunteerAvailabilityForm
        whenFormSubmit={onSubmit}
        volunteerId={1}
        mode="edit"
        addedSlots={[]}
        removeSlot={() => {}}
        saveAll={() => {}}
      />
    );

    cy.get('input[type="date"]').clear().type("2026-05-20");
    cy.get('input[type="time"]').clear().type("10:00");
    cy.contains("button", "Add to list").click();

    const expected = new Date(2026, 4, 20, 10, 0).toISOString();
    cy.get("@onSubmit").should((stub) => {
      expect(stub).to.have.been.calledOnce;
      expect(stub.firstCall.args[0].start_time).to.equal(expected);
    });
  });
});
