import { useEffect, useState } from "react";
import App from "./App";
import Login from "./components/pages/Login";
import { AuthProvider } from "./AuthContext";
import api from "./api/axiosClient";

export default function ProtectedApp() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    api
      .get("/auth/user/")
      .then((res) => {
        setUser(res.data ?? null);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  // Fetch CSRF ONLY after user is logged in
  useEffect(() => {
    if (user && user.id) {
      api.get("/auth/csrf/");
    }
  }, [user]);

  //Logout using Axios
  function handleLogout() {
    api
      .post("/auth/logout/")
      .then(() => {
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
