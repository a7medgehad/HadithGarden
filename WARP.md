# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Quick Start

HadithGarden is a Chrome extension built with vanilla JavaScript and Manifest V3. No build tools or package managers are required.

### Development Setup
```bash
# 1. Clone and navigate to project
cd /path/to/HadithGarden

# 2. Load extension in Chrome
# Open Chrome -> Settings -> Extensions -> Enable "Developer mode"
# Click "Load unpacked" -> Select this project folder

# 3. For development testing with a local server
npx serve .
# Then visit http://localhost:3000/newtab.html

# 4. Reload extension after code changes
# Go to chrome://extensions/ and click the reload button for HadithGarden
```

## Essential Commands

### Extension Development
```bash
# Load extension in Chrome (manual process)
# 1. Open chrome://extensions/
# 2. Enable "Developer mode" (top-right toggle)
# 3. Click "Load unpacked" and select project root directory

# Load extension in Edge (manual process)
# 1. Open edge://extensions/
# 2. Enable "Developer mode" (left sidebar)
# 3. Click "Load unpacked" and select project root directory

# Reload extension after changes
# Click reload button in chrome://extensions/ or edge://extensions/
# Or press Ctrl+R on extension

# Package for Chrome Web Store
./build-chrome.sh

# Package for Microsoft Edge Add-ons Store
./build-edge.sh

# Manual packaging (alternative)
zip -r hadith-garden-chrome-v1.0.2.zip . -x "*.git*" "*.DS_Store" "WARP.md" "browser-compat.js" "build-*.sh"
zip -r hadith-garden-edge-v1.0.2.zip . -x "*.git*" "*.DS_Store" "WARP.md" "build-*.sh"
```

### Development Testing
```bash
# Start local development server for testing outside Chrome
npx serve .

# Test individual components
# Open http://localhost:3000/newtab.html (main page)
# Open http://localhost:3000/options.html (settings page)
```

### Code Quality (Optional)
```bash
# Add ESLint for code quality (not currently configured)
npm init -y
npm install --save-dev eslint
npx eslint --init

# Format code with Prettier
npx prettier --write "*.js" "*.html" "*.css"
```

## Repository Layout

```
HadithGarden/
├── manifest.json              # Extension configuration (Manifest V3)
├── newtab.html               # Main new tab replacement page
├── newtab.css                # Styling with theme support
├── newtab.js                 # Core application logic (HadeethGardenTab class)
├── options.html              # Settings/preferences page
├── options.css               # Settings page styling
├── options.js                # Settings logic (HadeethGardenOptions class)
├── background.js             # Service worker for notifications/alarms
├── gamification.js           # Progress tracking (HadeethGamification class)
├── localization.js           # Bilingual support (HadeethLocalization class)
├── data/
│   └── riyadussalihin.json   # Complete hadith collection (1,896 entries)
├── icons/
│   ├── icon-16.png           # Extension icons (generated from logo.svg)
│   ├── icon-48.png
│   ├── icon-128.png
│   └── logo.svg              # Source logo file
├── libs/
│   └── feather.min.js        # Icon library
├── README.md                 # Project documentation
├── CHANGELOG.md              # Version history
├── PRIVACY_POLICY.md         # Privacy policy
└── LICENSE                   # MIT license
```

## Architecture Overview

### Manifest V3 Structure
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Service       │    │   New Tab       │    │   Options       │
│   Worker        │    │   Override      │    │   Page          │
│                 │    │                 │    │                 │
│ background.js   │    │   newtab.html   │    │  options.html   │
│ - Notifications │◄──►│   newtab.js     │◄──►│  options.js     │
│ - Alarms        │    │   - Main UI     │    │  - Settings     │
│ - Storage sync  │    │   - Hadith      │    │  - Progress     │
└─────────────────┘    │   - Progress    │    │  - Favorites    │
                       └─────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────────────────────────┐
                    │          Core Modules               │
                    │                                     │
                    │  gamification.js    localization.js │
                    │  - Reading stats    - Arabic/English│
                    │  - Achievements     - RTL support   │
                    │  - Daily goals      - Number format │
                    └─────────────────────────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Chrome Storage │
                       │                 │
                       │ - settings      │
                       │ - favorites     │
                       │ - userStats     │
                       │ - currentIndex  │
                       └─────────────────┘
```

### Data Flow
1. **Initialization**: Load settings → Load hadith data → Apply theme → Render UI
2. **User Interaction**: Keyboard shortcuts → Update state → Save to storage → Re-render
3. **Navigation**: Next/previous hadith → Update progress → Record stats → Update gamification
4. **Background**: Service worker schedules daily notifications → User clicks → Opens new tab

## Development Patterns & Concepts

### Core Classes
- **`HadeethGardenTab`**: Main application controller in `newtab.js`
  - Manages hadith display, navigation, themes, keyboard shortcuts
  - Handles storage synchronization and offline fallbacks
  
- **`HadeethGardenOptions`**: Settings management in `options.js`
  - Controls display preferences, language, gamification settings
  - Handles import/export of favorites
  
- **`HadeethGamification`**: Progress tracking in `gamification.js`
  - Manages reading streaks, daily goals, achievements
  - Calculates and displays user statistics
  
- **`HadeethLocalization`**: Internationalization in `localization.js`
  - Provides Arabic/English translation system
  - Handles RTL text rendering and Arabic numerals
  
- **`HadeethNotificationManager`**: Background notifications in `background.js`
  - Schedules daily reading reminders
  - Handles notification clicks and user actions

### Storage Strategy
**Offline-First with Fallbacks**:
```javascript
// Primary: Chrome Storage API (syncs across devices)
if (typeof chrome !== 'undefined' && chrome.storage) {
    await chrome.storage.local.get(['settings']);
} else {
    // Fallback: localStorage for development/testing
    localStorage.getItem('hadith-garden-settings');
}
```

**Storage Schema**:
- `settings`: UI preferences, language, theme, display options
- `favorites`: Array of saved hadith with full text
- `userStats`: Progress tracking, streaks, achievements, goals
- `currentIndex`: Current reading position (0-1895)
- `notificationSettings`: Reminder schedule and preferences

### Theme System
- Supports light, dark, and auto (system preference) themes
- CSS custom properties for easy theme switching
- Respects `prefers-color-scheme` media query
- Theme persistence across sessions

### Internationalization (i18n)
- Complete Arabic/English interface translations
- RTL text support with proper typography
- Arabic numeral formatting with `formatNumber()` method
- Dynamic language switching without page reload

### Keyboard Navigation
```javascript
// Global shortcuts defined in setupEventListeners()
'Space': 'Next hadith',
'←': 'Previous hadith', 
'/': 'Open search',
'Ctrl+K': 'Open search (alternative)',
'F': 'Toggle favorites',
'Esc': 'Close modals'
```

### Accessibility Features
- Keyboard navigation support
- Screen reader compatible ARIA labels
- High contrast theme support
- Focus management for modal dialogs

## Configuration & Environment

### Manifest V3 Permissions
```json
{
  "permissions": ["storage", "notifications", "alarms"],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'; style-src 'self' 'unsafe-inline';"
  }
}
```

### Critical Files & Sizes
- `data/riyadussalihin.json`: ~500KB (1,896 hadith entries)
- Icons must be PNG format (16px, 48px, 128px)
- `web_accessible_resources` allows access to JSON data and icons

### Browser Support
- **Chrome**: Full compatibility with Chrome Web Store
- **Microsoft Edge**: Full compatibility with Edge Add-ons Store
- **Other Chromium browsers**: Compatible (Brave, Opera, etc.)
- **Firefox**: Not compatible (uses different extension API - WebExtensions)

### Development Gotchas

#### Service Worker Limitations
- Background script runs as service worker (not persistent background page)
- Cannot use `localStorage` in service worker - must use Chrome Storage API
- Service worker may terminate; use `chrome.alarms` for persistent scheduling

#### Hadith Data Loading
- JSON file is loaded via `chrome.runtime.getURL()` in extension context
- Falls back to relative path for development server testing
- Consider chunking if file size becomes problematic

#### RTL Text Handling
- Arabic text requires `direction: rtl` and proper font stack
- Use `Arabic Typesetting, Times New Roman` for best Arabic rendering
- Number formatting handled by `HadeethLocalization.formatNumber()`

#### Notification Scheduling
- Requires `notifications` and `alarms` permissions
- User must grant notification permission at runtime
- Daily alarms persist across browser restarts
- Test notifications with `chrome.alarms` API

### Testing Considerations
```bash
# Test extension loading
# 1. Load unpacked extension in Developer mode
# 2. Check chrome://extensions/ for errors
# 3. Inspect background script in Service Workers section

# Test data loading
# 1. Open Developer Tools on new tab
# 2. Check Network tab for JSON loading
# 3. Verify no CORS errors

# Test storage
# 1. Open Application tab in DevTools
# 2. Check Chrome Storage -> Extension storage
# 3. Verify settings persistence

# Test notifications
# 1. Enable notifications in options
# 2. Use "Test Notification" button
# 3. Check chrome://settings/content/notifications
```

### Common Development Tasks

#### Adding New Hadith Collections
1. Create new JSON file in `data/` directory
2. Update `web_accessible_resources` in manifest.json
3. Modify `loadHadithData()` method to support collection selection
4. Update localization strings for new collection names

#### Adding New Languages
1. Extend `translations` object in `localization.js`
2. Add language option to `options.html`
3. Test RTL languages require additional CSS considerations
4. Update `setLanguage()` method to handle new language codes

#### Modifying Themes
1. Update CSS custom properties in `newtab.css` and `options.css`
2. Test with both light and dark system preferences
3. Ensure sufficient color contrast for accessibility
4. Consider Islamic design elements and color psychology

### Cross-Browser Deployment

#### Chrome Web Store
1. Run build script: `./build-chrome.sh`
2. Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
3. Upload generated ZIP file and complete store listing
4. Submit for review (typically 1-7 days)

#### Microsoft Edge Add-ons Store
1. Run build script: `./build-edge.sh`
2. Visit [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge)
3. Upload generated ZIP file and complete store listing
4. Complete store listing and submit for review (typically 3-7 days)

#### Key Differences
- **Chrome**: Remove `browser-compat.js` from package (optional)
- **Edge**: Keep `browser-compat.js` for future compatibility
- **Manifest**: Both stores accept the same manifest.json with dual URL overrides
- **APIs**: Both use identical extension APIs (Chrome APIs work in Edge)
- **Icons**: Same icon files work for both stores
- **Permissions**: Identical permission model

### Cross-Browser Testing
```bash
# Test in Chrome
# 1. Load extension in chrome://extensions/
# 2. Open new tab to test new tab override
# 3. Test notifications, storage, and settings

# Test in Edge
# 1. Load extension in edge://extensions/
# 2. Open new tab to test new tab override
# 3. Verify all features work identically

# Test storage sync
# 1. Configure settings in Chrome
# 2. Load same extension in Edge
# 3. Verify settings sync via Chrome Storage API
```

This codebase follows Islamic development principles with attention to cultural sensitivity, Arabic language support, and spiritual user experience.
