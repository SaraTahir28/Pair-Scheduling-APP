import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import TraineeBookingFlow from "./components/pages/TraineeBookingFlow";
import VolunteerDash from "./components/pages/VolunteerDash";

const router = createBrowserRouter([
	{
		path: "/",
		Component: LandingPage,
	},
	{
		path: "/trainee-booking",
		children: [
			{ index: true, Component: TraineeBookingFlow },
			{ path: ":selectedDate", Component: TraineeBookingFlow },
			{ path: ":selectedDate/:selectedTime", Component: TraineeBookingFlow },
			{
				path: ":selectedDate/:selectedTime/:status",
				Component: TraineeBookingFlow,
			},
		],
	},
	{
		path: "/volunteer-dash",
		children: [
			{ index: true, Component: VolunteerDash },

			{ path: "bookings/:id/edit", Component: VolunteerDash },
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
