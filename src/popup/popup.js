// Get elements
const statusText = document.getElementById('status-text');
const toggleButton = document.getElementById('toggle-focus');

// Initial status
let focusMode = false;

// Handle toggle
toggleButton.addEventListener('click', () => {
  focusMode = !focusMode;
  if (focusMode) {
    statusText.textContent = "Active";
    toggleButton.textContent = "Disable Focus Mode";
    chrome.runtime.sendMessage({ action: "enableFocusMode" });
  } else {
    statusText.textContent = "Inactive";
    toggleButton.textContent = "Enable Focus Mode";
    chrome.runtime.sendMessage({ action: "disableFocusMode" });
  }
});

document.getElementById('start-break').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "startBreak" });
  });
