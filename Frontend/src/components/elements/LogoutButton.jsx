import { useAuth } from "../../AuthContext";
import { ActionBtn } from "./Button"; // reusing existing button design

export default function LogoutButton({ additionalBtnClass }) {
  const { logout } = useAuth();

  return (
    <ActionBtn
      onClick={logout}
      additionalBtnClass={
        additionalBtnClass || "bg-red-500 hover:bg-red-600 text-white"
      }
    >
      Logout
    </ActionBtn>
  );
}
