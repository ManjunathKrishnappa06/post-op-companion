/ This is the main function that will be executed.
function initializeAgent() {
  // Find the Dialogflow Messenger element on the page.
  const dfMessenger = document.querySelector('df-messenger');

  // If the widget isn't on the page yet, we can't do anything.
  if (!dfMessenger) {
    console.error("Dialogflow Messenger element not found on the page.");
    return;
  }

  // Now, let's get the location.
  if (navigator.geolocation) {
    console.log("Browser supports geolocation. Requesting location...");

    navigator.geolocation.getCurrentPosition(
      // SUCCESS case (user allowed location)
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Location success! Lat: ${latitude}, Lon: ${longitude}`);

        const queryParams = {
          'user_latitude': latitude,
          'user_longitude': longitude
        };

        // Set the parameters on the messenger widget.
        dfMessenger.setQueryParameters(queryParams);

        // Update the status message on the page.
        const statusElement = document.getElementById('location-status');
        if (statusElement) {
          statusElement.textContent = "Location shared successfully. The agent is ready.";
        }
      },
      // ERROR case (user denied location or an error occurred)
      (error) => {
        console.error(`Geolocation failed: ${error.message}`);
        const statusElement = document.getElementById('location-status');
        if (statusElement) {
          statusElement.textContent = "Location not shared. Location-based features are unavailable.";
        }
      }
    );
  } else {
    // This runs if the browser is too old.
    console.log("Geolocation is not supported by this browser.");
    const statusElement = document.getElementById('location-status');
    if (statusElement) {
      statusElement.textContent = "Geolocation is not supported by this browser.";
    }
  }
}

// --- The Execution Part ---
// Instead of waiting for an event, we will run our function
// as soon as the main window of the page has finished loading all its resources.
// This is a very reliable browser event.
window.addEventListener('load', initializeAgent);
