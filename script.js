// This is the main function that runs when the page is loaded.
window.addEventListener('load', function() {
  const statusElement = document.getElementById('location-status');
  const startButton = document.getElementById('start-button');
  const dfMessenger = document.querySelector('df-messenger');

  // This object will hold our location data once we get it.
  let locationParams = null;

  // This is the function that will start the chat.
  function startChat() {
    console.log("Start button clicked. Initializing chat.");

    // Generate a fresh session ID.
    const sessionID = Math.random().toString(36).substring(7);
    dfMessenger.setAttribute('session-id', sessionID);

    // Make the chat widget visible and open it.
    dfMessenger.style.display = 'block';
    dfMessenger.renderChat();

    // Prepare the initial event request.
    const welcomeEvent = {
      event: 'WELCOME_WITH_PARAMS', // A new custom event name
    };

    // If we successfully got location, add it to the parameters.
    if (locationParams) {
      welcomeEvent.parameters = locationParams;
      console.log("Sending WELCOME event with location:", locationParams);
    } else {
      console.log("Sending WELCOME event without location.");
    }

    // Send the event to Dialogflow to officially start the conversation.
    dfMessenger.sendRequest('event', welcomeEvent);

    // Hide the start button so the user can't click it again.
    startButton.style.display = 'none';
    statusElement.textContent = "Chat started. Please use the widget below.";
  }

  // --- Main Logic: Ask for location first ---
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      // SUCCESS
      (position) => {
        statusElement.textContent = "Location acquired. Click 'Start Check-in' to begin.";
        // Store the location parameters for later.
        locationParams = {
          'user_latitude': position.coords.latitude.toString(),
          'user_longitude': position.coords.longitude.toString()
        };
        startButton.style.display = 'block'; // Show the button
      },
      // ERROR
      (error) => {
        statusElement.textContent = `Location not shared. You can still begin.`;
        startButton.style.display = 'block'; // Show the button anyway
      }
    );
  } else {
    statusElement.textContent = "Geolocation not supported. Click 'Start Check-in' to begin.";
    startButton.style.display = 'block';
  }

  // Add the click listener to our button.
  startButton.addEventListener('click', startChat);
});
