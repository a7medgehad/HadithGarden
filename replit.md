# Overview

Hadeeth Garden Tab is a Chrome Extension (Manifest V3) that replaces the new tab page with sequential hadith from Riyāḍ al-Ṣāliḥīn. The extension features an elegant Islamic garden theme and provides a focused, peaceful reading experience for users wanting to incorporate Islamic teachings into their daily browsing routine.

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
- ✅ **Updated English Title**: Changed from "Garden Tab – Riyāḍ al-Ṣāliḥīn" to "Hadith Garden Tab"
- ✅ **Daily Progress Persistence**: Fixed browser restart issues with proper async data management
- ✅ **Western Arabic Numerals**: Changed to standard numerals (1,2,3) for better readability
- ✅ **Fixed Favorites System**: Complete modal functionality with working close button, remove hadith, and jump-to features
- ✅ **Chrome Store Description**: Added comprehensive store listing with detailed feature descriptions and keywords
- ✅ **Notifications Removed**: Eliminated daily notification system as requested, simplified manifest permissions
- ✅ **Complete Hadith Database**: Downloaded and processed all 1,896 authentic hadith from AhmedBaset/hadith-json repository
- ✅ **Arabic Number Localization**: Fixed Arabic interface to properly display chapter and hadith numbers
- ✅ **Updated Store Description**: Highlighted complete collection of 1,896 hadith in Chrome Web Store listing

### Latest Arabic Support Enhancement (August 8, 2025)
- ✅ **Complete Language Switcher**: Added Arabic/English language selection in settings page
- ✅ **Enhanced Arabic Interface**: Full RTL support with proper text direction switching
- ✅ **Fixed Favorites Modal**: Resolved "Go to" and "Remove" button functionality issues  
- ✅ **Improved Button Styling**: Enhanced visual appearance of action buttons in favorites modal
- ✅ **Arabic Font Integration**: Proper Amiri font loading for authentic Arabic text display
- ✅ **Authentic Arabic Chapter Names**: Fixed display to show actual Arabic book names instead of generic "الكتاب" labels
- ✅ **Arabic Chapter Mapping**: Added comprehensive mapping of all 20 chapter names to authentic Arabic titles
- ✅ **Enhanced Arabic Numbers**: Improved hadith number display with proper "الحديث رقم" prefix
- ✅ **Comprehensive Testing**: All Arabic functionality verified and working correctly
- ✅ **Fixed CSP Errors**: Resolved Content Security Policy violations by downloading Feather Icons locally
- ✅ **Enhanced Security**: Removed external CDN dependencies to comply with Chrome extension security standards
- ✅ **Updated Chrome Package**: Extension zip file includes all improvements with local assets (707KB)

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