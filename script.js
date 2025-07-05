// This code will run automatically once the entire webpage has loaded.
document.addEventListener("DOMContentLoaded", function() {

  // First, find the Dialogflow Messenger chat widget on the page.
  const dfMessenger = document.querySelector('df-messenger');

  // Check if the user's browser has the Geolocation feature.
  if (navigator.geolocation) {

    console.log("Browser supports geolocation. Asking for user permission...");

    // This command triggers the browser's permission pop-up.
    navigator.geolocation.getCurrentPosition(

      // ---- This part runs if the user clicks "Allow" ----
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(`Success! Location acquired: Lat=${latitude}, Lon=${longitude}`);

        // This is the most important command. We are telling the Dialogflow
        // widget to attach these parameters to every message it sends.
        const queryParams = {
          'user_latitude': latitude,
          'user_longitude': longitude
        };
        dfMessenger.setQueryParameters(queryParams);

        // Update the status message on the webpage to give user feedback.
        const statusElement = document.getElementById('location-status');
        if (statusElement) {
          statusElement.textContent = "Location shared successfully. The agent is ready.";
        }
      },

      // ---- This part runs if the user clicks "Block" or an error occurs ----
      (error) => {
        console.error(`Geolocation failed: ${error.message}`);
        // Update the status message to inform the user.
        const statusElement = document.getElementById('location-status');
        if (statusElement) {
          statusElement.textContent = "Location not shared. Location-based features will be unavailable.";
        }
      }
    );
  } else {
    // This runs if the browser is very old and doesn't support geolocation.
    console.log("Geolocation is not supported by this browser.");
    const statusElement = document.getElementById('location-status');
    if (statusElement) {
      statusElement.textContent = "Geolocation is not supported by this browser.";
    }
  }
});
