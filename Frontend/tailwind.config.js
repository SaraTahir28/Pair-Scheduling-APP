/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"brand-primary": "rgb(var(--brand-primary) / <alpha-value>)",
				"brand-blue": "rgb(var(--brand-blue) / <alpha-value>)",
				dark: "var(--text-dark)",
				main: "var(--text-main)",
				muted: "var(--text-muted)",
				"border-color": "var(--border-color)",
			},
		},
	},
	plugins: [],
};
