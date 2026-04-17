import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {},
    env: {
      apiUrl: "http://localhost:8000",
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "cypress/tests/**/*.cy.{js,jsx,ts,tsx}",
  },
});
