
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({
      'etd-settings': {
        darkMode: 'auto',
        notifications: true,
        autoUpdate: true,
        diffViewMode: 'compact'
      }
    });
    
    chrome.tabs.create({
      url: 'https://myresults.epitest.eu'
    });
  } else if (details.reason === 'update') {
    console.log('Extension mise à jour vers la version', chrome.runtime.getManifest().version);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
  case 'getSettings':
    chrome.storage.local.get(['etd-settings'], (result) => {
      sendResponse(result['etd-settings'] || {});
    });
    return true;
      
  case 'saveSettings':
    chrome.storage.local.set({ 'etd-settings': request.settings }, () => {
      sendResponse({ success: true });
    });
    return true;
      
  case 'showNotification':
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon48.png',
      title: 'Epitech Enhanced',
      message: request.message
    });
    sendResponse({ success: true });
    return true;
      
  case 'getProjectData':
    // Récupérer les données de projet depuis l'API
    fetchProjectData(request.projectName).then(data => {
      sendResponse({ data });
    }).catch(error => {
      sendResponse({ error: error.message });
    });
    return true;
  }
});

async function fetchProjectData(projectName) {
  try {
    const response = await fetch(`https://api.epitest.eu/project/${projectName}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
  case 'toggle-theme':
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleTheme' });
    });
    break;
      
  case 'copy-expected':
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'copyExpected' });
    });
    break;
      
  case 'toggle-diff-view':
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleDiffView' });
    });
    break;
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes['etd-settings']) {
    chrome.tabs.query({ 
      url: ['https://my.epitech.eu/*', 'https://myresults.epitest.eu/*'] 
    }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'settingsChanged',
          settings: changes['etd-settings'].newValue
        });
      });
    });
  }
});

chrome.alarms.create('cleanup', { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    chrome.storage.local.get(['etd-cache'], (result) => {
      const cache = result['etd-cache'] || {};
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000;
      
      Object.keys(cache).forEach(key => {
        if (now - cache[key].timestamp > maxAge) {
          delete cache[key];
        }
      });
      
      chrome.storage.local.set({ 'etd-cache': cache });
    });
  }
});
