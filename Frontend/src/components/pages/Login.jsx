import { useEffect, useState } from "react";

export default function Login() {
	const [googleUrl, setGoogleUrl] = useState("");

	useEffect(() => {
		// Fetch the correct Google login URL from django-allauth
		setGoogleUrl("http://localhost:8000/accounts/google/login/");
	}, []);

	const handleGoogleLogin = () => {
		if (!googleUrl) {
			console.error("Google login URL not loaded yet");
			return;
		}
		// Redirect directly to Allauth Google login
		window.location.href = googleUrl;
	};

	return (
		<div className="login-container">
			<h1>Welcome</h1>
			<p>Please sign in to continue</p>

			<button onClick={handleGoogleLogin}>Continue with Google</button>
		</div>
	);
}
