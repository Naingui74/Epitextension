// UI Components for the extension

export function createDiffViewer(diffLines, options = {}) {
  const container = document.createElement('div');
  container.className = 'etd-container';
  if (localStorage.getItem('etd-dark-mode') === 'true') {
    container.classList.add('etd-dark');
  }

  // Header with enhanced information
  const header = document.createElement('div');
  header.className = 'etd-header';
  
  const titleSection = document.createElement('div');
  titleSection.className = 'etd-title-section';
  
  const title = document.createElement('div');
  title.className = 'etd-title';
  title.textContent = 'Test Analysis';
  
  const subtitle = document.createElement('div');
  subtitle.className = 'etd-subtitle';
  subtitle.textContent = analyzeDiffComplexity(diffLines);
  
  titleSection.append(title, subtitle);
  
  const actions = document.createElement('div');
  actions.className = 'etd-actions';

  // Enhanced view mode toggles with explanations
  const viewModes = document.createElement('div');
  viewModes.className = 'etd-view-modes';
  [
    { name: 'Smart', desc: 'AI-powered analysis' },
    { name: 'Detailed', desc: 'Line by line comparison' },
    { name: 'Compact', desc: 'Show only changes' }
  ].forEach(mode => {
    const button = document.createElement('button');
    button.className = `etd-view-mode ${mode.name === 'Smart' ? 'active' : ''}`;
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

  // Smart analysis panel with enhanced explanations
  const explanation = createExplanationPanel(diffLines);
  
  // Enhanced stats bar with more metrics
  const statsBar = createStatsBar(diffLines);
  
  // Action buttons with tooltips
  const copyBtn = createButton('Copy Expected', () => {
    const text = diffLines
      .filter(line => line.type === 'added')
      .map(line => line.content)
      .join('\n');
    copyToClipboard(text);
  }, 'Copy the correct output to your clipboard');
  
  const downloadBtn = createButton('Download', () => {
    downloadDiff(diffLines);
  }, 'Download the full diff for reference');
  
  const themeBtn = createButton(
    localStorage.getItem('etd-dark-mode') === 'true' ? 'Light Mode' : 'Dark Mode',
    () => toggleDarkMode(container),
    'Switch between light and dark themes'
  );
  
  actions.append(copyBtn, downloadBtn, themeBtn);
  header.append(titleSection, actions);
  
  // Enhanced diff content with smart hints
  const diffContent = document.createElement('div');
  diffContent.className = 'etd-diff';
  
  // Group related changes for better context
  const groupedDiffs = groupRelatedChanges(diffLines);
  
  groupedDiffs.forEach((group, groupIndex) => {
    const groupContainer = document.createElement('div');
    groupContainer.className = 'etd-diff-group';
    
    if (group.length > 1) {
      const groupHeader = document.createElement('div');
      groupHeader.className = 'etd-diff-group-header';
      groupHeader.textContent = `Change Group ${groupIndex + 1}`;
      groupContainer.appendChild(groupHeader);
    }
    
    group.forEach((line, lineIndex) => {
      const lineElement = document.createElement('div');
      lineElement.className = `etd-diff-line ${line.type !== 'normal' ? `etd-diff-${line.type}` : ''}`;
      
      const lineNumber = document.createElement('span');
      lineNumber.className = 'etd-diff-line-number';
      lineNumber.textContent = line.lineNumber;
      
      const content = document.createElement('span');
      content.className = 'etd-diff-content';
      
      // Enhanced content display with character highlighting
      if (line.type !== 'normal') {
        content.innerHTML = highlightDifferences(line.content, line.type, group);
      } else {
        content.textContent = line.content;
      }
      
      // Smart hints with specific suggestions
      if (line.type !== 'normal') {
        const hint = document.createElement('div');
        hint.className = 'etd-diff-hint';
        const hintContent = generateSmartHint(line, group, groupIndex);
        hint.innerHTML = `
          <div class="etd-hint-title">${hintContent.title}</div>
          <div class="etd-hint-desc">${hintContent.description}</div>
          ${hintContent.suggestion ? `<div class="etd-hint-suggestion">${hintContent.suggestion}</div>` : ''}
        `;
        lineElement.appendChild(hint);
      }
      
      lineElement.append(lineNumber, content);
      groupContainer.appendChild(lineElement);
    });
    
    diffContent.appendChild(groupContainer);
  });
  
  // Quick fix suggestions panel
  const quickFixes = createQuickFixPanel(diffLines);
  
  // Learning resources panel
  const resources = createResourcesPanel(diffLines);
  
  container.append(header, viewModes, explanation, statsBar, diffContent, quickFixes, resources);
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
    Smart Analysis
  `;
  
  const content = document.createElement('div');
  content.className = 'etd-explanation-content';
  
  const analysis = analyzeChanges(diffLines);
  content.innerHTML = `
    <div class="etd-explanation-summary">
      ${generateSummary(analysis)}
    </div>
    <div class="etd-explanation-list">
      ${analysis.map(item => `
        <div class="etd-explanation-item ${item.type}">
          <div class="etd-explanation-item-icon">
            ${getExplanationIcon(item.type)}
          </div>
          <div class="etd-explanation-item-content">
            <div class="etd-explanation-item-title">${item.title}</div>
            <div class="etd-explanation-item-desc">${item.description}</div>
            ${item.solution ? `
              <div class="etd-explanation-item-solution">
                <strong>Solution:</strong> ${item.solution}
              </div>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  panel.append(title, content);
  return panel;
}

function createQuickFixPanel(diffLines) {
  const panel = document.createElement('div');
  panel.className = 'etd-quick-fixes';
  
  const title = document.createElement('div');
  title.className = 'etd-quick-fixes-title';
  title.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
    Quick Fixes
  `;
  
  const fixes = generateQuickFixes(diffLines);
  const content = document.createElement('div');
  content.className = 'etd-quick-fixes-content';
  content.innerHTML = `
    <div class="etd-quick-fixes-list">
      ${fixes.map(fix => `
        <div class="etd-quick-fix">
          <div class="etd-quick-fix-header">
            <span class="etd-quick-fix-title">${fix.title}</span>
            <button class="etd-quick-fix-apply" onclick="applyQuickFix('${fix.id}')">
              Apply Fix
            </button>
          </div>
          <div class="etd-quick-fix-preview">
            <div class="etd-quick-fix-before">
              <span>Before:</span>
              <code>${fix.before}</code>
            </div>
            <div class="etd-quick-fix-after">
              <span>After:</span>
              <code>${fix.after}</code>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  panel.append(title, content);
  return panel;
}

function createResourcesPanel(diffLines) {
  const panel = document.createElement('div');
  panel.className = 'etd-resources';
  
  const title = document.createElement('div');
  title.className = 'etd-resources-title';
  title.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
    Learning Resources
  `;
  
  const resources = generateResources(diffLines);
  const content = document.createElement('div');
  content.className = 'etd-resources-content';
  content.innerHTML = `
    <div class="etd-resources-list">
      ${resources.map(resource => `
        <a href="${resource.url}" target="_blank" class="etd-resource">
          <div class="etd-resource-icon">
            ${getResourceIcon(resource.type)}
          </div>
          <div class="etd-resource-content">
            <div class="etd-resource-title">${resource.title}</div>
            <div class="etd-resource-desc">${resource.description}</div>
          </div>
        </a>
      `).join('')}
    </div>
  `;
  
  panel.append(title, content);
  return panel;
}

// Helper functions for enhanced analysis
function groupRelatedChanges(diffLines) {
  const groups = [];
  let currentGroup = [];
  
  diffLines.forEach((line, index) => {
    if (line.type === 'normal' && currentGroup.length > 0) {
      if (currentGroup.length > 0) groups.push(currentGroup);
      currentGroup = [];
    } else if (line.type !== 'normal') {
      currentGroup.push(line);
    }
  });
  
  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups;
}

function generateSmartHint(line, group, groupIndex) {
  const hints = {
    whitespace: {
      title: 'Whitespace Issue',
      description: 'There are extra or missing spaces in your output',
      suggestion: 'Check for trailing spaces or tabs'
    },
    case: {
      title: 'Case Sensitivity',
      description: 'The letter case doesn\'t match the expected output',
      suggestion: 'Make sure to match uppercase/lowercase exactly'
    },
    newline: {
      title: 'Line Ending',
      description: 'There might be an issue with line endings',
      suggestion: 'Check for extra or missing newlines'
    },
    character: {
      title: 'Character Mismatch',
      description: 'Some characters don\'t match the expected output',
      suggestion: 'Look for typos or incorrect punctuation'
    }
  };
  
  const type = analyzeLineType(line, group);
  return hints[type] || {
    title: 'Output Mismatch',
    description: 'Your output doesn\'t match the expected result',
    suggestion: 'Compare your output carefully with the expected result'
  };
}

function analyzeLineType(line, group) {
  if (line.content.trim() === group[0].content.trim()) return 'whitespace';
  if (line.content.toLowerCase() === group[0].content.toLowerCase()) return 'case';
  if (line.content.replace(/\s+/g, '') === group[0].content.replace(/\s+/g, '')) return 'newline';
  return 'character';
}

function highlightDifferences(content, type, group) {
  if (type === 'normal') return content;
  
  const otherLine = group.find(l => l.type !== type)?.content || '';
  let highlighted = '';
  let i = 0;
  
  while (i < content.length || i < otherLine.length) {
    if (content[i] !== otherLine[i]) {
      highlighted += `<span class="etd-diff-char">${content[i] || ''}</span>`;
    } else {
      highlighted += content[i] || '';
    }
    i++;
  }
  
  return highlighted;
}

function generateQuickFixes(diffLines) {
  const fixes = [];
  const patterns = analyzePatterns(diffLines);
  
  patterns.forEach((pattern, index) => {
    fixes.push({
      id: `fix-${index}`,
      title: pattern.description,
      before: pattern.example.before,
      after: pattern.example.after
    });
  });
  
  return fixes;
}

function analyzePatterns(diffLines) {
  const patterns = [];
  let currentPattern = null;
  
  diffLines.forEach(line => {
    if (line.type !== 'normal') {
      const pattern = detectPattern(line.content);
      if (pattern) patterns.push(pattern);
    }
  });
  
  return patterns;
}

function detectPattern(content) {
  // Add pattern detection logic here
  const patterns = [
    {
      test: (str) => /\s+$/.test(str),
      description: 'Remove trailing whitespace',
      example: {
        before: 'Hello World  ',
        after: 'Hello World'
      }
    },
    {
      test: (str) => /^\s+/.test(str),
      description: 'Remove leading whitespace',
      example: {
        before: '  Hello World',
        after: 'Hello World'
      }
    },
    // Add more patterns as needed
  ];
  
  return patterns.find(p => p.test(content));
}

function generateResources(diffLines) {
  // Add resource generation logic here
  return [
    {
      type: 'documentation',
      title: 'Understanding Test Output',
      description: 'Learn how to interpret and fix test failures',
      url: 'https://docs.epitech.eu/tests'
    },
    {
      type: 'guide',
      title: 'Common Test Issues',
      description: 'Solutions for frequently encountered problems',
      url: 'https://docs.epitech.eu/guides/testing'
    },
    // Add more resources as needed
  ];
}

function getResourceIcon(type) {
  const icons = {
    documentation: `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    `,
    guide: `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    `
  };
  return icons[type] || icons.documentation;
}

function getExplanationIcon(type) {
  const icons = {
    removed: `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    `,
    added: `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    `
  };
  return icons[type] || icons.removed;
}

function generateSummary(analysis) {
  const issues = analysis.length;
  const critical = analysis.filter(a => a.type === 'removed').length;
  
  return `
    <div class="etd-summary">
      <div class="etd-summary-stat">
        <span class="etd-summary-number">${issues}</span>
        <span class="etd-summary-label">Issues Found</span>
      </div>
      <div class="etd-summary-stat">
        <span class="etd-summary-number">${critical}</span>
        <span class="etd-summary-label">Critical Issues</span>
      </div>
    </div>
  `;
}