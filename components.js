// UI Components for the extension

export function createDiffViewer(diffLines) {
  const container = document.createElement('div');
  container.className = 'etd-container';
  if (localStorage.getItem('etd-dark-mode') === 'true') {
    container.classList.add('etd-dark');
  }

  // Header
  const header = document.createElement('div');
  header.className = 'etd-header';
  
  const titleSection = document.createElement('div');
  titleSection.className = 'etd-title-section';
  
  const title = document.createElement('div');
  title.className = 'etd-title';
  title.textContent = 'Test Diff Viewer';
  
  const subtitle = document.createElement('div');
  subtitle.className = 'etd-subtitle';
  subtitle.textContent = analyzeDiffComplexity(diffLines);
  
  titleSection.append(title, subtitle);
  
  const actions = document.createElement('div');
  actions.className = 'etd-actions';
  
  // View mode toggles with explanations
  const viewModes = document.createElement('div');
  viewModes.className = 'etd-view-modes';
  [
    { name: 'Compact', desc: 'Show only changes' },
    { name: 'Detailed', desc: 'Show all context' }
  ].forEach(mode => {
    const button = document.createElement('button');
    button.className = `etd-view-mode ${mode.name === 'Compact' ? 'active' : ''}`;
    button.innerHTML = `
      <span>${mode.name}</span>
      <span class="etd-view-mode-desc">${mode.desc}</span>
    `;
    button.onclick = () => {
      viewModes.querySelectorAll('.etd-view-mode').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      container.setAttribute('data-view-mode', mode.name.toLowerCase());
      updateDiffView(diffContent, mode.name.toLowerCase());
    };
    viewModes.appendChild(button);
  });

  // Smart analysis panel
  const explanation = createExplanationPanel(diffLines);
  
  // Stats bar
  const statsBar = createStatsBar(diffLines);
  
  // Action buttons
  const copyBtn = createButton('Copy', () => {
    const text = diffLines.map(line => 
      `${line.type === 'normal' ? ' ' : line.type === 'added' ? '+' : '-'} ${line.content}`
    ).join('\n');
    copyToClipboard(text);
  });
  
  const downloadBtn = createButton('Download', () => {
    downloadDiff(diffLines);
  });
  
  const themeBtn = createButton(
    localStorage.getItem('etd-dark-mode') === 'true' ? 'Light Mode' : 'Dark Mode',
    () => toggleDarkMode(container)
  );
  
  actions.append(copyBtn, downloadBtn, themeBtn);
  header.append(titleSection, actions);
  
  // Diff content with enhanced hints
  const diffContent = document.createElement('div');
  diffContent.className = 'etd-diff';
  
  diffLines.forEach((line, index) => {
    const lineElement = document.createElement('div');
    lineElement.className = `etd-diff-line ${line.type !== 'normal' ? `etd-diff-${line.type}` : ''}`;
    
    const lineNumber = document.createElement('span');
    lineNumber.className = 'etd-diff-line-number';
    lineNumber.textContent = line.lineNumber;
    
    const content = document.createElement('span');
    content.className = 'etd-diff-content';
    content.textContent = line.content;
    
    // Add intelligent hints
    if (line.type !== 'normal') {
      const hint = document.createElement('div');
      hint.className = 'etd-diff-hint';
      hint.textContent = generateHint(line, diffLines, index);
      lineElement.appendChild(hint);
    }
    
    lineElement.append(lineNumber, content);
    diffContent.appendChild(lineElement);
  });
  
  // Quick actions panel
  const quickActions = createQuickActions(diffLines);
  
  container.append(header, viewModes, explanation, statsBar, diffContent, quickActions);
  return container;
}

function createExplanationPanel(diffLines) {
  const panel = document.createElement('div');
  panel.className = 'etd-explanation';
  
  const title = document.createElement('div');
  title.className = 'etd-explanation-title';
  title.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    What's Wrong?
  `;
  
  const content = document.createElement('div');
  content.className = 'etd-explanation-content';
  
  const analysis = analyzeChanges(diffLines);
  content.innerHTML = `
    <div class="etd-explanation-list">
      ${analysis.map(item => `
        <div class="etd-explanation-item ${item.type}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${item.type === 'removed' ? `
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            ` : `
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="16 12 12 8 8 12"></polyline>
              <line x1="12" y1="16" x2="12" y2="8"></line>
            `}
          </svg>
          <div class="etd-explanation-item-content">
            <div class="etd-explanation-item-title">${item.title}</div>
            <div class="etd-explanation-item-desc">${item.description}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  panel.append(title, content);
  return panel;
}

function createStatsBar(diffLines) {
  const stats = diffLines.reduce((acc, line) => {
    acc[line.type]++;
    return acc;
  }, { normal: 0, added: 0, removed: 0 });
  
  const bar = document.createElement('div');
  bar.className = 'etd-stats-bar';
  
  const items = [
    { label: 'Unchanged', count: stats.normal, type: 'normal' },
    { label: 'Added', count: stats.added, type: 'added' },
    { label: 'Removed', count: stats.removed, type: 'removed' }
  ];
  
  items.forEach(item => {
    const stat = document.createElement('div');
    stat.className = `etd-stat etd-stat-${item.type}`;
    stat.innerHTML = `
      <span class="etd-stat-label">${item.label}</span>
      <span class="etd-stat-count">${item.count}</span>
    `;
    bar.appendChild(stat);
  });
  
  return bar;
}

function createQuickActions(diffLines) {
  const panel = document.createElement('div');
  panel.className = 'etd-quick-actions';
  
  const actions = [
    {
      label: 'Copy Expected',
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
      onClick: () => copyExpectedOutput(diffLines)
    },
    {
      label: 'Show Differences',
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 16h-8"></path><path d="M16 12h-8"></path><path d="M16 8h-8"></path></svg>',
      onClick: () => highlightKeyDifferences(diffLines)
    }
  ];
  
  actions.forEach(action => {
    const button = document.createElement('button');
    button.className = 'etd-quick-action';
    button.innerHTML = `${action.icon}<span>${action.label}</span>`;
    button.onclick = action.onClick;
    panel.appendChild(button);
  });
  
  return panel;
}

function analyzeDiffComplexity(diffLines) {
  const changes = diffLines.filter(line => line.type !== 'normal').length;
  if (changes === 0) return 'No differences found';
  if (changes <= 2) return 'Minor differences detected';
  if (changes <= 5) return 'Several differences found';
  return 'Multiple differences detected';
}

function analyzeChanges(diffLines) {
  const analysis = [];
  let currentContext = [];
  
  diffLines.forEach((line, index) => {
    if (line.type !== 'normal') {
      currentContext.push({ line, index });
    } else if (currentContext.length > 0) {
      analysis.push(...generateAnalysis(currentContext, diffLines));
      currentContext = [];
    }
  });
  
  if (currentContext.length > 0) {
    analysis.push(...generateAnalysis(currentContext, diffLines));
  }
  
  return analysis;
}

function generateAnalysis(context) {
  const analysis = [];
  
  // Group related changes
  const changes = context.reduce((acc, { line, index }) => {
    if (line.type === 'removed') {
      acc.removed.push({ line, index });
    } else {
      acc.added.push({ line, index });
    }
    return acc;
  }, { removed: [], added: [] });
  
  // Analyze whitespace differences
  if (hasOnlyWhitespaceDifferences(changes)) {
    analysis.push({
      type: 'removed',
      title: 'Whitespace Issue',
      description: 'There are differences in spacing or indentation. Check for extra spaces, tabs, or line breaks.'
    });
  }
  
  // Analyze case differences
  if (hasCaseDifferences(changes)) {
    analysis.push({
      type: 'removed',
      title: 'Case Sensitivity',
      description: 'The text differs only in letter case. Make sure to match the exact capitalization.'
    });
  }
  
  // Analyze missing/extra content
  if (changes.removed.length > 0 && changes.added.length === 0) {
    analysis.push({
      type: 'removed',
      title: 'Extra Content',
      description: 'Your output contains additional content that should be removed.'
    });
  } else if (changes.removed.length === 0 && changes.added.length > 0) {
    analysis.push({
      type: 'added',
      title: 'Missing Content',
      description: 'Your output is missing some required content.'
    });
  }
  
  // Analyze character differences
  const charDiffs = findCharacterDifferences(changes);
  if (charDiffs) {
    analysis.push({
      type: 'removed',
      title: 'Character Mismatch',
      description: charDiffs
    });
  }
  
  return analysis;
}

function generateHint(line, allLines, index) {
  if (line.type === 'removed') {
    // Find the closest added line
    const nextAdd = allLines.slice(index).find(l => l.type === 'added');
    if (nextAdd) {
      const diff = findStringDifference(line.content, nextAdd.content);
      return diff;
    }
    return 'This line should be removed';
  } else if (line.type === 'added') {
    // Find the closest removed line
    const prevRemove = allLines.slice(0, index).reverse().find(l => l.type === 'removed');
    if (prevRemove) {
      const diff = findStringDifference(prevRemove.content, line.content);
      return `Expected: ${diff}`;
    }
    return 'This line needs to be added';
  }
  return '';
}

function findStringDifference(str1, str2) {
  if (!str1 || !str2) return 'Complete text mismatch';
  
  let i = 0;
  while (i < str1.length && i < str2.length && str1[i] === str2[i]) i++;
  
  if (i === str1.length && i === str2.length) return 'Texts are identical';
  
  const context = 10;
  const before = str2.slice(Math.max(0, i - context), i);
  const diff = str2[i] || '';
  const after = str2.slice(i + 1, i + context);
  
  return `...${before}[${diff}]${after}...`;
}

function hasOnlyWhitespaceDifferences(changes) {
  return changes.removed.every(({ line }) => 
    changes.added.some(({ line: addedLine }) => 
      line.content.trim() === addedLine.content.trim()
    )
  );
}

function hasCaseDifferences(changes) {
  return changes.removed.every(({ line }) => 
    changes.added.some(({ line: addedLine }) => 
      line.content.toLowerCase() === addedLine.content.toLowerCase()
    )
  );
}

function findCharacterDifferences(changes) {
  if (changes.removed.length !== changes.added.length) return null;
  
  const diffs = changes.removed.map(({ line }, i) => {
    const addedLine = changes.added[i].line;
    const chars1 = [...line.content];
    const chars2 = [...addedLine.content];
    
    const diffIndex = chars1.findIndex((char, j) => char !== chars2[j]);
    if (diffIndex === -1) return null;
    
    const char1 = chars1[diffIndex];
    const char2 = chars2[diffIndex];
    
    return `Expected '${char2}' but found '${char1}' at position ${diffIndex + 1}`;
  }).filter(Boolean);
  
  return diffs.length > 0 ? diffs.join('. ') : null;
}

function copyExpectedOutput(diffLines) {
  const expected = diffLines
    .filter(line => line.type === 'added')
    .map(line => line.content)
    .join('\n');
  
  navigator.clipboard.writeText(expected).then(() => {
    showNotification('Expected output copied to clipboard!', 'success');
  });
}

function highlightKeyDifferences(diffLines) {
  const changes = analyzeChanges(diffLines);
  const container = document.createElement('div');
  container.className = 'etd-differences-modal';
  
  container.innerHTML = `
    <div class="etd-differences-content">
      <h3>Key Differences</h3>
      <ul>
        ${changes.map(change => `
          <li class="etd-difference-item ${change.type}">
            <strong>${change.title}:</strong>
            <p>${change.description}</p>
          </li>
        `).join('')}
      </ul>
      <button class="etd-button">Close</button>
    </div>
  `;
  
  container.querySelector('button').onclick = () => container.remove();
  document.body.appendChild(container);
}

function createButton(text, onClick) {
  const button = document.createElement('button');
  button.className = 'etd-button etd-button-secondary';
  button.textContent = text;
  button.onclick = onClick;
  return button;
}

function updateDiffView(diffContent, mode) {
  const lines = diffContent.querySelectorAll('.etd-diff-line');
  lines.forEach(line => {
    if (mode === 'compact' && line.classList.contains('etd-diff-normal')) {
      line.style.display = 'none';
    } else {
      line.style.display = 'flex';
    }
  });
}

export function createHistoryPanel(history, onSelect) {
  const panel = document.createElement('div');
  panel.className = 'etd-history';
  
  const title = document.createElement('div');
  title.className = 'etd-history-title';
  title.textContent = 'Recent Tests';
  
  const list = document.createElement('div');
  list.className = 'etd-history-list';
  
  history.forEach(item => {
    const historyItem = document.createElement('div');
    historyItem.className = 'etd-history-item';
    
    const date = new Date(item.timestamp);
    historyItem.textContent = date.toLocaleString();
    historyItem.onclick = () => onSelect(item);
    
    list.appendChild(historyItem);
  });
  
  panel.append(title, list);
  return panel;
}