# 🌿 Hadith Garden - Chrome Extension

Transform your new tab into a peaceful Islamic garden experience featuring the complete collection of 1,896 authentic hadith from Riyāḍ al-Ṣāliḥīn (The Gardens of the Righteous).

## ✨ Features

### 📖 Complete Authentic Collection
- **1,896 Hadith** from Imam An-Nawawi's Riyāḍ al-Ṣāliḥīn
- **Sequential Reading** that remembers your exact position
- **Authentic Sources** with direct links to sunnah.com
- **Offline Capability** - works without internet connection

### 🌍 Bilingual Support
- **Arabic Text** with proper RTL support and authentic typography
- **English Translations** for comprehensive understanding
- **Interface Localization** - complete Arabic/English switching
- **Cultural Authenticity** with proper Arabic numbering

### 🔍 Advanced Search
- **Full-Text Search** across all 1,896 hadith
- **Language Filtering** - Arabic only, English only, or both
- **Instant Results** with preview text
- **Keyboard Shortcuts** - `/` or `Ctrl+K` to search

### 🎯 Progress Tracking
- **Daily Reading Goals** (1-20 hadith per day)
- **Reading Streaks** with consecutive day tracking
- **Islamic Achievements** for reaching milestones
- **Progress Visualization** with beautiful cards

### 🎨 Beautiful Design
- **Islamic Garden Theme** with elegant green palette
- **Responsive Layout** works on all screen sizes
- **Dark/Light Themes** with automatic system detection
- **Smooth Animations** that respect accessibility preferences

## 🚀 Installation

### Chrome Web Store
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "Hadith Garden"
3. Click "Add to Chrome"

### Manual Installation
1. Download the latest release
2. Extract the ZIP file
3. Open `chrome://extensions/` in Chrome
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extracted folder

## ⌨️ Keyboard Shortcuts

- `Space` - Next hadith
- `←` - Previous hadith
- `/` or `Ctrl+K` - Open search
- `F` - Toggle favorites
- `Esc` - Close modals

## 🛠️ Development

### Project Structure
```
├── manifest.json           # Extension configuration
├── newtab.html             # Main new tab page
├── newtab.css              # Styling and themes
├── newtab.js               # Core functionality
├── options.html            # Settings page
├── localization.js         # Arabic/English translations
├── gamification.js         # Progress tracking
├── data/
│   └── riyadussalihin.json # Complete hadith collection
└── icons/
    ├── icon-16.svg         # Extension icons
    ├── icon-48.svg
    ├── icon-128.svg
    └── logo.svg
```

### Technologies Used
- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No frameworks for performance
- **CSS Grid/Flexbox** - Modern responsive layouts
- **Chrome Storage API** - Local data persistence
- **System Fonts** - Arabic Typesetting, Times New Roman

### Key Features Implementation
- **Chrome Storage Integration** - All data synced across devices
- **Offline First** - Complete functionality without internet
- **Accessibility** - Keyboard navigation and screen reader support
- **Performance Optimized** - Fast loading and minimal memory usage

## 📊 Data Storage

All user data is stored locally using Chrome's storage API:

- **Reading Position** - Exact hadith continuation point
- **Favorites** - Saved hadith with full text
- **Settings** - Language, theme, display preferences
- **Progress** - Reading streaks, achievements, daily goals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines
- Maintain Islamic values and cultural sensitivity
- Ensure Arabic text displays correctly
- Test thoroughly across different screen sizes
- Follow existing code style and structure

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hadith Source**: Riyāḍ al-Ṣāliḥīn by Imam An-Nawawi
- **Islamic Scholarship** for authentic translations
- **Open Source Community** for tools and libraries used

## 📞 Support

- **Issues**: Report bugs and request features on GitHub
- **Documentation**: Check the installation guide for common solutions
- **Community**: Join discussions about Islamic applications

---

*"The example of a believer who recites the Quran is like that of a citron; its taste is good and its scent is good." - Prophet Muhammad (ﷺ)*

**Transform your browsing into moments of spiritual reflection** 🌿