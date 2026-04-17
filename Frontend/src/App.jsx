import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import TraineeBookingFlow from "./components/pages/TraineeBookingFlow";
import VolunteerDash from "./components/pages/VolunteerDash";
import NotFound from "./components/pages/NotFound";
import Navbar from "./components/elements/NavBar";

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />, // Wrap everything in Layout
    children: [
      { path: "/", Component: LandingPage },
      {
        path: "/trainee-booking",
        children: [
          { index: true, Component: TraineeBookingFlow },
          { path: ":selectedDate", Component: TraineeBookingFlow },
          {
            path: ":selectedDate/:selectedTime",
            Component: TraineeBookingFlow,
          },
          {
            path: ":selectedDate/:selectedTime/:status",
            Component: TraineeBookingFlow,
          },
          {
            path: ":selectedDate/:selectedTime/:status/:volunteerId/:slotRuleId",
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
      { path: "*", Component: NotFound },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
