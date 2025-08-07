# Hadith Garden Tab - Chrome Extension
## حديقة الأحاديث

A Chrome Extension (Manifest V3) that transforms your new tab page into a beautiful, interactive hadith reader featuring sequential content from Riyāḍ al-Ṣāliḥīn.

## Features

### 📖 Hadith Reading Experience
- **Sequential Display**: Proper sequential reading through Riyāḍ al-Ṣāliḥīn (no random selection)
- **Bilingual Support**: Full Arabic (RTL) and English interface localization
- **Beautiful Typography**: Amiri font for Arabic, Inter for English
- **Offline Functionality**: 20 pre-loaded hadith with local storage

### 🎮 Gamification System
- **Reading Streaks**: Track consecutive days of hadith reading (أيام القراءة المتواصلة)
- **Customizable Daily Goals**: Set your target (1-20 hadith per day)
- **Achievement System**: Unlock encouraging milestones:
  - 📖 **بداية مباركة** (Blessed Beginning) - First hadith read
  - 📗 **مواظب الأسبوع** (Week Consistent) - 7-day streak
  - 📘 **نجم الشهر** (Star of the Month) - 30-day streak  
  - 📚 **طالب علم مجتهد** (Diligent Knowledge Seeker) - 100 total hadith
- **Progress Tracking**: Visual daily progress bars and statistics

### 🌿 Islamic Garden Theme
- **Elegant Design**: Green gradient themes with Islamic aesthetics
- **Open Book Logo**: Professional SVG logo representing knowledge
- **Smooth Animations**: Respectful of reduced-motion preferences
- **Responsive Layout**: Works perfectly on all screen sizes

### ⚙️ Customization Options
- **Language Toggle**: Switch between English and Arabic (العربية) interfaces
- **Theme Selection**: Light, dark, and auto modes
- **Font Size Control**: Adjust text size for comfortable reading
- **Favorites System**: Save, export, and import your favorite hadith

## Installation

### Method 1: Load Unpacked Extension (Recommended)

1. **Download this project** as a ZIP file from your preferred source
2. **Extract the ZIP** to a folder on your computer
3. **Open Chrome** and navigate to `chrome://extensions/`
4. **Enable "Developer mode"** by clicking the toggle in the top-right corner
5. **Click "Load unpacked"** and select the extracted folder
6. **Open a new tab** to see Hadeeth Garden Tab in action!

### Method 2: Manual Setup

1. **Clone or download** this repository
2. **Follow steps 3-6** from Method 1 above

## File Structure

```
hadeeth-garden-tab/
├── manifest.json              # Extension manifest (Manifest V3)
├── newtab.html                # New tab page layout
├── newtab.css                 # Styling for new tab page
├── newtab.js                  # Main functionality script
├── options.html               # Settings page layout
├── options.css                # Styling for settings page
├── options.js                 # Settings page functionality
├── data/
│   └── riyadussalihin.json    # Hadith collection (20 sample hadiths)
├── icons/
│   ├── icon-16.svg           # Extension icon (16x16)
│   ├── icon-48.svg           # Extension icon (48x48)
│   └── icon-128.svg          # Extension icon (128x128)
└── README.md                 # This file
```

## Keyboard Shortcuts

- **Spacebar** or **Right Arrow**: Next hadith
- **F**: Toggle favorite
- **S**: Open settings

## Data Storage

The extension stores data locally in Chrome's storage:
- **Reading Progress**: Current hadith index
- **Settings**: Theme, language preferences, font size
- **Favorites**: List of favorited hadith IDs

## Adding More Hadiths

To add more hadiths to the `data/riyadussalihin.json` file:

1. Open the JSON file in a text editor
2. Follow the existing format:
   ```json
   {
     "id": 21,
     "book": 2,
     "number": 21,
     "arabic": "Arabic text here...",
     "english": "English translation here...",
     "url": "https://sunnah.com/riyadussalihin:21"
   }
   ```
3. Ensure proper JSON formatting with commas between entries
4. Reload the extension to see new hadiths

## Privacy & Performance

- ✅ **No Analytics**: Extension doesn't track or collect user data
- ✅ **No Remote Calls**: All hadith data is stored locally
- ✅ **Fast Loading**: Optimized for quick new tab opening
- ✅ **Offline Ready**: Works without internet connection

## Browser Compatibility

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Brave Browser
- Other Chromium-based browsers

## Technical Details

### Architecture
- **Pure JavaScript**: No external frameworks
- **Manifest V3**: Latest Chrome extension standard
- **Local Storage**: Chrome Storage API + localStorage fallback
- **Progressive Enhancement**: Graceful degradation for older browsers

### Accessibility
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Reduced motion support
- High contrast mode compatibility

### Performance Optimizations
- SVG icons for crisp display at all sizes
- CSS Grid and Flexbox for efficient layouts
- Preloaded Google Fonts with fallbacks
- Minimal JavaScript footprint

## Development

To modify or develop this extension:

1. **Load the extension** using the installation steps above
2. **Make changes** to any files
3. **Reload the extension** in `chrome://extensions/`
4. **Test changes** by opening a new tab

### Development Server
For testing outside of Chrome:
```bash
python3 -m http.server 5000
# Visit http://localhost:5000/newtab.html
```

## Attribution

Hadith content sourced from [sunnah.com](https://sunnah.com/riyadussalihin) – used for personal educational purposes under fair use.

## Version History

### v1.0.0
- Sequential hadith reading from Riyāḍ al-Ṣāliḥīn
- Islamic garden theme with responsive design
- Arabic (RTL) and English (LTR) text display
- Comprehensive settings and customization
- Favorites management with export/import
- Local data storage for offline use

## Support

This is an educational project. For issues or suggestions, please check the code and modify as needed for your personal use.

