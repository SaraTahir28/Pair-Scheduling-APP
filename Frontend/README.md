# Pair Scheduling FE

1 The Tech Stack
React + Vite: Vite instead of create-react-app
difference: create-react-app vs vite - main file will be main.jsx instead of index.js and as it is faster build time
.jsx for components

Tailwind CSS v3: Used with @apply directive in CSS to keep HßTML clean.
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

4 React info
Breakdown of how it works between components:
App.jsx keeps the logic, controls the data and can change the state.
when state changes, react re-rednders the UI.

explanation of state
// const arrayWithCurrentMonthAndFunctionToChangeMonth = useState(setDefaultMonthView)
// const currentDate = arrayWithCurrentMonthAndFunctionToChangeState[0] //whole march obj
// const funcToChangeMonth = arrayWithCurrentMonthAndFunctionToChangeMonth[1] // prev next
// const [currentDate, funcToChangeMonth] = arrayWithCurrentMonthAndFunctionToChangeMonth;
//destructured shorter:
const [currentDate, funcToChangeMonth] = useState(setDefaultMonthView);

example on Calendar component and App
useState() hook is in App.jsx
const [userClickedOnDate, setUserClickedOnDate] = useState(null);

state is passed to Calendar component as props when App renders
<Calendar
	userClickedOnDateFromApp={userClickedOnDate}
	setUserClickedOnDateFromApp={setUserClickedOnDate}
/>
then in Calendar component
const Calendar = ({
userClickedOnDateFromApp,
setUserClickedOnDateFromApp,
}) => { passed in a props
react sees change in state and re renders

5 Completed
completed screens from figma
https://www.figma.com/design/kTV3Ox7khtnHyk6TdZy6CQ/Untitled?node-id=35-1112&t=Y3qd4fIAGqwnR8ye-1
created volunteer object for getting availability data
Form submission now sends bookingDetailsObj to http://localhost:8000/create-meeting/ - note obj needs to be fixed with time
Fixed layout if sections and added styling to form

TO DO:
Time Format: start_time format is not yet finalized for Google Calendar API.
End Time: end_time logic needs to be fixed/standardized on the frontend before production.
Volunteer Selection: Need to add a UI component to select different volunteers from the object.

---

How to run the project
npm install
npm run dev
