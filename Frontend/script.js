
document.getElementById("booking_form").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const jsonObject = {};

    formData.forEach((value, key) => {
        if (key === "start_time" || key === "end_time") {
            // Convert "2026-03-10T14:00" → "2026-03-10T14:00:00Z"
            value = value + ":00Z";
        }
        jsonObject[key] = value;
    });

    const json = JSON.stringify(jsonObject);
    createMeeting(json);
});

async function createMeeting(json) {
  const response = await fetch("http://localhost:8000/api/create-meeting/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json
  });

  const data = await response.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}
