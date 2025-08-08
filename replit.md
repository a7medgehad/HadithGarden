# Overview

Hadith Garden is a Chrome Extension (Manifest V3) that replaces the new tab page with sequential hadith from Riyāḍ al-Ṣāliḥīn. The extension features an elegant Islamic garden theme and provides a focused, peaceful reading experience for users wanting to incorporate Islamic teachings into their daily browsing routine.

The application displays hadith in proper sequence (not random), automatically tracking reading progress and providing both Arabic text and English translations. It includes favorites management, customizable display settings, and direct integration with sunnah.com for additional context.

## Recent Changes (August 7, 2025)
- ✅ **Complete Chrome Extension Built**: Fully functional Manifest V3 extension ready for installation
- ✅ **Sequential Hadith System**: Proper sequential reading with wraparound functionality  
- ✅ **Islamic Garden Theme**: Beautiful green-themed UI with geometric patterns and responsive design
- ✅ **Dual Language Support**: Arabic text (RTL) with Amiri font, English with Inter font
- ✅ **Settings & Customization**: Theme switcher, font size adjustment, language toggles
- ✅ **Favorites System**: Add/remove/export/import favorites with JSON file support
- ✅ **Complete Authentic Collection**: All 1,896 authentic hadith from Riyāḍ al-Ṣāliḥīn with offline functionality
- ✅ **Cross-Environment Support**: Works in both Chrome extension and development server contexts
- ✅ **Accessibility Features**: Keyboard shortcuts, reduced motion support, semantic HTML

### Latest Updates - Enhanced Favorites & Chrome Store Preparation
- ✅ **Enhanced Layout**: Moved hadith content to top, gamification section to bottom for better reading focus
- ✅ **Beautiful Open Book Logo**: Replaced plant emoji with professional open book SVG logo
- ✅ **User-Customizable Daily Goals**: Added input control for setting daily reading targets (1-20 hadith)
- ✅ **Improved Arabic Localization**: 
  - Changed title to "حديقة الأحاديث" (Hadith Garden)
  - Updated streak text to "أيام القراءة المتواصلة" (Consecutive Reading Days)
  - Enhanced achievement names with encouraging Arabic terms:
    * "بداية مباركة" (Blessed Beginning)
    * "مواظب الأسبوع" (Week Consistent)
    * "نجم الشهر" (Star of the Month)
    * "طالب علم مجتهد" (Diligent Knowledge Seeker)
- ✅ **Updated English Title**: Changed from "Garden Tab – Riyāḍ al-Ṣāliḥīn" to "Hadith Garden"
- ✅ **Daily Progress Persistence**: Fixed browser restart issues with proper async data management
- ✅ **Western Arabic Numerals**: Changed to standard numerals (1,2,3) for better readability
- ✅ **Fixed Favorites System**: Complete modal functionality with working close button, remove hadith, and jump-to features
- ✅ **Chrome Store Description**: Added comprehensive store listing with detailed feature descriptions and keywords
- ✅ **Notifications Removed**: Eliminated daily notification system as requested, simplified manifest permissions
- ✅ **Complete Hadith Database**: Downloaded and processed all 1,896 authentic hadith from AhmedBaset/hadith-json repository
- ✅ **Arabic Number Localization**: Fixed Arabic interface to properly display chapter and hadith numbers
- ✅ **Updated Store Description**: Highlighted complete collection of 1,896 hadith in Chrome Web Store listing

### Latest Bug Fixes & GitHub Integration (August 8, 2025)
- ✅ **Fixed Favorites Visual Updates**: Star icon now changes color immediately when toggled, no navigation required
- ✅ **Fixed Star Icon Styling**: Only the star turns gold, not the entire button background 
- ✅ **Removed Navigation Error Messages**: Eliminated error notifications when jumping to favorite hadith
- ✅ **Fixed Arabic Favorites Modal**: Complete Arabic localization for favorites modal including title, buttons, and text display
- ✅ **Enhanced RTL Support**: Proper text direction and alignment for Arabic content in favorites modal
- ✅ **Fixed Button Layout**: English interface keeps buttons in one row, better responsive design
- ✅ **Fixed Language Switching**: Favorites button text updates immediately when switching languages
- ✅ **Enhanced Language System**: Added custom events for real-time UI updates on language change
- ✅ **Fixed "View on Sunnah" URL**: Robust URL validation and correction for proper sunnah.com navigation
- ✅ **GitHub Repository Integration**: Connected to https://github.com/a7medgehad/HadithGarden.git
- ✅ **Updated Extension Package**: Fresh zip file with all UI, localization, and URL fixes included
- ✅ **Enhanced CSS Specificity**: Added !important rules for star icon coloring to prevent override

### Latest Complete Feature Implementation (August 8, 2025)
- ✅ **Complete Chrome Extension Built**: Fully functional Manifest V3 extension ready for Chrome Web Store upload
- ✅ **Full Chrome Storage Integration**: All user data (favorites, reading position, settings, progress) automatically saved and synced
- ✅ **Advanced Search System**: Full-text search across all 1,896 hadith with Arabic/English filtering and instant results
- ✅ **Enhanced Keyboard Navigation**: Space bar (next with progress tracking), Left arrow (previous), / (search), F (favorites)
- ✅ **Fixed Toolbar Visibility**: All navigation buttons (search, previous, favorites, settings) now properly visible with CSS !important rules
- ✅ **Comprehensive Progress Tracking**: Space bar navigation now properly updates daily goals, streaks, and achievements
- ✅ **Complete Documentation Package**: Chrome Store description, installation guide, updated README with full feature details
- ✅ **Production-Ready Extension**: Final 642KB zip package ready for Chrome Web Store submission
- ✅ **Authentication System**: Direct integration with Chrome storage API for persistent data across browser sessions
- ✅ **Search Modal Interface**: Professional search interface with language filtering and preview text
- ✅ **Zero External Dependencies**: Complete offline functionality with local assets and system fonts
- ✅ **Professional Documentation**: Comprehensive installation guide, troubleshooting, and feature explanations

### Complete Authentic Dataset Integration (August 8, 2025)
- ✅ **Direct Sunnah.com Scraping**: Successfully scraped all 1,896 authentic hadith directly from sunnah.com chapter pages
- ✅ **Verified Data Source**: Obtained directly from sunnah.com using introduction page and chapters 1-19
- ✅ **Complete Chapter Structure**: All 20 chapters properly mapped from "The Book of Miscellany" through "The Book of Forgiveness"
- ✅ **Dual Language Content**: Full Arabic text with proper English translations including narrator attributions
- ✅ **Proper Sequential Order**: Hadith numbered 1-1,896 in correct reading sequence for daily progression
- ✅ **Metadata Integration**: Complete book, chapter, and reference information for each hadith entry
- ✅ **Correct URL Format**: Proper sunnah.com links using format `https://sunnah.com/riyadussalihin:1` through `:1896`
- ✅ **Updated Extension Package**: Final 650KB zip package with complete authentic dataset ready for Chrome Web Store
- ✅ **Cleaned Codebase**: Removed all temporary scraping and testing files, keeping only production-ready extension code

### Latest Arabic Localization Fix (August 8, 2025)
- ✅ **Fixed Achievement Arabic Text**: Achievement descriptions now properly display in Arabic instead of English
- ✅ **Complete Localization**: All achievement notifications ("Read your first hadith" etc.) now show Arabic translations
- ✅ **Enhanced Gamification**: Achievement system fully supports Arabic with proper RTL text display
- ✅ **Updated Extension Package**: Final package includes complete Arabic localization fixes

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Pure HTML/CSS/JavaScript**: No frontend frameworks used, keeping the extension lightweight and fast-loading
- **Responsive Design**: CSS Grid and Flexbox for layout adaptation across screen sizes
- **Theme System**: CSS custom properties (variables) enabling dynamic light/dark theme switching
- **Component-Based Structure**: Separate classes for tab functionality (`HadeethGardenTab`) and options management (`HadeethGardenOptions`)

## Data Storage & Management
- **Chrome Storage API**: Uses `chrome.storage.local` for persistent data storage including:
  - Current hadith index for sequential reading
  - User settings (theme, font size, display preferences)
  - Favorites collection
- **Local JSON Cache**: Pre-bundled hadith data in `data/riyadussalihin.json` to avoid external API calls
- **Progressive Enhancement**: Graceful fallbacks for loading states and error handling

## Extension Architecture
- **New Tab Override**: Replaces Chrome's default new tab page via `chrome_url_overrides`
- **Options Page**: Dedicated settings interface accessible via extension popup and dedicated page
- **Manifest V3 Compliance**: Uses latest Chrome extension standards with proper permissions and service worker architecture

## State Management
- **Sequential Reading Logic**: Automatic progression through hadith collection with wrap-around functionality
- **Settings Persistence**: User preferences saved and restored across sessions
- **Favorites System**: Add/remove/export/import functionality for bookmarked hadith

## UI/UX Design Patterns
- **Islamic Aesthetic**: Garden theme with geometric patterns and green color palette
- **Accessibility**: Proper focus management, reduced motion support, and semantic HTML
- **Typography**: Arabic text uses Amiri font with RTL support, English uses Inter font
- **Animation**: Smooth transitions with respect for `prefers-reduced-motion`

# External Dependencies

## Web Fonts
- **Google Fonts**: Amiri (Arabic text) and Inter (English text) loaded via CDN
- **Feather Icons**: Icon library for UI elements loaded from CDN

## Chrome Extension APIs
- **Storage API**: For persistent data management
- **Active Tab Permission**: For basic tab interaction capabilities

## Data Source
- **Sunnah.com Integration**: Deep linking to specific hadith pages for extended reading
- **Local JSON Data**: Self-contained hadith collection eliminating external API dependencies

## Browser Standards
- **CSS Custom Properties**: For dynamic theming
- **Web Storage**: Chrome's local storage for extension data
- **Responsive Design**: CSS Grid, Flexbox, and media queries for cross-device compatibility