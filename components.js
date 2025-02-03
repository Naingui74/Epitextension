// UI Components for the extension

export function createDiffViewer(diffLines, options = {}) {
  const container = document.createElement('div');
  container.className = 'etd-container';
  if (localStorage.getItem('etd-dark-mode') === 'true') {
    container.classList.add('etd-dark');
  }

  // Header
  const header = document.createElement('div');
  header.className = 'etd-header';
  
  const title = document.createElement('div');
  title.className = 'etd-title';
  title.textContent = 'Test Diff Viewer';
  
  const actions = document.createElement('div');
  actions.className = 'etd-actions';
  
  // View mode toggles
  const viewModes = document.createElement('div');
  viewModes.className = 'etd-view-modes';
  ['Compact', 'Detailed'].forEach(mode => {
    const button = document.createElement('button');
    button.className = `etd-view-mode ${mode === 'Compact' ? 'active' : ''}`;
    button.textContent = mode;
    button.onclick = () => {
      viewModes.querySelectorAll('.etd-view-mode').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      container.setAttribute('data-view-mode', mode.toLowerCase());
    };
    viewModes.appendChild(button);
  });
  
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
  header.append(title, actions);
  
  // Diff content
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
  
  container.append(header, viewModes, diffContent);
  return container;
}

function createButton(text, onClick) {
  const button = document.createElement('button');
  button.className = 'etd-button etd-button-secondary';
  button.textContent = text;
  button.onclick = onClick;
  return button;
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