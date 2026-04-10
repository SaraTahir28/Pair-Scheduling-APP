import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://127.0.0.1:5173",
		setupNodeEvents(on, config) {},
	},

	component: {
		devServer: {
			framework: "react",
			bundler: "vite",
		},
		specPattern: "cypress/tests/**/*.cy.{js,jsx,ts,tsx}",
	},
});
