// This is the main function that runs when the page is fully loaded.
window.addEventListener('load', function () {

  // Create the widget dynamically. This part is correct.
  const container = document.getElementById('df-messenger-container');
  const dfMessenger = document.createElement('df-messenger');

  const sessionID = Math.random().toString(36).substring(7);
  dfMessenger.setAttribute('session-id', sessionID);
  dfMessenger.setAttribute('intent', 'WELCOME');
  dfMessenger.setAttribute('chat-title', 'Post-Op Monitor');
  dfMessenger.setAttribute('agent-id', '33519cdf-cd2e-417c-9fa4-de5482015ec5');
  dfMessenger.setAttribute('language-code', 'en');
  container.appendChild(dfMessenger);

  // --- THIS IS THE NEW, CORRECT LOGIC ---
  // We listen for the 'df-request-fulfilled' event. This event fires
  // right after the agent sends its first "Welcome" message.
  dfMessenger.addEventListener('df-request-fulfilled', function (event) {

    // At this point, we can start the geolocation process.
    const statusElement = document.getElementById('location-status');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // SUCCESS: We got the location.
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log(`Location success: Lat=${lat}, Lon=${lon}`);
          if (statusElement) statusElement.textContent = "Location shared. Ready to assist.";

          // THIS IS THE KEY: We create a new event to send back to the agent.
          // This event will trigger an intent in Dialogflow and pass the
          // parameters at the same time.
          const locationEvent = {
            event: 'event-location-received',
            parameters: {
              user_latitude: lat.toString(),
              user_longitude: lon.toString()
            }
          };
          // Send the event to the agent.
          dfMessenger.sendRequest('event', locationEvent);
        },
        // ERROR: We could not get the location.
        (error) => {
          console.error(`Geolocation error: ${error.message}`);
          if (statusElement) statusElement.textContent = "Location not shared. Features unavailable.";
        }
      );
    }
  });
});
