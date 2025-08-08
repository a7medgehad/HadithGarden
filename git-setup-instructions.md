# Git Setup Instructions for Hadith Garden

## Issue Resolution
The "Error (UNKNOWN) adding origin" occurs due to Git lock files and Replit environment restrictions.

## Manual Setup Steps

### Option 1: Download and Upload to GitHub
1. Download the complete project files from Replit
2. Create a new repository on GitHub: `https://github.com/a7medgehad/HadithGarden`
3. Upload the files directly via GitHub's web interface
4. Your extension package is ready: `hadith-garden-chrome-extension.zip`

### Option 2: Local Git Setup
1. Download all project files to your local machine
2. Open terminal in the project folder
3. Run these commands:
```bash
git init
git add .
git commit -m "Complete Hadith Garden Chrome Extension with 1,896 authentic hadith"
git remote add origin https://github.com/a7medgehad/HadithGarden.git
git branch -M main
git push -u origin main
```

## Project Files Ready for GitHub
✅ **hadith-garden-chrome-extension.zip** - Complete extension package (650KB)
✅ **data/riyadussalihin.json** - All 1,896 authentic hadith scraped from sunnah.com
✅ **manifest.json** - Chrome Manifest V3 configuration
✅ **newtab.html/js/css** - Main extension interface
✅ **options.html/js/css** - Settings page
✅ **localization.js** - Arabic/English support
✅ **gamification.js** - Progress tracking system
✅ **icons/** - SVG icons for Chrome store
✅ **README.md** - Complete documentation
✅ **test-extension.html** - Installation demo page

## Repository Status
- **Complete Dataset**: 1,896 hadith directly from sunnah.com
- **Proper URLs**: Format `riyadussalihin:1` through `:1896`
- **Production Ready**: Chrome Web Store ready package
- **Fully Offline**: No external dependencies required

The project is complete and ready for GitHub upload using either method above.