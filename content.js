let isUpdatingProjects = false;
let projects = {};

function createProgressBar(percentage) {
  const container = document.createElement('div');
  container.className = 'etd-progress remove-on-percentage-update';
  
  const progressWrapper = document.createElement('div');
  progressWrapper.className = 'etd-progress-wrapper';
  
  const progressBar = document.createElement('div');
  progressBar.className = 'etd-progress-bar';
  
  const color = percentage >= 75 ? "#22c55e" : 
                percentage >= 25 ? "#f97316" : 
                "#ef4444";
  
  const progressFill = document.createElement('div');
  progressFill.className = 'etd-progress-fill';
  progressFill.style.width = `${percentage}%`;
  progressFill.style.backgroundColor = color;
  
  const progressText = document.createElement('div');
  progressText.className = 'etd-progress-text';
  progressText.style.color = isDarkMode() ? '#f9fafb' : (percentage > 75 ? '#fff' : '#1e293b');
  progressText.textContent = `${percentage}%`;
  
  progressBar.appendChild(progressFill);
  progressBar.appendChild(progressText);
  progressWrapper.appendChild(progressBar);
  container.appendChild(progressWrapper);
  
  if (isDarkMode()) {
    container.classList.add('etd-dark-mode');
  }
  
  return container;
}
// Utility functions

function computeDiff(got, expected) {
  const gotLines = got.split('\n');
  const expectedLines = expected.split('\n');
  const diffLines = [];
  const maxLength = Math.max(gotLines.length, expectedLines.length);

  for (let i = 0; i < maxLength; i++) {
    const gotLine = gotLines[i] || '';
    const expectedLine = expectedLines[i] || '';

    if (gotLine === expectedLine) {
      diffLines.push({ type: 'normal', content: gotLine, lineNumber: i + 1 });
    } else {
      if (gotLine) {
        diffLines.push({ type: 'removed', content: gotLine, lineNumber: i + 1 });
      }
      if (expectedLine) {
        diffLines.push({ type: 'added', content: expectedLine, lineNumber: i + 1 });
      }
    }
  }

  return diffLines;
}

function createDiffViewer(diffLines) {
  const container = document.createElement('div');
  container.className = 'etd-container';
  if (isDarkMode()) {
    container.classList.add('etd-dark-mode');
  }

  // Header with enhanced UI
  const header = document.createElement('div');
  header.className = 'etd-header';
  
  const titleSection = document.createElement('div');
  titleSection.className = 'etd-title-section';
  
  const title = document.createElement('div');
  title.className = 'etd-title';
  title.textContent = 'Test Diff Viewer';
  
  const subtitle = document.createElement('div');
  subtitle.className = 'etd-subtitle';
  subtitle.textContent = `${diffLines.length} line${diffLines.length !== 1 ? 's' : ''} compared`;
  
  titleSection.append(title, subtitle);
  
  const actions = document.createElement('div');
  actions.className = 'etd-actions';
  
  // Enhanced action buttons
  const copyBtn = document.createElement('button');
  copyBtn.className = 'etd-button';
  copyBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
  copyBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = diffLines.map(line => 
      `${line.type === 'normal' ? ' ' : line.type === 'added' ? '+' : '-'} ${line.content}`
    ).join('\n');
    copyToClipboard(text);
  };
  
  const themeBtn = document.createElement('button');
  themeBtn.className = 'etd-button';
  themeBtn.setAttribute('data-theme-toggle', 'true');
  const isDark = isDarkMode();
  updateThemeButtonIcon(themeBtn, isDark);
  themeBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDarkMode();
  };
  
  actions.append(copyBtn, themeBtn);
  header.append(titleSection, actions);
  
  // Stats bar
  const statsBar = document.createElement('div');
  statsBar.className = 'etd-stats-bar';
  
  const stats = diffLines.reduce((acc, line) => {
    acc[line.type]++;
    return acc;
  }, { normal: 0, added: 0, removed: 0 });
  
  const createStat = (label, count, type) => {
    const stat = document.createElement('div');
    stat.className = `etd-stat etd-stat-${type}`;
    stat.innerHTML = `
      <span class="etd-stat-label">${label}</span>
      <span class="etd-stat-count">${count}</span>
    `;
    return stat;
  };
  
  statsBar.append(
    createStat('Unchanged', stats.normal, 'normal'),
    createStat('Added', stats.added, 'added'),
    createStat('Removed', stats.removed, 'removed')
  );
  
  // Diff content with line numbers
  const diffContent = document.createElement('div');
  diffContent.className = 'etd-diff';
  
  diffLines.forEach(line => {
    const lineElement = document.createElement('div');
    lineElement.className = `etd-diff-line ${line.type !== 'normal' ? `etd-diff-${line.type}` : ''}`;
    
    const lineNumber = document.createElement('span');
    lineNumber.className = 'etd-diff-line-number';
    lineNumber.textContent = line.lineNumber;
    
    const content = document.createElement('span');
    content.className = 'etd-diff-content';
    content.textContent = line.content;
    
    lineElement.append(lineNumber, content);
    diffContent.appendChild(lineElement);
  });
  
  container.append(header, statsBar, diffContent);
  return container;
}

function isDarkMode() {
  return localStorage.getItem('etd-dark-mode') === 'true' || 
         (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

function toggleDarkMode() {
  const isDark = !document.body.classList.contains('etd-dark-mode');
  document.body.classList.toggle('etd-dark-mode', isDark);
  localStorage.setItem('etd-dark-mode', isDark);
  
  // Update all theme toggle buttons
  document.querySelectorAll('.etd-theme-toggle').forEach(button => {
    updateThemeButtonIcon(button, isDark);
  });
}

function updateThemeButtonIcon(button, isDark) {
  button.className = `etd-theme-toggle ${isDark ? 'dark-mode' : 'light-mode'}`;
  button.innerHTML = `
    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
    <span>${isDark ? 'Light Mode' : 'Dark Mode'}</span>
  `;
}
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied to clipboard!', 'success');
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `etd-notification etd-notification-${type}`;
  
  const icon = document.createElement('span');
  icon.className = 'etd-notification-icon';
  icon.innerHTML = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  
  const text = document.createElement('span');
  text.textContent = message;
  
  notification.append(icon, text);
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('etd-notification-fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function calculateProjectPercentage(project) {
  if (!project?.results?.skills) return 0;
  
  const skills = project.results.skills;
  let total_test = 0;
  let passed_test = 0;

  for (const task in skills) {
    if (skills.hasOwnProperty(task)) {
      total_test += skills[task].count || 0;
      passed_test += skills[task].passed || 0;
    }
  }

  return total_test === 0 ? 0 : Number((passed_test / total_test * 100).toFixed(1));
}

async function fetchProjects() {
  const hash = window.location.hash;
  if (!hash) return;

  const match = hash.match(/#[ym]\/(\d{4})/);
  if (!match) return;

  const year = match[1];
  const token = localStorage.getItem("argos-api.oidc-token")?.replace(/^"|"$/g, "");
  
  if (!token) return;

  try {
    const response = await fetch(`https://api.epitest.eu/me/${year}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return;

    const data = await response.json();
    if (Array.isArray(data)) {
      projects = {};
      for (const element of data) {
        if (element?.project?.name) {
          projects[element.project.name] = element;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
}

async function updateProjectPercentages() {
  if (isUpdatingProjects) return;
  isUpdatingProjects = true;

  try {
    document.querySelectorAll('.remove-on-percentage-update').forEach(safeRemoveElement);

    if (Object.keys(projects).length === 0) {
      await fetchProjects();
    }

    const projectCards = document.querySelectorAll(".mdl-card");
    if (!projectCards.length) return;
    
    for (const card of projectCards) {
      if (!card?.isConnected) continue;

      const titleSpan = card.querySelector(".mdl-card__title-text span");
      if (!titleSpan) continue;

      const projectName = titleSpan.textContent.trim();
      const project = projects[projectName];
      if (!project) continue;

      const percentage = calculateProjectPercentage(project);
      const progressBar = createProgressBar(percentage);
      
      if (!progressBar || !card.isConnected) continue;

      const titleSection = card.querySelector(".mdl-card__title");
      if (!titleSection?.parentNode?.isConnected) continue;

      titleSection.parentNode.insertBefore(progressBar, titleSection.nextSibling);
    }
  } catch (error) {
    console.error('Error updating project percentages:', error);
  } finally {
    isUpdatingProjects = false;
  }
}

function safeRemoveElement(element) {
  try {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  } catch (e) {
    console.error('Error removing element:', e);
  }
}

function processFailDetails(failDetails) {
  if (!failDetails || failDetails.hasAttribute('data-processed')) return;
  
  failDetails.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const failText = this.textContent;
    if (!failText) return;

    const failMatches = failText.match(/# Got:[\s\S]*?# But expected:[\s\S]*?#/);
    if (!failMatches) return;

    const failBlock = failMatches[0];
    const gotMatch = failBlock.match(/# Got:\n([\s\S]*?)# But expected:/);
    const expectedMatch = failBlock.match(/# But expected:\n([\s\S]*?)#/);
    
    if (!gotMatch || !expectedMatch) return;

    const gotContent = gotMatch[1].trim();
    const expectedContent = expectedMatch[1].trim();
    
    if (!gotContent && !expectedContent) return;

    const diffLines = computeDiff(gotContent, expectedContent);
    const diffViewer = createDiffViewer(diffLines);
    
    const testContainer = this.closest('.test-container') || 
                         this.closest('.test-result') || 
                         this.parentNode;
    
    if (testContainer) {
      const existingViewer = testContainer.querySelector('.etd-container');
      if (existingViewer) {
        existingViewer.remove();
      }

      const clickableElements = testContainer.querySelectorAll('a, button, input[type="submit"]');
      clickableElements.forEach(element => {
        element.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }, true);
      });

      const forms = testContainer.querySelectorAll('form');
      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }, true);
      });

      testContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }, true);

      testContainer.insertBefore(diffViewer, this.nextSibling);
    }
  }, true);

  failDetails.setAttribute('data-processed', 'true');
}

let updateTimeoutId = null;
const UPDATE_INTERVAL = 1000;

function updateProjectPercentagesWithDelay() {
  if (updateTimeoutId) {
    window.clearTimeout(updateTimeoutId);
  }
  updateTimeoutId = window.setTimeout(updateProjectPercentages, UPDATE_INTERVAL);
}

function addDarkModeToggle() {
  const header = document.querySelector('.mdl-layout__header-row');
  if (!header) return;

  const darkModeButton = document.createElement('button');
  const isDark = isDarkMode();
  darkModeButton.className = `etd-theme-toggle ${isDark ? 'dark-mode' : 'light-mode'}`;
  darkModeButton.style.marginLeft = 'auto';
  darkModeButton.style.marginRight = '20px';
  
  updateThemeButtonIcon(darkModeButton, isDark);
  
  darkModeButton.onclick = () => toggleDarkMode();
  header.appendChild(darkModeButton);

  // Initialize dark mode if needed
  if (isDark) {
    document.body.classList.add('etd-dark-mode');
  }
}

function init() {
  let currentPath = window.location.href;
  
  // Initialize dark mode
  const isDark = isDarkMode();
  if (isDark) {
    document.body.classList.add('etd-dark-mode');
  }
  
  // Add dark mode toggle button
  addDarkModeToggle();
  
  // Watch for system dark mode changes
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addListener((e) => {
    if (localStorage.getItem('etd-dark-mode') === null) {
      document.body.classList.toggle('etd-dark-mode', e.matches);
    }
  });
  
  // Process any existing fail details first
  document.querySelectorAll('.fail-details').forEach(processFailDetails);

  // Watch for test failures
  const testObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            const failDetails = [
              ...(node.classList?.contains('fail-details') ? [node] : []),
              ...node.querySelectorAll('.fail-details')
            ];
            
            failDetails.forEach(detail => {
              if (!detail.hasAttribute('data-processed')) {
                processFailDetails(detail);
              }
            });
          }
        });
      }
    });
  });

  testObserver.observe(document.body, { 
    childList: true, 
    subtree: true 
  });

  // Project percentage observer
  const projectObserver = new MutationObserver(() => {
    if (!window.location.href.includes('my.epitech.eu')) return;
    
    if (currentPath !== window.location.href) {
      currentPath = window.location.href;
      projects = {};
      updateProjectPercentagesWithDelay();
    } else {
      updateProjectPercentagesWithDelay();
    }
  });

  projectObserver.observe(document.body, { 
    childList: true, 
    subtree: true
  });

  window.addEventListener('hashchange', () => {
    if (window.location.href.includes('my.epitech.eu')) {
      projects = {};
      updateProjectPercentagesWithDelay();
    }
  });

  if (window.location.href.includes('my.epitech.eu')) {
    updateProjectPercentages();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
