import { useEffect, useState } from "react";
import App from "./App";
import Login from "./components/pages/Login";
import { AuthProvider } from "./AuthContext";


export default function ProtectedApp() {

  const [user, setUser] = useState(undefined);

  
  useEffect(() => {
    fetch("http://localhost:8000/auth/user/", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) return null;
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

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
      })
      .catch(() => {
        alert("Could not log out. Please try again.");
      });
  }

  
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  
  if (!user || !user.id) {
    return <Login />;
  }

  return (
    <AuthProvider value={{ user, logout: handleLogout }}>
      <App />
    </AuthProvider>
  );
}
