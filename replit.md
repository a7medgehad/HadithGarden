# Overview

Hadith Garden is a Chrome Extension (Manifest V3) that transforms the new tab page into a serene Islamic garden, displaying sequential hadith from Riyāḍ al-Ṣāliḥīn. The project's core purpose is to provide a focused, peaceful reading experience, seamlessly integrating Islamic teachings into daily browsing routines. Key capabilities include displaying hadith in proper sequence, automatic reading progress tracking, dual Arabic and English language support, favorites management, customizable display settings, and direct integration with sunnah.com for additional context. The business vision is to offer a unique, authentic, and user-friendly tool for spiritual enrichment, with market potential among Muslim internet users seeking to deepen their engagement with Islamic texts. The project aims to eventually include all six canonical hadith collections (Kutub al-Sittah).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Pure HTML/CSS/JavaScript**: No frontend frameworks are used to ensure a lightweight and fast-loading extension.
- **Responsive Design**: Utilizes CSS Grid and Flexbox for adaptive layouts across various screen sizes.
- **Theme System**: Employs CSS custom properties for dynamic light/dark theme switching, with a primary Islamic garden aesthetic featuring geometric patterns and a green color palette.
- **Component-Based Structure**: Organizes functionality into separate classes for tab management (`HadeethGardenTab`) and options handling (`HadeethGardenOptions`).

## Data Storage & Management
- **Chrome Storage API**: Leverages `chrome.storage.local` for persistent storage of user data, including current hadith index, settings (theme, font size, language), and favorites.
- **Local JSON Cache**: Pre-bundles all 1,896 hadith from Riyāḍ al-Ṣāliḥīn within `data/riyadussalihin.json`, enabling offline functionality and eliminating external API calls for hadith content.
- **Progressive Enhancement**: Implements graceful fallbacks for loading states and error handling to ensure a robust user experience.

## Extension Architecture
- **New Tab Override**: Replaces the default Chrome new tab page via `chrome_url_overrides` in the Manifest V3.
- **Options Page**: Provides a dedicated settings interface accessible from the extension popup and a standalone page.
- **Manifest V3 Compliance**: Adheres to the latest Chrome extension standards, including proper permissions and service worker architecture.

## State Management
- **Sequential Reading Logic**: Manages automatic progression through the hadith collection, including wrap-around functionality for continuous reading.
- **Settings Persistence**: Ensures user preferences are saved and restored across browser sessions.
- **Favorites System**: Supports adding, removing, exporting, and importing bookmarked hadith with full modal functionality.

## UI/UX Design Patterns
- **Islamic Aesthetic**: Features a garden theme with green color palette and geometric patterns.
- **Accessibility**: Incorporates proper focus management, support for `prefers-reduced-motion`, and semantic HTML.
- **Typography**: Uses Amiri font for Arabic text with proper RTL support, and Inter font for English text.
- **Animation**: Implements smooth transitions and visual feedback for button interactions, respecting user motion preferences.
- **Gamification**: Includes a system for daily goals, streaks, and achievements to encourage reading.

## Feature Specifications
- **Dual Language Support**: Displays hadith in both Arabic and English.
- **Advanced Search**: Full-text search across all hadith with Arabic/English filtering.
- **Enhanced Keyboard Navigation**: Shortcuts for next, previous, search, and favorites.
- **Complete Hadith Collection**: Contains all 1,896 authentic hadith from Riyāḍ al-Ṣāliḥīn.
- **Future Collections**: Designed to eventually support additional major hadith collections (e.g., Sahih al-Bukhari, Sahih Muslim).

# External Dependencies

## Web Fonts
- **Google Fonts**: Amiri (for Arabic text) and Inter (for English text), loaded via CDN.
- **Feather Icons**: An icon library used for UI elements, loaded from CDN.

## Chrome Extension APIs
- **Storage API**: Utilized for persistent data management within the extension.
- **Active Tab Permission**: Required for basic interaction capabilities with the active tab.

## Data Source
- **Sunnah.com**: Integrated for deep linking to specific hadith pages, allowing users to view hadith on sunnah.com for extended context.
- **Local JSON Data**: The primary source for all hadith content, embedded directly within the extension to ensure offline functionality.