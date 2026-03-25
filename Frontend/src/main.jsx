import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ProtectedApp from "./ProtectedApp.jsx";
import Login from "./components/pages/Login";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ProtectedApp/>
	</StrictMode>
);
