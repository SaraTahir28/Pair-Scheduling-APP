//Navbar component displayed across all pages.
import LogoutButton from "./LogoutButton";
import { useAuth } from "../../AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="flex items-center justify-between bg-gray-100 p-4 shadow-md">
      <div className="logo">
        <h1 className="text-xl font-bold text-gray-800">CYF Pair Scheduler</h1>
      </div>

      <div className="user-section flex items-center gap-4">
        {user && <span className="text-gray-700">Hello, {user.name}</span>}
        <LogoutButton />
      </div>
    </nav>
  );
}
