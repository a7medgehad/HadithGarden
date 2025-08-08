# Git Setup Commands for Hadith Garden

## Push to GitHub Repository

To upload your Hadith Garden project to GitHub, run these commands in order:

### 1. Remove any git lock files (if needed):
```bash
rm -f .git/index.lock .git/config.lock
```

### 2. Set the main branch:
```bash
git branch -M main
```

### 3. Add the GitHub remote:
```bash
git remote add origin https://github.com/a7medgehad/HadithGarden.git
```

### 4. Push to GitHub:
```bash
git push -u origin main
```

## Alternative Commands (if needed):

If you get errors, try:
```bash
git remote set-url origin https://github.com/a7medgehad/HadithGarden.git
git push -u origin main
```

## Project Status

Your project is ready for GitHub with:
- ✅ Complete Chrome extension functionality
- ✅ Privacy policy document
- ✅ Installation guides and documentation
- ✅ Clean, organized file structure
- ✅ All 1,896 authentic hadith from Riyāḍ al-Ṣāliḥīn

## Notes

- Make sure you have write access to the GitHub repository
- The repository https://github.com/a7medgehad/HadithGarden.git should exist
- All files are committed and ready for push

---
*Generated on August 8, 2025*