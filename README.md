# 🌿 Hadith Garden Tab - Chrome Extension

A Chrome Extension (Manifest V3) that transforms your New Tab page into a peaceful Islamic garden experience, featuring the complete collection of 1,896 authentic hadith from Riyāḍ al-Ṣāliḥīn (The Gardens of the Righteous) with full Arabic/English support, advanced search functionality, and comprehensive offline capabilities.

## ✨ Key Features

### 📖 Complete Authentic Collection
- **1,896 Authentic Hadith** from Imam An-Nawawi's renowned Riyāḍ al-Ṣāliḥīn
- **Sequential Reading System** that remembers your exact position across browser sessions
- **Authentic Arabic Book Names** with proper chapter organization
- **Direct Integration** with sunnah.com for extended study

### 🌍 Full Bilingual Support
- **Arabic Text**: Authentic Arabic Typesetting with proper RTL support
- **English Translations**: Complete English text for comprehensive understanding
- **Interface Localization**: Complete Arabic/English interface switching
- **Cultural Authenticity**: Proper Arabic numbering and chapter names

### 🔍 Advanced Search & Navigation
- **Full-Text Search**: Search across all 1,896 hadith in both Arabic and English
- **Smart Filtering**: Search by language (Arabic only, English only, or both)
- **Keyboard Navigation**: Space bar (next), Left arrow (previous), / (search)
- **Instant Results**: Real-time search with preview text

### 🎯 Gamification & Progress Tracking
- **Daily Reading Goals**: Customizable goals (1-20 hadith per day)
- **Reading Streaks**: Track consecutive days of reading
- **Achievement System**: Islamic-themed achievements and celebrations
- **Progress Visualization**: Beautiful progress cards and statistics

### 🎨 Beautiful Islamic Design
- **Garden Theme**: Elegant green palette inspired by Islamic gardens
- **Geometric Patterns**: Authentic Islamic design elements
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Theme Options**: Light, dark, and automatic system-based themes

### ⚡ Smart Features
- **Favorites Management**: Save, organize, export/import favorite hadith
- **Offline Capable**: Complete functionality without internet connection
- **Chrome Storage**: All data synced across your devices
- **Customizable Display**: Font sizes, language preferences, display options

## 🚀 Installation

### From Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store page](https://chrome.google.com/webstore)
2. Click "Add to Chrome"
3. Enjoy your new Islamic garden new tab experience

### Manual Installation (Developer Mode)
1. Download the latest `hadith-garden-tab-chrome-extension.zip`
2. Extract the contents to a folder
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the extracted folder
6. The extension will replace your new tab page immediately

## 🎯 Usage

### Basic Navigation
- **New Tab**: Automatically loads with a hadith from your current reading position
- **Next Hadith**: Click the next button or press Space bar
- **Previous Hadith**: Click the previous button or press Left arrow
- **Search**: Click the search icon or press `/` to open search modal

### Keyboard Shortcuts
- `Space` - Next hadith
- `Left Arrow` - Previous hadith
- `/` or `Ctrl+K` - Open search
- `F` - Toggle favorites
- `S` - Open settings
- `Escape` - Close modals

### Search Functionality
1. Click the search button or press `/`
2. Type your search query in Arabic or English
3. Select language filter (All, Arabic only, English only)
4. Click any result to jump directly to that hadith

### Favorites Management
1. Click the star button to add current hadith to favorites
2. Click the heart button to view all favorites
3. Export favorites as JSON file for backup
4. Import favorites from previously exported file

### Customization
- **Language**: Switch between English and Arabic interface
- **Theme**: Choose light, dark, or automatic
- **Font Size**: Adjust text size for comfortable reading
- **Display Options**: Show/hide Arabic or English text
- **Daily Goals**: Set reading targets (1-20 hadith per day)

## 📊 Progress Tracking

### Daily Goals
- Set customizable daily reading goals
- Track progress with visual indicators
- Celebrate when daily goals are completed

### Reading Streaks
- Monitor consecutive days of reading
- Islamic-themed achievements for milestones
- Motivational progress visualization

### Achievements
- **Blessed Beginning** - First hadith read
- **Week Consistent** - 7-day reading streak
- **Star of the Month** - 30-day reading streak
- **Diligent Knowledge Seeker** - 100+ hadith read

## 🛠️ Technical Features

### Chrome Storage Integration
- **Persistent Data**: All settings, favorites, and progress saved locally
- **Cross-Device Sync**: Data syncs across your Chrome installations
- **Privacy-First**: No data sent to external servers
- **Offline Ready**: Complete functionality without internet

### Performance Optimized
- **Fast Loading**: Optimized for instant new tab loading
- **Local Assets**: All fonts and icons stored locally
- **Minimal Memory**: Efficient resource usage
- **CSP Compliant**: Manifest V3 security standards

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML structure
- **High Contrast**: Support for accessibility preferences
- **Reduced Motion**: Respects user motion preferences

## 🔧 Development

### Project Structure
```
├── manifest.json          # Extension configuration
├── newtab.html            # Main new tab page
├── newtab.css             # Styling and themes
├── newtab.js              # Core functionality
├── options.html           # Settings page
├── options.css            # Settings styling
├── options.js             # Settings functionality
├── localization.js        # Arabic/English translations
├── gamification.js        # Progress tracking system
├── data/
│   └── riyadussalihin.json # Complete hadith collection
├── icons/
│   ├── icon-16.svg        # Extension icon (16px)
│   ├── icon-48.svg        # Extension icon (48px)
│   ├── icon-128.svg       # Extension icon (128px)
│   └── logo.svg           # Main application logo
└── libs/
    └── feather.min.js     # Icon library
```

### Key Technologies
- **Manifest V3**: Latest Chrome extension standard
- **Vanilla JavaScript**: No external frameworks for performance
- **CSS Grid/Flexbox**: Modern responsive layouts
- **Chrome Storage API**: Local data persistence
- **Feather Icons**: Beautiful icon library
- **System Fonts**: Arabic Typesetting, Times New Roman for reliability

### Data Source
- **Authentic Collection**: Hadith data from verified Islamic sources
- **Proper Attribution**: All hadith properly numbered and categorized
- **Quality Assurance**: Verified translations and Arabic text
- **Offline Storage**: Complete collection stored locally

## 📜 License & Attribution

### Hadith Content
- Source: Riyāḍ al-Ṣāliḥīn by Imam An-Nawawi
- Translations: Authentic Islamic sources
- Attribution: Proper Islamic scholarly traditions maintained

### Code License
MIT License - See LICENSE file for details

### Third-Party Assets
- **Feather Icons**: MIT License
- **Google Fonts**: SIL Open Font License
- **Islamic Design Elements**: Original creation inspired by traditional patterns

## 🤝 Contributing

We welcome contributions that align with Islamic values and improve the user experience:

1. **Bug Reports**: Submit detailed issues with steps to reproduce
2. **Feature Requests**: Suggest improvements that enhance Islamic learning
3. **Translations**: Help improve Arabic/English localization
4. **Documentation**: Improve setup and usage instructions

### Development Setup
1. Clone the repository
2. Load extension in Chrome developer mode
3. Make changes and test thoroughly
4. Ensure all Arabic text displays correctly
5. Submit pull request with detailed description

## 🆘 Support

### Common Issues
- **Toolbar Not Visible**: Clear browser cache and reload
- **Arabic Text Issues**: Ensure system has Arabic font support
- **Search Not Working**: Check if extension is properly loaded
- **Progress Not Saving**: Verify Chrome storage permissions

### Contact
- **GitHub Issues**: Report bugs and request features
- **Email Support**: [Your support email]
- **Community**: [Your community forum/Discord]

## 🔄 Version History

### Latest Version Features
- Complete search functionality across all 1,896 hadith
- Enhanced keyboard navigation with progress tracking
- Fixed toolbar visibility issues
- Improved Chrome storage implementation
- Updated Arabic localization and numbering
- Enhanced favorites management system

### Roadmap
- Additional hadith collections
- Advanced search filters
- Community sharing features
- Enhanced accessibility options
- Mobile app companion

---

**Experience the Garden of the Righteous daily. Transform your browsing into moments of spiritual reflection and Islamic learning.**

*"The example of a believer who recites the Quran is like that of a citron; its taste is good and its scent is good." - Prophet Muhammad (ﷺ)*