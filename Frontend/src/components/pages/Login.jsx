import { useEffect, useState } from "react";

export default function Login() {
  const googleLoginUrl = `${import.meta.env.VITE_API_URL}/accounts/google/login/?process=login&next=${window.location.origin}/`;

  const handleGoogleLogin = () => {
    // Redirect straight to Google via Django
    window.location.href = googleLoginUrl;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="login-box flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-border-color bg-white p-10 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-dark">
          Welcome to CYF Pair Scheduler
        </h1>
        <p className="text-center text-main">
          Schedule your pair programming sessions quickly and easily!
        </p>

        {/* Google-style button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          aria-label="Sign in with Google"
          className="flex w-full items-center justify-center gap-3 rounded-full border border-border-color bg-white py-3 font-bold text-main transition-all hover:bg-gray-50"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Info for users without Google account */}
        <p className="mt-2 text-center text-sm text-muted">
          You need a Google account to use this app.If you dont have a Google
          Account{" "}
          <a
            href="https://accounts.google.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-blue hover:underline"
          >
            Create one here
          </a>
        </p>
      </div>
    </div>
  );
}
