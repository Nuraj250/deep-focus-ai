document.addEventListener('DOMContentLoaded', () => {
    const breakInput = document.getElementById('break-duration');
    const saveButton = document.getElementById('save-settings');
    const siteInput = document.getElementById('blocked-site');
    const addButton = document.getElementById('add-site');
    const siteList = document.getElementById('blocked-sites-list');
  
    // Load saved settings
    chrome.storage.sync.get(['breakDuration', 'blockedSites'], (result) => {
      if (result.breakDuration) breakInput.value = result.breakDuration / 60000;
      if (result.blockedSites) result.blockedSites.forEach(site => addSiteToUI(site));
    });
  
    // Save break duration
    saveButton.addEventListener('click', () => {
      const breakMinutes = parseInt(breakInput.value);
      if (breakMinutes > 0 && breakMinutes <= 60) {
        chrome.storage.sync.set({ breakDuration: breakMinutes * 60000 }, () => {
          alert('Settings saved!');
        });
      }
    });
  
    // Add blocked site
    addButton.addEventListener('click', () => {
      const site = siteInput.value.trim();
      if (site) {
        chrome.storage.sync.get(['blockedSites'], (result) => {
          let sites = result.blockedSites || [];
          if (!sites.includes(site)) {
            sites.push(site);
            chrome.storage.sync.set({ blockedSites: sites }, () => {
              addSiteToUI(site);
              siteInput.value = '';
            });
          }
        });
      }
    });
  
    function addSiteToUI(site) {
      const li = document.createElement('li');
      li.textContent = site;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'X';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', () => removeSite(site));
  
      li.appendChild(deleteBtn);
      siteList.appendChild(li);
    }
  
    function removeSite(site) {
      chrome.storage.sync.get(['blockedSites'], (result) => {
        let sites = result.blockedSites || [];
        sites = sites.filter(s => s !== site);
        chrome.storage.sync.set({ blockedSites: sites }, () => renderSites(sites));
      });
    }
  
    function renderSites(sites) {
      siteList.innerHTML = '';
      sites.forEach(addSiteToUI);
    }
  });
  