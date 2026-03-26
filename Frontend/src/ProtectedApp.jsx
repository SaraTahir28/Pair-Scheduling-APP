import { useEffect, useState } from "react"; 
import App from "./App"; // 
import Login from "./components/pages/Login"; 
import { AuthProvider } from "./AuthContext";



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
		fetch("http://localhost:8000/auth/user/", {
			credentials: "include", // ensures cookies (session) are sent with the request
		})
			.then((res) => {
				if (res.status === 401) return null; 
				return res.json(); 
			})
			.then((data) => {
				setUser(data); // store the user object (or null if not logged in)
			})
			.catch(() => setUser(null)); // if fetch fails, treat as not logged in
	}, []); // empty dependency array = runs only once on mount

function handleLogout() {
  // Clear user immediately
  setUser(null);

  fetch("http://localhost:8000/auth/logout/", {
    method: "POST",
    credentials: "include",
  }).catch(() => console.log("Failed to log out on backend"));
}


	// While checking the session, show a loading indicator
	if (user === undefined) return <div>Loading...</div>;

	// If user is not logged in (null or missing id), show the Login page
	if (!user || !user.id) return <Login />;

	
	return (
    <AuthProvider value={{ user, logout: handleLogout }}>
      <App />
    </AuthProvider>
  );
}
