# Chrome Web Store Upload Instructions

## Package Information
- **File**: `hadith-garden-tab-chrome-extension.zip`
- **Size**: 0.60 MB (630,281 bytes)
- **Contents**: Complete Hadith Garden Tab extension with 1,896 authentic hadith

## Required Files Included
✅ **Core Extension Files**
- `manifest.json` - Extension configuration (Manifest V3)
- `newtab.html` - New tab page HTML
- `newtab.css` - Styling for new tab page
- `newtab.js` - Main application logic

✅ **Options & Settings**
- `options.html` - Settings page HTML
- `options.css` - Settings page styling
- `options.js` - Settings page functionality

✅ **Feature Modules**
- `localization.js` - Arabic/English language support
- `gamification.js` - Achievement and progress tracking

✅ **Data & Assets**
- `data/riyadussalihin.json` - Complete collection of 1,896 authentic hadith
- `icons/icon-16.svg` - 16x16 extension icon
- `icons/icon-48.svg` - 48x48 extension icon
- `icons/icon-128.svg` - 128x128 extension icon
- `icons/logo.svg` - Application logo

## Upload Steps

### 1. Access Chrome Web Store Developer Dashboard
- Go to: https://chrome.google.com/webstore/developer/dashboard
- Sign in with your Google Developer account
- Pay the one-time $5 developer registration fee if not already registered

### 2. Create New Extension Item
- Click **"New Item"** button
- Select **"Upload ZIP file"**
- Upload `hadith-garden-tab-chrome-extension.zip`

### 3. Fill Store Listing Details

**Basic Information:**
- **Name**: Hadith Garden Tab
- **Summary**: Transform your new tab into a peaceful Islamic reading experience with 1,896 authentic hadith from Riyāḍ al-Ṣāliḥīn.
- **Category**: Productivity
- **Language**: English

**Detailed Description:**
```
Use the content from CHROME_STORE_DESCRIPTION.md file
```

**Screenshots Required** (you'll need to create these):
- Main extension interface (new tab page)
- Arabic text display
- Settings/options page
- Favorites modal
- Achievement/gamification features

**Privacy Information:**
- **Single Purpose**: Replaces new tab with Islamic hadith reading experience
- **Permission Justification**: 
  - `storage`: Save user settings and reading progress locally
  - `activeTab`: Open hadith reference links on sunnah.com
- **Data Usage**: All data stored locally, no external tracking

### 4. Review Checklist
- [ ] Extension name matches exactly: "Hadith Garden Tab"
- [ ] All required screenshots uploaded
- [ ] Privacy practices declared accurately
- [ ] Store listing content matches extension functionality
- [ ] Permissions are minimal and justified
- [ ] Extension works in private/incognito mode

### 5. Submit for Review
- Click **"Submit for Review"**
- Review timeline: Usually 1-3 business days
- Address any review feedback if requested

## Post-Publication
- Extension will be available at: chrome://extensions/
- Users can install via Chrome Web Store
- Monitor reviews and ratings
- Update as needed with new ZIP uploads

## Extension Features Highlight
- **Complete Offline Collection**: 1,896 authentic hadith from Riyāḍ al-Ṣāliḥīn
- **Sequential Reading**: Proper order, not random
- **Dual Language**: Arabic (RTL) and English support
- **Islamic Theme**: Beautiful green garden-inspired design
- **Gamification**: Reading streaks and achievements
- **Privacy-First**: All data stored locally, no tracking
- **Manifest V3**: Latest Chrome extension standards

## Support Information
- **Version**: 1.0.0
- **Compatibility**: Chrome 88+
- **Languages**: English, Arabic (عربي)
- **Data Source**: Authenticated hadith from sunnah.com