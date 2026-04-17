import SessionDetails from "../../src/components/groups/SessionDetails";
import duncanImage from "../../src/assets/duncan.png";

describe("SessionDetails Component tests", () => {
  const testedVolunteer = {
    name: "Duncan",
    img: duncanImage,
  };

  it("shows trainee view by default", () => {
    cy.mount(
      <SessionDetails
        activeVolunteerProps={testedVolunteer}
        volunteerView={false}
      />
    );

    cy.contains("Book 1:1 session").should("be.visible");
    cy.contains("Your session is with").should("be.visible");
    cy.contains("Duncan").should("be.visible");
  });

  it("shows volunteer view when volunteerView is true", () => {
    cy.mount(
      <SessionDetails
        activeVolunteerProps={testedVolunteer}
        volunteerView={true}
      />
    );

    cy.contains("Welcome back").should("be.visible");
    cy.contains("You are logged in as").should("be.visible");
    cy.contains("Duncan").should("be.visible");
  });
});
