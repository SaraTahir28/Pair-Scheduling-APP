import { useAuth } from "../../AuthContext";
import { ActionBtn } from "./Button"; 

export default function LogoutButton({ additionalBtnClass }) {
  const { logout } = useAuth();

  return (
    <ActionBtn
      onClick={logout}
      additionalBtnClass={
        "btn-secondary" || "bg-red-500 hover:bg-red-600 text-white"
      }
    >
      Logout
    </ActionBtn>
  );
}
