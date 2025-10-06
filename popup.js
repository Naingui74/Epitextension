
document.addEventListener('DOMContentLoaded', async() => {
  await loadSettings();
  
  await loadStats();
  
  setupEventListeners();
});

const browserAPI = (() => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return chrome;
  } else if (typeof browser !== 'undefined' && browser.storage) {
    return browser;
  } else {
    throw new Error('Extension API not available');
  }
})();

async function loadSettings() {
  try {
    const result = await browserAPI.storage.local.get(['etd-settings']);
    const settings = result['etd-settings'] || {
      darkMode: 'auto',
      notifications: true,
      autoUpdate: true,
      diffViewMode: 'compact'
    };
    
    document.getElementById('darkMode').value = settings.darkMode;
    document.getElementById('diffView').value = settings.diffViewMode;
    
    const notificationsToggle = document.getElementById('notifications');
    const autoUpdateToggle = document.getElementById('autoUpdate');
    
    if (settings.notifications) {
      notificationsToggle.classList.add('active');
    }
    
    if (settings.autoUpdate) {
      autoUpdateToggle.classList.add('active');
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error);
  }
}

async function loadStats() {
  try {
    const result = await browserAPI.storage.local.get(['etd-stats']);
    const stats = result['etd-stats'] || {
      testsAnalyzed: 0,
      projectsTracked: 0,
      lastUpdate: Date.now()
    };
    
    document.getElementById('testsAnalyzed').textContent = stats.testsAnalyzed;
    document.getElementById('projectsTracked').textContent = stats.projectsTracked;
    
    const settings = await browserAPI.storage.local.get(['etd-settings']);
    const darkMode = settings['etd-settings']?.darkMode || 'auto';
    document.getElementById('darkModeStatus').textContent = 
      darkMode === 'auto' ? 'Auto' : darkMode === 'dark' ? 'Sombre' : 'Clair';
      
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
  }
}

function setupEventListeners() {
  // Toggles
  document.getElementById('notifications').addEventListener('click', function() {
    this.classList.toggle('active');
  });
  
  document.getElementById('autoUpdate').addEventListener('click', function() {
    this.classList.toggle('active');
  });
  
  // Boutons
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
  document.getElementById('resetSettings').addEventListener('click', resetSettings);
  
  // Sélecteurs
  document.getElementById('darkMode').addEventListener('change', function() {
    // Mettre à jour immédiatement le statut affiché
    const status = this.value === 'auto' ? 'Auto' : 
      this.value === 'dark' ? 'Sombre' : 'Clair';
    document.getElementById('darkModeStatus').textContent = status;
  });
}

async function saveSettings() {
  try {
    const settings = {
      darkMode: document.getElementById('darkMode').value,
      diffViewMode: document.getElementById('diffView').value,
      notifications: document.getElementById('notifications').classList.contains('active'),
      autoUpdate: document.getElementById('autoUpdate').classList.contains('active')
    };
    
    await browserAPI.storage.local.set({ 'etd-settings': settings });
    
    const tabs = await browserAPI.tabs.query({ url: ['https://my.epitech.eu/*', 'https://myresults.epitest.eu/*'] });
    for (const tab of tabs) {
      try {
        await browserAPI.tabs.sendMessage(tab.id, {
          action: 'settingsChanged',
          settings
        });
      } catch (error) {
        // Ignorer les erreurs si le content script n'est pas chargé
      }
    }
    
    showNotification('Paramètres sauvegardés !', 'success');
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    showNotification('Erreur lors de la sauvegarde', 'error');
  }
}

async function resetSettings() {
  if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
    try {
      await browserAPI.storage.local.remove(['etd-settings']);
      await loadSettings();
      showNotification('Paramètres réinitialisés', 'success');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      showNotification('Erreur lors de la réinitialisation', 'error');
    }
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Ajouter les styles d'animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
