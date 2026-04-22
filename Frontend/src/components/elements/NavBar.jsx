//Navbar component displayed across all pages.
import LogoutButton from "./LogoutButton";
import { useAuth } from "../../AuthContext";

import { Link } from "react-router-dom";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="nav-div">
      <div className="logo">
        <Link to="/" className="text-dark">
          <h1 className="title-lg">CYF Pair Scheduler</h1>
        </Link>
      </div>

      <div className="nav-buttons-div">
        {user && <span className="greeting">Hello, {user.name}</span>}
        <LogoutButton />
      </div>
    </nav>
  );
}
