// Utility functions for the extension

export function computeDiff(got, expected) {
  const gotLines = got.split('\n');
  const expectedLines = expected.split('\n');
  const diffLines = [];
  const maxLength = Math.max(gotLines.length, expectedLines.length);

  for (let i = 0; i < maxLength; i++) {
    const gotLine = gotLines[i];
    const expectedLine = expectedLines[i];

    if (gotLine === expectedLine) {
      diffLines.push({ type: 'normal', content: gotLine, lineNumber: i + 1 });
    } else if (gotLine === undefined) {
      diffLines.push({ type: 'added', content: expectedLine, lineNumber: i + 1 });
    } else if (expectedLine === undefined) {
      diffLines.push({ type: 'removed', content: gotLine, lineNumber: i + 1 });
    } else {
      diffLines.push({ type: 'removed', content: gotLine, lineNumber: i + 1 });
      diffLines.push({ type: 'added', content: expectedLine, lineNumber: i + 1 });
    }
  }

  return diffLines;
}

export function saveToHistory(diffData) {
  chrome.storage.local.get(['diffHistory'], (result) => {
    const history = result.diffHistory || [];
    history.unshift({
      timestamp: Date.now(),
      diff: diffData,
    });
    
    // Keep only last 5 entries
    while (history.length > 5) {
      history.pop();
    }
    
    chrome.storage.local.set({ diffHistory: history });
  });
}

export function downloadDiff(diffData, format = 'txt') {
  const content = format === 'json' 
    ? JSON.stringify(diffData, null, 2)
    : diffData.map(line => `${line.type === 'normal' ? ' ' : line.type === 'added' ? '+' : '-'} ${line.content}`).join('\n');
    
  const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `diff-${new Date().toISOString()}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'etd-notification';
    notification.textContent = 'Copied to clipboard!';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  });
}

export function isDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function toggleDarkMode(container) {
  container.classList.toggle('etd-dark');
  const isDark = container.classList.contains('etd-dark');
  localStorage.setItem('etd-dark-mode', isDark);
}