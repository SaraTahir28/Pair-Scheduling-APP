import SessionDetails from "../../src/components/groups/SessionDetails";
import duncanImage from "../../src/assets/duncan.png";
import * as AuthContext from "../../src/AuthContext";

describe("SessionDetails Component tests", () => {
	const testedVolunteer = {
		name: "Duncan",
		img: duncanImage,
	};

	beforeEach(() => {
		cy.stub(AuthContext, "useAuth").returns({
			user: {
				name: "Test Volunteer",
				img: "/default-avatar.png",
			},
		});
	});

	it("shows trainee view when traineeView is true", () => {
		cy.mount(
			<SessionDetails
				activeVolunteerProps={testedVolunteer}
				traineeView={true}
			/>
		);

		cy.contains("Book 1:1 session").should("be.visible");
		cy.contains("You are booking a session with").should("be.visible");
		cy.contains("Duncan").should("be.visible");
	});

	it("shows volunteer view when volunteerView is true", () => {
		cy.mount(<SessionDetails volunteerView={true} />);

		cy.contains("Welcome back").should("be.visible");
		cy.contains("You are logged in as").should("be.visible");
	});
});
