let focusMode = false;
let currentTabId = null;
let focusStartTime = null;
let breakActive = false;
let breakDuration = 300000; // 5 minutes (adjustable)

// Default blocked websites list
const blockedSites = ['facebook.com', 'youtube.com', 'twitter.com'];  // Add more as needed

// Listen for messages from popup.js to enable/disable focus mode
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'enableFocusMode') {
    enableFocusMode();
  } else if (message.action === 'disableFocusMode') {
    disableFocusMode();
  }
});

// Enable focus mode
function enableFocusMode() {
  focusMode = true;
  focusStartTime = Date.now();
  startMonitoringTabs();
  console.log('Focus Mode Activated!');
}

// Disable focus mode
function disableFocusMode() {
  focusMode = false;
  stopMonitoringTabs();
  console.log('Focus Mode Deactivated!');
}

// Start monitoring tabs for procrastination
function startMonitoringTabs() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    currentTabId = tabs[0].id;
    monitorTabActivity(currentTabId);
  });
}

// Stop monitoring tabs
function stopMonitoringTabs() {
  chrome.tabs.removeListener('onUpdated', monitorTabActivity);
}

// Monitor tab activity to detect procrastination
function monitorTabActivity(tabId) {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (focusMode && tab.id === currentTabId) {
      const domain = new URL(tab.url).hostname;
      
      // Check if user is visiting a blocked site
      if (blockedSites.some(site => domain.includes(site))) {
        chrome.tabs.update(tab.id, { url: 'about:blank' });
      }

      // Simple rule-based AI for detecting focus slipping (tab switching, idle time, etc.)
      const timeElapsed = Date.now() - focusStartTime;
      if (timeElapsed > 600000 && (tab.active && tab.url !== 'about:blank')) { // 10 min of focus
        suggestFocusBoost();
      }
    }
  });
}

// Suggest a focus-boosting exercise
function suggestFocusBoost() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'assets/icon-48.png',
    title: 'Focus Boost!',
    message: 'It’s time for a quick focus-boosting exercise! Take a 2-minute break.',
    priority: 2
  });
}

// AI-based focus detection (using simple heuristics for now)
function analyzeFocusPatterns(tabId) {
  // Add more sophisticated AI/ML models here (e.g., analyzing user activity over time)
  // For now, just log simple tab activity patterns
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const domain = new URL(tabs[0].url).hostname;
    console.log(`User is on: ${domain}`);
  });
}


// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startBreak') {
    startBreak();
  } else if (message.action === 'endBreak') {
    endBreak();
  }
});

// Start a break timer
function startBreak() {
  if (!breakActive) {
    breakActive = true;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon-48.png',
      title: 'Break Started!',
      message: `Enjoy your break! You’ll be redirected back in ${breakDuration / 60000} minutes.`,
      priority: 2
    });

    setTimeout(() => {
      endBreak();
    }, breakDuration);
  }
}

// End the break and refocus the user
function endBreak() {
  if (breakActive) {
    breakActive = false;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon-48.png',
      title: 'Break Over!',
      message: 'Time to get back to work!',
      priority: 2
    });

    // Redirect to work page (e.g., Google Docs)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { url: 'https://docs.google.com/' });
      }
    });
  }
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "procrastinationDetected") {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/icon-48.png",
        title: "Stay Focused!",
        message: "You're switching tabs too frequently. Take a deep breath and refocus!",
        priority: 2
      });
    }
  });