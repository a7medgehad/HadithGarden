#!/bin/bash

# Build script for Chrome Web Store deployment
# This script packages the extension for Chrome Web Store

echo "🌿 Building Hadith Garden for Chrome Web Store..."

# Get version from manifest.json
VERSION=$(grep -o '"version": "[^"]*' manifest.json | grep -o '[^"]*$')

# Create Chrome-specific build directory
BUILD_DIR="build-chrome"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Copy all files except excluded ones
echo "📦 Copying files..."
rsync -av --exclude='.git' \
          --exclude='*.DS_Store' \
          --exclude='WARP.md' \
          --exclude='build-*' \
          --exclude='*.sh' \
          --exclude='browser-compat.js' \
          . $BUILD_DIR/

# Create ZIP file
ZIP_NAME="hadith-garden-chrome-v$VERSION.zip"
echo "🗜️  Creating Chrome Web Store package: $ZIP_NAME"
cd $BUILD_DIR
zip -r "../$ZIP_NAME" . -q

cd ..
rm -rf $BUILD_DIR

echo "✅ Chrome package created successfully: $ZIP_NAME"
echo "📋 Ready for Chrome Web Store submission!"
echo ""
echo "Next steps:"
echo "1. Go to https://chrome.google.com/webstore/devconsole/"
echo "2. Upload $ZIP_NAME"
echo "3. Complete store listing"
echo "4. Submit for review"
