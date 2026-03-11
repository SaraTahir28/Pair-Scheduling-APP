async function createMeeting() {
  const response = await fetch("http://localhost:8000/api/create-meeting/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      trainee_email: "trainee@example.com",
      volunteer_email: "volunteer@example.com",
      start_time: "2025-03-12T10:00:00",
      end_time: "2025-03-12T11:00:00"
    })
  });

  const data = await response.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}
