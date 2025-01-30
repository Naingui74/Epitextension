# Epitech Enhanced Extension

![Extension Logo](icon128.png)

A powerful browser extension designed to enhance the Epitech learning experience by providing advanced test visualization and project tracking features.

## 🎯 Features

### 1. Advanced Test Diff Viewer
- **Interactive Diff Display**: Click on any failed test to see a beautiful, side-by-side comparison
- **Syntax Highlighting**: Clear visual distinction between added, removed, and unchanged lines
- **Line Numbers**: Easy reference with line numbers for each diff
- **Copy to Clipboard**: One-click copying of the entire diff
- **Dark/Light Mode**: Toggle between themes for comfortable viewing in any environment

### 2. Project Progress Tracker
- **Real-time Progress Bars**: Visual representation of project completion rates
- **Color-coded Status**: 
  - 🟢 Green (≥75%): Excellent progress
  - 🟠 Orange (25-74%): In progress
  - 🔴 Red (<25%): Needs attention
- **Automatic Updates**: Progress bars update automatically as you navigate

## 🚀 Installation

### Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "Epitech Enhanced Extension"
3. Click "Add to Chrome"

### Manual Installation
1. Download this repository as a ZIP file
2. Unzip the file to a location on your computer
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked"
6. Select the unzipped extension folder

## 💡 How to Use

### Viewing Test Diffs
1. Navigate to any project test page on my.epitech.eu
2. When a test fails, click on the test details
3. The diff viewer will appear, showing the differences between expected and actual outputs
4. Use the copy button to share the diff or the theme toggle for better visibility

### Tracking Project Progress
1. Go to your projects dashboard on my.epitech.eu
2. Progress bars will automatically appear below each project card
3. The percentage shows your current success rate for the project
4. Colors indicate your progress status at a glance

## 🛠 Technical Details

### Permissions Used
- `tabs`: Required for accessing test results and project information
- `storage`: Used for saving theme preferences
- Host permissions for:
  - `my.epitech.eu`: Main Epitech platform
  - `api.epitest.eu`: Project data API

### Privacy
- No data is collected or shared
- All processing happens locally in your browser
- No external services are used except Epitech's own APIs

## 🤝 Contributing

This extension is open to contributions! If you have ideas for improvements or bug fixes:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🙏 Credits

Created by Aaron Groux (aaron.groux@epitech.eu)
Discord: smokoxren

This extension is inspired by and builds upon the work of previous Epitech extensions, aiming to provide a modern, enhanced experience for students.

### Inspiration
- Original Epitech Test Display extension
- Various community tools and scripts

## 📝 License

MIT License - Feel free to use, modify, and distribute this extension while maintaining attribution.

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/yourusername/epitech-enhanced-extension/issues) with:

1. Description of the problem
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots if applicable

You can also reach out directly on Discord: smokoxren

## 🔄 Version History

### v2.1.0 (Current)
- Added animated progress bars
- Improved dark mode support
- Enhanced diff viewer UI
- Fixed various bugs

### v2.0.0
- Complete UI redesign
- Added project progress tracking
- Improved test diff visualization

### v1.0.0
- Initial release
- Basic test diff viewing functionality

## 🔮 Planned Features

- [ ] Test coverage visualization
- [ ] Project statistics dashboard
- [ ] Custom themes support
- [ ] Keyboard shortcuts
- [ ] Export/import settings

## ⚠️ Disclaimer

This is an unofficial extension created by a student for students. It is not officially affiliated with or endorsed by Epitech.