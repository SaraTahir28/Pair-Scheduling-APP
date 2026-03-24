import { StrictMode } from "react"; // StrictMode helps detect potential problems in React components
import { createRoot } from "react-dom/client"; // new React root API
// import { BrowserRouter, Routes, Route } from "react-router-dom"; // routing for multiple pages

import "./index.css"; // global styles for the app
import ProtectedApp from "./ProtectedApp.jsx"; // main app wrapper that handles authentication
// import Login from "./pages/Login";       // login page component

// Create a React root and render the application
createRoot(document.getElementById("root")).render(
	<StrictMode>
		{/* BrowserRouter enables routing based on the URL path */}
		{/* <BrowserRouter>
      <Routes> */}
		{/* "/" path loads ProtectedApp, which handles auth and either shows App or Login */}
		{/* <Route path="/" element={<ProtectedApp />} /> */}
		<ProtectedApp />
		{/* "/login" path directly renders the Login page (optional, can be used for manual navigation) */}
		{/* <Route path="/login" element={<Login />} />
      </Routes> */}
		{/* </BrowserRouter> */}
	</StrictMode>
);
