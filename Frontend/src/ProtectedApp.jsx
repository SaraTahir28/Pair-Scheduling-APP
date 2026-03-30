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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const [logoutError, setLogoutError] = useState(null);

function handleLogout() {
  fetch("http://localhost:8000/auth/logout/", {
    method: "POST",
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Logout failed");
      }
	  setUser(null);
		console.log("User after logout:", user);

    })
    .catch(() => {
      setLogoutError("Could not log out. Please try again.");
    });
}
	if (user === undefined) {
	 return <div>Loading...</div>;
		}
	if (!user) {
	 return <Login />;
		}
		
	return (
    <AuthProvider value={{ user, logout: handleLogout }}>
      <App />
    </AuthProvider>
  );
}
