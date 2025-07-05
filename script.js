// This is the main function that runs when the page is loaded.
window.addEventListener('load', function() {
  
  const statusElement = document.getElementById('status');
  const startButton = document.getElementById('start-button');
  
  // STEP 1: Define where to go after we get the location.
  // This is the URL of the standalone Dialogflow Messenger.
  const messengerBaseUrl = 'https://dialogflow.cloud.google.com/v1/integrations/messenger/chat';
  
  // These are the details for YOUR specific agent.
  const agentDetails = {
    project: 'manjunath-vertex-ai',          // Your GCP Project ID
    agent: '33519cdf-cd2e-417c-9fa4-de5482015ec5', // Your Agent ID
    location: 'global'                       // Or your agent's region e.g. 'us-central1'
  };
  
  // This is the function that builds the final URL and sends the user to the chat.
  function redirectToChat(latitude, longitude) {
    // Generate a fresh session ID for a new conversation.
    const sessionId = Math.random().toString(36).substring(7);
    
    // Start building the URL.
    let fullUrl = `${messengerBaseUrl}?project=${agentDetails.project}&agent=${agentDetails.agent}&location=${agentDetails.location}&sessionId=${sessionId}`;
    
    // If we have location data, add it to the URL as a query parameter.
    if (latitude && longitude) {
      const queryParams = {
        user_latitude: latitude.toString(),
        user_longitude: longitude.toString()
      };
      // URL-encode the parameters so they are safe to use in a URL.
      fullUrl += `&queryParams=${encodeURIComponent(JSON.stringify(queryParams))}`;
    }
    
    // Redirect the browser to the new URL.
    window.location.href = fullUrl;
  }

  // STEP 2: Ask for the location.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      // SUCCESS: User clicked "Allow"
      (position) => {
        statusElement.textContent = "Location acquired. Ready to begin.";
        startButton.style.display = 'block'; // Show the button
        
        // When the user clicks the button, redirect them with their location.
        startButton.onclick = function() {
          redirectToChat(position.coords.latitude, position.coords.longitude);
        };
      },
      // ERROR: User clicked "Block"
      (error) => {
        statusElement.innerHTML = `Location not shared. You can still proceed, but emergency features will be disabled.`;
        startButton.style.display = 'block'; // Show the button anyway
        
        // When the user clicks the button, redirect them without location.
        startButton.onclick = function() {
          redirectToChat(null, null);
        };
      }
    );
  } else {
    // Geolocation is not supported at all.
    statusElement.textContent = "Geolocation is not supported by this browser.";
  }
});
