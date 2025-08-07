#!/usr/bin/env python3
"""
Create a Chrome Web Store ready zip file for the Hadith Garden Tab extension
"""

import zipfile
import os
import json

def create_chrome_extension_zip():
    """Create the Chrome extension zip file"""
    
    source_dir = 'chrome-extension-package'
    output_file = 'hadith-garden-tab-chrome-extension.zip'
    
    print(f"Creating Chrome extension zip file: {output_file}")
    
    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Walk through all files in the source directory
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Get relative path from source_dir
                relative_path = os.path.relpath(file_path, source_dir)
                
                # Add file to zip
                zipf.write(file_path, relative_path)
                print(f"  Added: {relative_path}")
    
    # Get file size
    size_bytes = os.path.getsize(output_file)
    size_mb = size_bytes / (1024 * 1024)
    
    print(f"\n✅ Chrome extension zip created successfully!")
    print(f"📦 File: {output_file}")
    print(f"📏 Size: {size_mb:.2f} MB ({size_bytes:,} bytes)")
    
    # Show contents summary
    with zipfile.ZipFile(output_file, 'r') as zipf:
        file_list = zipf.namelist()
        print(f"📁 Contains {len(file_list)} files:")
        
        # Group files by type
        files_by_type = {}
        for file_name in file_list:
            ext = os.path.splitext(file_name)[1].lower()
            if ext not in files_by_type:
                files_by_type[ext] = []
            files_by_type[ext].append(file_name)
        
        for ext, files in sorted(files_by_type.items()):
            print(f"  {ext or 'no extension'}: {len(files)} files")
            if ext == '.json' and 'data/riyadussalihin.json' in files:
                # Show hadith count
                try:
                    with zipf.open('data/riyadussalihin.json') as f:
                        hadith_data = json.loads(f.read().decode('utf-8'))
                        print(f"    → {len(hadith_data)} authentic hadith included")
                except:
                    pass
    
    print(f"\n🚀 Ready for Chrome Web Store upload!")
    print(f"📋 Upload this file to: https://chrome.google.com/webstore/developer/dashboard")
    
    return output_file

def validate_extension_structure():
    """Validate that all required files are present"""
    required_files = [
        'manifest.json',
        'newtab.html',
        'newtab.css',
        'newtab.js',
        'options.html',
        'options.css',
        'options.js',
        'localization.js',
        'gamification.js',
        'data/riyadussalihin.json',
        'icons/icon-16.svg',
        'icons/icon-48.svg',
        'icons/icon-128.svg'
    ]
    
    missing_files = []
    source_dir = 'chrome-extension-package'
    
    for file_path in required_files:
        full_path = os.path.join(source_dir, file_path)
        if not os.path.exists(full_path):
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Missing required files:")
        for file_path in missing_files:
            print(f"  - {file_path}")
        return False
    
    print("✅ All required files present")
    return True

def main():
    print("=" * 60)
    print("CHROME EXTENSION ZIP CREATOR")
    print("Hadith Garden Tab - Web Store Package")
    print("=" * 60)
    
    # Validate structure
    if not validate_extension_structure():
        print("\n❌ Extension package validation failed!")
        return
    
    # Create the zip file
    zip_file = create_chrome_extension_zip()
    
    print("\n" + "=" * 60)
    print("UPLOAD INSTRUCTIONS:")
    print("1. Go to Chrome Web Store Developer Dashboard")
    print("2. Click 'New Item' or 'Update existing item'")
    print(f"3. Upload: {zip_file}")
    print("4. Fill in the store listing details")
    print("5. Submit for review")
    print("=" * 60)

if __name__ == "__main__":
    main()