import { useAuth } from "../../AuthContext";
import { ActionBtn } from "./Button";

export default function LogoutButton({ additionalBtnClass }) {
  const { logout } = useAuth();

  return (
    <ActionBtn
      onClick={logout}
      ariaLabel="Logout"
      additionalBtnClass={"btn-secondary"}
    >
      Logout
    </ActionBtn>
  );
}
