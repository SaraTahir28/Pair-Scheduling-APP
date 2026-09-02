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

  describe("starting with a slot in basket", () => {
    beforeEach(() => {
      const onSubmit = cy.stub().as("onSubmit");

      const alertStub = cy.stub().as("alert");
      cy.on("window:alert", alertStub);

      const existingSlot = {
        start_time: new Date(2026, 4, 20, 10, 0).toISOString(),
        regular: false,
        repeat_until: null,
      };

      cy.mount(
        <VolunteerAvailabilityForm
          whenFormSubmit={onSubmit}
          volunteerId={1}
          mode="edit"
          addedSlots={[existingSlot]}
          removeSlot={() => {}}
          saveAll={() => {}}
        />
      );
    });

    it("volunteer cannot add a duplicate slot", () => {
      cy.get('input[type="date"]').clear().type("2026-05-20");
      cy.get('input[type="time"]').clear().type("10:00");
      cy.contains("button", "Add to list").click();

      cy.get("@alert").should(
        "have.been.calledWith",
        "This slot is already added."
      );
      cy.get("@onSubmit").should("not.have.been.called");
    });

    it("prevents adding overlapping slots with 59 minutes diff", () => {
      cy.get('input[type="date"]').clear().type("2026-05-20");
      cy.get('input[type="time"]').clear().type("10:59");
      cy.contains("button", "Add to list").click();

      cy.get("@alert").should(
        "have.been.calledWith",
        "Your sessions must be at least one hour apart."
      );
      cy.get("@onSubmit").should("not.have.been.called");
    });
  });
});
