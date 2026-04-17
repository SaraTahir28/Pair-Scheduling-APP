import { useAuth } from "../../AuthContext";
import { ActionBtn } from "./Button"; // reusing existing button design

export default function LogoutButton({ additionalBtnClass }) {
  const { logout } = useAuth();

  return (
    <ActionBtn
      onClick={logout}
      ariaLabel="Logout"
      additionalBtnClass={
        additionalBtnClass || "bg-red-700 hover:bg-red-800 text-white"
      }
    >
      Logout
    </ActionBtn>
  );
}
