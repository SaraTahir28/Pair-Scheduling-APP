# Pair Scheduling FE

1. The Tech Stack
   React + Vite: Fast build times and modern ES module support.

Tailwind CSS v3: Utility-first CSS using the @apply directive in index.css to keep HTML clean.

Cypress: End-to-end UI testing framework.

Atomic Design: Organized by Atoms, Molecules, Organisms, and Pages.

2. Getting Started
   To get the project running locally on your machine:

Clone the repository and navigate to the folder.

Install dependencies:

Bash
npm install
Environment Setup:

Create a .env file in the root directory.

Copy the keys from .env.example and add your local values (e.g., Google Client ID).

Run the development server:

Bash
npm run dev
The app will be available at http://localhost:5173/.

3. Testing
   We use Cypress for UI testing. It is installed as a devDependency to keep our production build small.

To run tests:

Ensure your development server is running (npm run dev).

Open the Cypress test runner:

Bash
npm run cypress:open

4. Backend Integration: Form submissions are sent to http://localhost:8000/api/create-meeting/.
