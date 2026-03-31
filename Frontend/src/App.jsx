import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import TraineeBookingFlow from "./components/pages/TraineeBookingFlow";
import VolunteerDash from "./components/pages/VolunteerDash";
import Navbar from "./components/elements/NavBar";

const router = createBrowserRouter([
	{
		path: "/",
		Component: LandingPage,
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
]);

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
