# Pair Scheduling FE

1 The Tech Stack
React + Vite: Vite instead of create-react-app
difference: create-react-app vs vite - main file will be main.jsx instead of index.js and as it is faster build time
.jsx for components

Tailwind CSS v3: Used with @apply directive in CSS to keep HTML clean.
Utility classes instead of pre-built components like bootstrap to have more control over the design.

Atomic Design: Atoms (UI components) → Molecules (Groups) → Organisms (Sections) → Pages.

App.jsx - state and layout.

2 Empty project scaffolding build instructions
To build a React app scaffolding
npm create vite@5 . -- --template react
npm install
npm install -D tailwindcss@3.4 postcss autoprefixer (Node 18 compatible)
npx tailwindcss init -p

3 Tailwind setup
Config note postcss.config.js - ensure file name with a .
export default {
plugins: {
tailwindcss: {},
autoprefixer: {},
},
};

when adding brand colors add to taiwind.config.js in theme: {
extend: {
colors: {}

if using different opacity use rgb and alpha value then css becomes bg-brand-blue/10 for 10%
colors: {
'brand-blue': 'rgb(var(--brand-blue) / <alpha-value>)',

}
color in root with no ,
--brand-primary: 57 18 255;

Deleted App.css: no component-specific CSS files, instead:
index.css: All custom styles are defined here using the @apply directive

CSS variables in index.css mapped to tailwind.config.js
tailwind cheatsheet here https://tailwindcss.504b.cc/

4
In progress:
UI is currently using hardcoded placeholders, my next task is to finilize the date booking.
So far completed components from screens 1 and 2.
https://www.figma.com/design/kTV3Ox7khtnHyk6TdZy6CQ/Untitled?node-id=35-1112&t=Y3qd4fIAGqwnR8ye-1

---

How to run the project
npm install
npm run dev
