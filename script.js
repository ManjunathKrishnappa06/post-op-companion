// This is a helper function that creates and displays the chat widget.
// It takes the query parameters as an argument.
function createAndShowMessenger(queryParams = {}) {
  // First, we dynamically create the main Dialogflow bootstrap script tag.
  const bootstrapScript = document.createElement('script');
  bootstrapScript.src = "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js";
  document.head.appendChild(bootstrapScript);

  // We wait for the bootstrap script to load before we create the widget element.
  bootstrapScript.onload = () => {
    const container = document.getElementById('df-messenger-container');
    const dfMessenger = document.createElement('df-messenger');

    // Generate and set a new session ID for a fresh conversation.
    const sessionID = Math.random().toString(36).substring(7);
    dfMessenger.setAttribute('session-id', sessionID);
    console.log(`Creating agent with new session ID: ${sessionID}`);

    // Set all the other standard attributes.
    dfMessenger.setAttribute('intent', 'WELCOME');
    dfMessenger.setAttribute('chat-title', 'Post-Op Monitor');
    dfMessenger.setAttribute('agent-id', '33519cdf-cd2e-417c-9fa4-de5482015ec5'); // Your Agent ID
    dfMessenger.setAttribute('language-code', 'en');

    // Add the fully constructed element to our container on the page.
    container.appendChild(dfMessenger);

    // Now that the element exists, we can safely set the query parameters.
    if (Object.keys(queryParams).length > 0) {
       dfMessenger.setQueryParameters(queryParams);
       console.log("Query parameters have been set.", queryParams);
    }
  };
}

// This is the main function that runs when the page loads.
function initialize() {
  const statusElement = document.getElementById('location-status');

  if (navigator.geolocation) {
    console.log("Browser supports geolocation. Requesting permission...");
    navigator.geolocation.getCurrentPosition(
      // SUCCESS: We have the location! NOW we can build the widget.
      (position) => {
        if (statusElement) statusElement.textContent = "Location acquired. Loading agent...";
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const params = {
          'user_latitude': lat.toString(),
          'user_longitude': lon.toString()
        };
        // Call our helper function and pass the location parameters.
        createAndShowMessenger(params);
      },
      // ERROR: We don't have location. Build the widget without it.
      (error) => {
        console.error(`Geolocation failed: ${error.message}`);
        if (statusElement) statusElement.textContent = "Location not shared. Loading agent...";
        // Call our helper function with no parameters.
        createAndShowMessenger();
      }
    );
  } else {
    // Geolocation is not supported. Build the widget without it.
    console.log("Geolocation is not supported by this browser.");
    if (statusElement) statusElement.textContent = "Geolocation not supported. Loading agent...";
    createAndShowMessenger();
  }
}

// Start the whole process when the page finishes loading.
window.addEventListener('load', initialize);
