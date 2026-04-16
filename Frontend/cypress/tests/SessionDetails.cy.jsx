import SessionDetails from "../../src/components/groups/SessionDetails";
import duncanImage from "../../src/assets/duncan.png";
import { AuthProvider } from "../../src/AuthContext";

describe("SessionDetails Component tests", () => {
	const testedVolunteer = {
		name: "Duncan",
		img: duncanImage,
	};

	const mockUser = {
		name: "Test Volunteer",
		img: "/default-avatar.png",
	};

	it("shows trainee view when traineeView is true", () => {
		cy.mount(
			<AuthProvider value={{ user: mockUser }}>
				<SessionDetails
					activeVolunteerProps={testedVolunteer}
					traineeView={true}
				/>
			</AuthProvider>
		);

		cy.contains("Book 1:1 session").should("be.visible");
		cy.contains("You are booking a session with").should("be.visible");
		cy.contains("Duncan").should("be.visible");
	});

	it("shows volunteer view when volunteerView is true", () => {
		cy.mount(
			<AuthProvider value={{ user: mockUser }}>
				<SessionDetails volunteerView={true} />
			</AuthProvider>
		);

		cy.contains("Welcome").should("be.visible");
		cy.contains("You are logged in as").should("be.visible");
	});
});
