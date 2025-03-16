const focusThreshold = 5; // Allow 5 quick tab switches before triggering an alert
let tabSwitchCount = 0;
let lastActivityTime = Date.now();

// Listen for tab switches
chrome.tabs.onActivated.addListener(() => {
  tabSwitchCount++;
  checkProcrastination();
});

// Detect user inactivity
document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keydown", resetInactivityTimer);

function resetInactivityTimer() {
  lastActivityTime = Date.now();
}

// Check if procrastination is detected
function checkProcrastination() {
  const timeSinceLastActivity = (Date.now() - lastActivityTime) / 1000;

  if (tabSwitchCount >= focusThreshold && timeSinceLastActivity > 10) {
    chrome.runtime.sendMessage({ action: "procrastinationDetected" });
    tabSwitchCount = 0; // Reset counter after detection
  }
}
