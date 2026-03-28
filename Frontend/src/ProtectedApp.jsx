import { useEffect, useState } from "react"; // React hooks: useState for state, useEffect for side effects
import App from "./App"; // Main app component (calendar, bookings, etc.)
import Login from "./components/pages/Login"; // Login page with Google sign-in button
import api from "./api";

// ProtectedApp: wraps the main App and handles authentication checks
export default function ProtectedApp() {
	// `user` state will hold the current user info:
	// - undefined: we are still checking if the user is logged in
	// - null: user is not logged in
	// - object: user is logged in (contains email, name, etc.)
	const [user, setUser] = useState(undefined);

	// useEffect runs once after component mounts
	// It checks the backend to see if there is an active user session
	useEffect(() => {
		api.get("/auth/user/")
			.then((res) => setUser(res.data))
			.catch(() => setUser(null)); // if fetch fails, treat as not logged in
	}, []); // empty dependency array = runs only once on mount

	// While checking the session, show a loading indicator
	if (user === undefined) return <div>Loading...</div>;

	// If user is not logged in (null or missing id), show the Login page
	if (!user || !user.id) return <Login />;

	// If user is logged in, render the main App
	return <App />;
}
