import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TraineeBookingFlow from "./pages/TraineeBookingFlow";
import VolunteerDash from "./pages/VolunteerDash";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/trainee" element={<TraineeBookingFlow />} />
				<Route path="/volunteer" element={<VolunteerDash />} />
			</Routes>
		</BrowserRouter>
	);
}
