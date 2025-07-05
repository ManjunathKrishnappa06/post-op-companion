// This function will run as soon as the main window is loaded.
window.addEventListener('load', function () {

  // --- PART 1: CREATE THE WIDGET WITH A NEW SESSION ID ---

  // Generate a new, random session ID every time the page loads.
  const sessionID = Math.random().toString(36).substring(7);
  console.log(`Creating new agent session with ID: ${sessionID}`);

  // Find the container element we made in our HTML.
  const container = document.getElementById('df-messenger-container');

  // Create a brand new <df-messenger> element from scratch.
  const dfMessenger = document.createElement('df-messenger');

  // Set all the necessary attributes on the new element.
  dfMessenger.setAttribute('intent', 'WELCOME');
  dfMessenger.setAttribute('chat-title', 'Post-Op Monitor');
  dfMessenger.setAttribute('agent-id', '33519cdf-cd2e-417c-9fa4-de5482015ec5'); // Your Agent ID
  dfMessenger.setAttribute('language-code', 'en');
  dfMessenger.setAttribute('session-id', sessionID); // <-- The new, random ID is set here!

  // Add the fully constructed element to our container on the page.
  container.appendChild(dfMessenger);

  // --- PART 2: CONFIGURE GEOLOCATION ---
  // We will wait for the 'df-messenger-loaded' event to safely configure it.

  dfMessenger.addEventListener('df-messenger-loaded', function () {
    console.log("df-messenger is loaded. Now configuring geolocation.");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // SUCCESS
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log(`Success! Setting queryParams: Lat=${lat}, Lon=${lon}`);

          const params = { 'user_latitude': lat.toString(), 'user_longitude': lon.toString() };
          dfMessenger.setQueryParameters(params);

          const statusElement = document.getElementById('location-status');
          if (statusElement) statusElement.textContent = "Location shared successfully. The agent is ready.";
        },
        // ERROR
        (error) => {
          console.error(`Geolocation failed: ${error.message}`);
          const statusElement = document.getElementById('location-status');
          if (statusElement) statusElement.textContent = "Location not shared. Features unavailable.";
        }
      );
    } else {
      console.log("Geolocation is not supported.");
      const statusElement = document.getElementById('location-status');
      if (statusElement) statusElement.textContent = "Geolocation is not supported.";
    }
  });
});
