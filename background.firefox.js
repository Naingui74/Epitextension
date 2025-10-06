// Background Script pour Firefox (Manifest v2)
// Gère les événements en arrière-plan et la communication avec les content scripts

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Première installation
    browser.storage.local.set({
      'etd-settings': {
        darkMode: 'auto',
        notifications: true,
        autoUpdate: true,
        diffViewMode: 'compact'
      }
    });
    
    // Ouvrir la page d'accueil après installation
    browser.tabs.create({
      url: 'https://myresults.epitest.eu'
    });
  } else if (details.reason === 'update') {
    // Mise à jour de l'extension
    console.log('Extension mise à jour vers la version', browser.runtime.getManifest().version);
  }
});

// Gestion des messages des content scripts
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getSettings':
      browser.storage.local.get(['etd-settings']).then((result) => {
        sendResponse(result['etd-settings'] || {});
      });
      return true; // Indique une réponse asynchrone
      
    case 'saveSettings':
      browser.storage.local.set({ 'etd-settings': request.settings }).then(() => {
        sendResponse({ success: true });
      });
      return true;
      
    case 'showNotification':
      // Firefox utilise une API différente pour les notifications
      if (browser.notifications) {
        browser.notifications.create({
          type: 'basic',
          iconUrl: 'icon48.png',
          title: 'Epitech Enhanced',
          message: request.message
        });
      }
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

// Fonction pour récupérer les données de projet
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

// Gestion des raccourcis clavier
browser.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'toggle-theme':
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { action: 'toggleTheme' });
      });
      break;
      
    case 'copy-expected':
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { action: 'copyExpected' });
      });
      break;
      
    case 'toggle-diff-view':
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { action: 'toggleDiffView' });
      });
      break;
  }
});

// Surveillance des changements de stockage
browser.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes['etd-settings']) {
    // Notifier tous les content scripts des changements de paramètres
    browser.tabs.query({ url: ['https://my.epitech.eu/*', 'https://myresults.epitest.eu/*'] }).then((tabs) => {
      tabs.forEach(tab => {
        browser.tabs.sendMessage(tab.id, {
          action: 'settingsChanged',
          settings: changes['etd-settings'].newValue
        });
      });
    });
  }
});

// Nettoyage périodique du cache
browser.alarms.create('cleanup', { periodInMinutes: 60 });
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    // Nettoyer les anciennes données de cache
    browser.storage.local.get(['etd-cache']).then((result) => {
      const cache = result['etd-cache'] || {};
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 heures
      
      Object.keys(cache).forEach(key => {
        if (now - cache[key].timestamp > maxAge) {
          delete cache[key];
        }
      });
      
      browser.storage.local.set({ 'etd-cache': cache });
    });
  }
});
