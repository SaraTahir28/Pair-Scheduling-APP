import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import TraineeBookingFlow from "./components/pages/TraineeBookingFlow";
import VolunteerDash from "./components/pages/VolunteerDash";
import NotFound from "./components/pages/NotFound";

const router = createBrowserRouter([
	{
		path: "/",
		Component: LandingPage,
		errorElement: <NotFound />,
	},
	{
		path: "/trainee-booking",
		children: [
			// index true is root
			{ index: true, Component: TraineeBookingFlow },
			{ path: ":selectedDate", Component: TraineeBookingFlow },
			{ path: ":selectedDate/:selectedTime", Component: TraineeBookingFlow },
		],
	},
	{
		path: "/volunteer-dash",
		children: [
			// index true is root
			{ index: true, Component: VolunteerDash },

			{ path: "bookings/:id/edit", Component: VolunteerDash },
		],
	},
	{
		path: "*",
		Component: NotFound,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
