// Global state
let isUpdating = false;
let projects = {};
let updateTimeoutId = null;
const UPDATE_INTERVAL = 1000;

// Utility functions
function isDarkMode() {
  const storedPreference = localStorage.getItem('etd-dark-mode');
  if (storedPreference !== null) {
    return storedPreference === 'true';
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function toggleDarkMode() {
  const isDark = !document.body.classList.contains('etd-dark-mode');
  document.body.classList.toggle('etd-dark-mode', isDark);
  localStorage.setItem('etd-dark-mode', isDark);
  
  document.querySelectorAll('.etd-theme-toggle').forEach(button => {
    updateThemeButtonIcon(button, isDark);
  });
}

function updateThemeButtonIcon(button, isDark) {
  if (!button) return;
  
  button.className = `etd-theme-toggle ${isDark ? 'dark-mode' : 'light-mode'}`;
  button.innerHTML = `
    <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
    <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
    <span>${isDark ? 'Light Mode' : 'Dark Mode'}</span>
  `;
}

function addDarkModeToggle() {
  const header = document.querySelector('.mdl-layout__header-row');
  if (!header) {
    // If header not found, retry after a short delay
    setTimeout(addDarkModeToggle, 100);
    return;
  }

  // Remove any existing theme toggle buttons
  header.querySelectorAll('.etd-theme-toggle').forEach(btn => btn.remove());

  const darkModeButton = document.createElement('button');
  const isDark = isDarkMode();
  darkModeButton.className = `etd-theme-toggle ${isDark ? 'dark-mode' : 'light-mode'}`;
  darkModeButton.style.marginLeft = 'auto';
  darkModeButton.style.marginRight = '20px';
  
  updateThemeButtonIcon(darkModeButton, isDark);
  darkModeButton.onclick = () => toggleDarkMode();
  header.appendChild(darkModeButton);

  if (isDark) {
    document.body.classList.add('etd-dark-mode');
  } else {
    document.body.classList.remove('etd-dark-mode');
  }
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

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied to clipboard!', 'success');
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Test analysis functions
function processFailDetails(failDetails) {
  if (!failDetails || failDetails.hasAttribute('data-processed')) return;
  
  failDetails.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const failText = this.textContent;
    if (!failText) return;

    const gotMatch = failText.match(/# Got:\n([\s\S]*?)(?=# But expected:)/);
    const expectedMatch = failText.match(/# But expected:\n([\s\S]*?)(?=#|$)/);
    
    if (!gotMatch || !expectedMatch) return;

    const details = {
      got: gotMatch[1].trim(),
      expected: expectedMatch[1].trim()
    };
    
    const container = createModernTestError(details);
    
    const testContainer = this.closest('.test-container') || 
                         this.closest('.test-result') || 
                         this.parentNode;
    
    if (testContainer) {
      const existingViewer = testContainer.querySelector('.test-dashboard');
      if (existingViewer) {
        existingViewer.remove();
      }

      testContainer.insertBefore(container, this.nextSibling);
    }
  });

  failDetails.setAttribute('data-processed', 'true');
}

function createModernTestError(details) {
  const container = document.createElement('div');
  container.className = 'test-dashboard';
  
  container.innerHTML = `
    <div class="test-header">
      <div class="test-status">
        <div class="test-status-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="test-status-text">
          <h3>Test Failed</h3>
          <p>Output does not match expected result</p>
        </div>
      </div>
      <div class="test-actions">
        <button class="test-action-btn primary" onclick="copyToClipboard('${details.expected.replace(/'/g, "\\'")}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
          </svg>
          Copy Expected
        </button>
        <button class="test-action-btn" onclick="downloadTestOutput('${details.expected.replace(/'/g, "\\'")}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download
        </button>
      </div>
    </div>

    <div class="test-content">
      <div class="test-output-panel">
        <div class="test-output-header">
          <h4>Your Output</h4>
          <span class="test-output-meta">${details.got.split('\n').length} lines</span>
        </div>
        <div class="test-output-content">
          ${formatOutput(details.got, details.expected)}
        </div>
      </div>
      
      <div class="test-output-panel">
        <div class="test-output-header">
          <h4>Expected Output</h4>
          <span class="test-output-meta">${details.expected.split('\n').length} lines</span>
        </div>
        <div class="test-output-content">
          ${formatOutput(details.expected, details.got)}
        </div>
      </div>
    </div>

    <div class="test-analysis">
      <h4>Analysis & Suggestions</h4>
      <div class="test-hints">
        ${generateHints(details)}
      </div>
    </div>
  `;

  return container;
}

function formatOutput(text, compareText) {
  const lines = text.split('\n');
  const compareLines = compareText.split('\n');
  
  return lines.map((line, i) => {
    const isDifferent = line !== compareLines[i];
    const lineNum = i + 1;
    const diffChars = isDifferent ? highlightDiffChars(line, compareLines[i] || '') : line;
    
    return `
      <div class="code-line ${isDifferent ? 'diff' : ''}">
        <span class="line-number">${lineNum}</span>
        <span class="line-content">${diffChars}</span>
      </div>
    `;
  }).join('');
}

function highlightDiffChars(line1, line2) {
  let result = '';
  const maxLength = Math.max(line1.length, line2.length);
  
  for (let i = 0; i < maxLength; i++) {
    const char1 = line1[i] || '';
    const char2 = line2[i] || '';
    
    if (char1 !== char2) {
      // Show the actual character and what it should be
      result += `<span class="char-diff" data-expected="${escapeHtml(char2)}">${escapeHtml(char1)}</span>`;
    } else {
      result += escapeHtml(char1);
    }
  }
  
  return result;
}

function generateHints(details) {
  const differences = analyzeDifferences(details.got, details.expected);
  
  return differences.map(diff => `
    <div class="test-hint">
      <div class="hint-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </div>
      <div class="hint-content">
        <h5>${diff.title}</h5>
        <p>${diff.description}</p>
      </div>
    </div>
  `).join('');
}

function analyzeDifferences(got, expected) {
  const differences = [];
  
  // Check for whitespace issues
  if (got.replace(/\s+/g, '') === expected.replace(/\s+/g, '')) {
    differences.push({
      title: 'Whitespace Mismatch',
      description: 'The output differs only in whitespace characters (spaces, tabs, newlines).'
    });
  }
  
  // Check for case sensitivity
  if (got.toLowerCase() === expected.toLowerCase()) {
    differences.push({
      title: 'Case Sensitivity',
      description: 'The output differs only in letter casing (uppercase/lowercase).'
    });
  }
  
  // Check for trailing/leading characters
  if (got.trim() === expected.trim()) {
    differences.push({
      title: 'Extra Whitespace',
      description: 'There are extra spaces at the beginning or end of the output.'
    });
  }
  
  // Check for line ending differences
  if (got.replace(/\r\n/g, '\n') === expected.replace(/\r\n/g, '\n')) {
    differences.push({
      title: 'Line Ending Mismatch',
      description: 'The output uses different line endings (CRLF vs LF).'
    });
  }
  
  // If no specific differences found, provide general analysis
  if (differences.length === 0) {
    const gotLines = got.split('\n');
    const expectedLines = expected.split('\n');
    
    if (gotLines.length !== expectedLines.length) {
      differences.push({
        title: 'Line Count Mismatch',
        description: `Expected ${expectedLines.length} lines but got ${gotLines.length} lines.`
      });
    }
    
    differences.push({
      title: 'Content Mismatch',
      description: 'The output content doesn\'t match the expected result. Check each character carefully.'
    });
  }
  
  return differences;
}

function downloadTestOutput(content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `test-output-${new Date().toISOString()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Project percentage handling
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

function calculateProjectPercentage(project) {
  if (!project?.results?.skills) return 0;
  
  const skills = project.results.skills;
  let total = 0;
  let passed = 0;

  for (const task in skills) {
    if (skills.hasOwnProperty(task)) {
      total += skills[task].count || 0;
      passed += skills[task].passed || 0;
    }
  }

  return total === 0 ? 0 : Number((passed / total * 100).toFixed(1));
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
  if (isUpdating) return;
  isUpdating = true;

  try {
    document.querySelectorAll('.remove-on-percentage-update').forEach(el => {
      if (el?.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

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
    isUpdating = false;
  }
}

function updateProjectPercentagesWithDelay() {
  if (updateTimeoutId) {
    window.clearTimeout(updateTimeoutId);
  }
  updateTimeoutId = window.setTimeout(updateProjectPercentages, UPDATE_INTERVAL);
}

// Initialize the extension
function init() {
  let currentPath = window.location.href;
  
  // Initialize dark mode
  const isDark = isDarkMode();
  if (isDark) {
    document.body.classList.add('etd-dark-mode');
  }
  
  // Add dark mode toggle
  addDarkModeToggle();
  
  // Watch for system dark mode changes
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addEventListener('change', (e) => {
    if (localStorage.getItem('etd-dark-mode') === null) {
      document.body.classList.toggle('etd-dark-mode', e.matches);
    }
  });

  // Process existing fail details
  document.querySelectorAll('.fail-details').forEach(processFailDetails);

  // Watch for new test failures
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
  const projectObserver = new MutationObserver((mutations) => {
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
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  // Handle URL changes
  window.addEventListener('hashchange', () => {
    if (window.location.href.includes('my.epitech.eu')) {
      projects = {};
      updateProjectPercentagesWithDelay();
    }
  });

  // Initial update
  if (window.location.href.includes('my.epitech.eu')) {
    updateProjectPercentagesWithDelay();
  }
}

// Start initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}