import React from "react";

export default function Login() {
  return (
    <div className="login-container">
      <h1>Welcome</h1>
      <p>Please sign in to continue</p>

      <button
        onClick={() => window.location.href = "http://localhost:8000/accounts/google/login/"}
      >
        Continue with Google
      </button>
    </div>
  );
}