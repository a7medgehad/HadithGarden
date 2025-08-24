#!/bin/bash

# Build script for Microsoft Edge Add-ons Store deployment
# This script packages the extension for Edge Add-ons Store

echo "🌿 Building Hadith Garden for Microsoft Edge Add-ons Store..."

# Get version from manifest.json
VERSION=$(grep -o '"version": "[^"]*' manifest.json | grep -o '[^"]*$')

# Create Edge-specific build directory
BUILD_DIR="build-edge"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Copy all files except excluded ones
echo "📦 Copying files..."
rsync -av --exclude='.git' \
          --exclude='*.DS_Store' \
          --exclude='WARP.md' \
          --exclude='build-*' \
          --exclude='*.sh' \
          . $BUILD_DIR/

# Create ZIP file
ZIP_NAME="hadith-garden-edge-v$VERSION.zip"
echo "🗜️  Creating Edge Add-ons Store package: $ZIP_NAME"
cd $BUILD_DIR
zip -r "../$ZIP_NAME" . -q

cd ..
rm -rf $BUILD_DIR

echo "✅ Edge package created successfully: $ZIP_NAME"
echo "📋 Ready for Microsoft Edge Add-ons Store submission!"
echo ""
echo "Next steps:"
echo "1. Go to https://partner.microsoft.com/dashboard/microsoftedge"
echo "2. Upload $ZIP_NAME"
echo "3. Complete store listing"
echo "4. Submit for review"
