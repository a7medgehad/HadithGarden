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
- ✅ **Local Data Storage**: 20 sample hadiths from Riyāḍ al-Ṣāliḥīn with offline functionality
- ✅ **Cross-Environment Support**: Works in both Chrome extension and development server contexts
- ✅ **Accessibility Features**: Keyboard shortcuts, reduced motion support, semantic HTML

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