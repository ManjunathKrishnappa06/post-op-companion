// First, find the Dialogflow Messenger element on the page
const dfMessenger = document.querySelector('df-messenger');

// This is the function that will get the location and set the parameters
const setupGeolocation = () => {
  // Check if the browser has the Geolocation feature
  if (navigator.geolocation && dfMessenger) {
    console.log("df-messenger is loaded. Now attempting to get location.");

    navigator.geolocation.getCurrentPosition(
      // SUCCESS: User clicked "Allow"
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(`Success! Setting queryParams: Lat=${lat}, Lon=${lon}`);

        const params = {
          'user_latitude': lat,
          'user_longitude': lon
        };
        dfMessenger.setQueryParameters(params);

        const statusElement = document.getElementById('location-status');
        if (statusElement) statusElement.textContent = "Location shared successfully. The agent is ready.";
      },
      // ERROR: User clicked "Block" or another error occurred
      (error) => {
        console.error(`Geolocation failed: ${error.message}`);
        const statusElement = document.getElementById('location-status');
        if (statusElement) statusElement.textContent = "Location not shared. Location-based features will be unavailable.";
      }
    );
  } else {
    console.log("Geolocation is not supported or df-messenger was not found.");
  }
};

// THIS IS THE MOST IMPORTANT PART:
// We add an event listener. Our `setupGeolocation` function will ONLY run
// after the df-messenger widget fires an event saying it is fully loaded.
dfMessenger.addEventListener('df-messenger-loaded', setupGeolocation);
