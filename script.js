// This is a simple flag to make sure we only do this once.
let locationSet = false;

// We listen for the 'df-response-received' event. This fires every
// time the user gets a message back from the agent.
const dfMessenger = document.querySelector('df-messenger');
dfMessenger.addEventListener('df-response-received', function () {

  // If we haven't set the location yet, and if geolocation is available...
  if (!locationSet && navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(
      // SUCCESS: We got the location.
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(`Location success! Lat=${lat}, Lon=${lon}. Setting parameters...`);

        // Set the parameters. This will apply to the *next* message the user sends.
        dfMessenger.setQueryParameters({
          'user_latitude': lat.toString(),
          'user_longitude': lon.toString()
        });

        // Flip the flag so we don't do this again.
        locationSet = true;

        const statusElement = document.getElementById('location-status');
        if (statusElement) statusElement.textContent = "Location shared successfully. The agent is ready.";
      },
      // ERROR: Handle failure.
      (error) => {
        console.error(`Geolocation error: ${error.message}`);
        locationSet = true; // Also flip the flag on error so we don't keep trying.
        const statusElement = document.getElementById('location-status');
        if (statusElement) statusElement.textContent = "Location not shared.";
      }
    );
  }
});
