import SessionDetails from "../../src/components/groups/SessionDetails";
import duncanImage from "../../src/assets/duncan.png";

describe("SessionDetails Component tests", () => {
  const testedVolunteer = {
    name: "Duncan",
    img: duncanImage,
  };

  it("shows trainee view by default", () => {
    cy.mount(<SessionDetails activeVolunteerProps={testedVolunteer} />);

    cy.contains("Book 1:1 session").should("be.visible");
    cy.contains("You are booking a session with").should("be.visible");
    cy.contains("Duncan").should("be.visible");
  });
});
