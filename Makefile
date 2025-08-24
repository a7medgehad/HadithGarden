# HadithGarden - Chrome Extension Makefile
# Provides easy commands for development and scraping operations

.PHONY: help scrape-bukhari setup-scraper clean-scraper test-scraper

# Default target
help:
	@echo "Available commands:"
	@echo "  scrape-bukhari   - Scrape all 7,563 Sahih al-Bukhari hadith (requires Python 3.7+)"
	@echo "  setup-scraper    - Set up Python virtual environment for scraping"
	@echo "  clean-scraper    - Clean up scraping files and virtual environment"
	@echo "  test-scraper     - Run a quick test of the scraping setup"
	@echo "  help             - Show this help message"

# Set up Python virtual environment and install dependencies
setup-scraper:
	@echo "🔧 Setting up Python virtual environment for scraping..."
	python3 -m venv scripts/venv
	scripts/venv/bin/pip install --upgrade pip
	scripts/venv/bin/pip install -r scripts/requirements.txt
	@echo "✅ Virtual environment created at scripts/venv"
	@echo "💡 Run 'make scrape-bukhari' to start scraping"

# Full scraping operation
scrape-bukhari: setup-scraper
	@echo "🚀 Starting Sahih al-Bukhari scraping process..."
	@echo "📊 This will scrape 7,563 hadith from sunnah.com"
	@echo "⏱️ Estimated time: 3-5 minutes (depends on network speed)"
	@echo "🔄 Progress will be shown with a live progress bar"
	@echo ""
	cd scripts && ./venv/bin/python scrape_bukhari.py
	@echo ""
	@echo "✅ Scraping completed! Check data/sahih-bukhari.json"
	@echo "📈 File size should be approximately 8-10 MB"

# Test scraper setup without full run
test-scraper: setup-scraper
	@echo "🧪 Testing scraper setup..."
	cd scripts && ./venv/bin/python -c "import httpx, bs4, tqdm, tenacity; print('✅ All dependencies installed correctly')"
	cd scripts && ./venv/bin/python -c "from scrape_bukhari import HadithParser; print('✅ Scraper modules load correctly')"
	@echo "✅ Scraper is ready to run!"

# Clean up scraping artifacts
clean-scraper:
	@echo "🧹 Cleaning up scraping files..."
	rm -rf scripts/venv
	rm -f scripts/bukhari_urls.txt
	rm -f scripts/failed_urls.json
	rm -f scripts/scrape_bukhari.log
	rm -rf scripts/checkpoints
	@echo "✅ Cleanup completed"

# Development shortcuts
dev-server:
	@echo "🌐 Starting development server..."
	npx serve . --port 3000

# Extension packaging
package-chrome:
	@echo "📦 Packaging for Chrome Web Store..."
	./build-chrome.sh

package-edge:
	@echo "📦 Packaging for Microsoft Edge Add-ons..."
	./build-edge.sh
