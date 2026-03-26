// checkstatus -> show VolunteerAvailabilityForm -> save - send obj with status true
// or straight to dash
// TODO:
//design changed for better ux, clarify if i need to send with flag or no

// subsequent check for flag or check for slots - check with D
// once onboarded
// check with team - add a flag to db as omnoarded so
// 1 check for flag only - add flag expiry
// or 2 check for slots in db since we have a table ther epermanently?
// at the end of 3 months they see the form again

// 3 states of the form in bookings-col
// hasCompletedOnboarding: false 1st login :set
// preview prefilled viev before edit inactive :view
// prefilled edit :edit
// on VolunteerOnboarding set state as false hasCompletedOnboparding

///////////
// routing
//on
{
path: "/volunteer-dash/:urlWord?",
element: <VolunteerDash />
},

///////////
// conditional rendering on volunteer dash

const VolunteerDash = () => {
    // changed from id 
    const { urlWord } = useParams();
    
    // const activeVolunteer = { };

    // slotsObj from the form
    const handleSaveSlots = (slotsObj) => {
        console.log("in dash", slotsObj);
        
        // here i will save to db later
        // status changes true after save
        alert("saved slots for: " + slotsObj.day);
    };
return (

<div className="bookings-col">
            {urlWord === "add-slots" && <VolunteerAvailabilityForm mode="add" />}

    		{urlWord === "view-slots" && (
    			<VolunteerAvailabilityForm mode="view" />
    		)}

    		{urlWord === "edit-slots" && (
    			<VolunteerAvailabilityForm mode="edit" />
    		)}

    		{urlWord &&
    			!["add-slots", "view-slots", "edit-slots"].includes(urlWord) && (
    				<VolunteerViewSession />
    			)}

    		{!urlWord && (
    			<div className="all-cards-container">
    				<h2 className="bookings-heading-selectdt">Upcoming sessions</h2>
    				{/* render session*/}
    			</div>
    		)}
    	</div>
    );

};
