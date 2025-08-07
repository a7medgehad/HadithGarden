// Hadeeth Garden Tab - New Tab Script
class HadeethGardenTab {
    constructor() {
        this.currentHadith = null;
        this.hadithData = [];
        this.settings = {
            showArabic: true,
            showEnglish: true,
            fontSize: 16,
            theme: 'auto'
        };
        this.favorites = [];
        this.init();
    }

    async init() {
        try {
            // Load settings and favorites from storage
            await this.loadSettings();
            await this.loadFavorites();
            
            // Apply theme
            this.applyTheme();
            
            // Load hadith data
            await this.loadHadithData();
            
            // Load and display current hadith
            await this.loadCurrentHadith();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize Feather icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
            
        } catch (error) {
            console.error('Failed to initialize Hadeeth Garden Tab:', error);
            this.showErrorState();
        }
    }

    async loadSettings() {
        try {
            // Check if Chrome extension APIs are available
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                const result = await chrome.storage.local.get(['settings']);
                if (result.settings) {
                    this.settings = { ...this.settings, ...result.settings };
                }
            } else {
                // Fallback to localStorage for development
                const savedSettings = localStorage.getItem('hadeeth-garden-settings');
                if (savedSettings) {
                    this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
                }
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    async loadFavorites() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                const result = await chrome.storage.local.get(['favorites']);
                this.favorites = result.favorites || [];
            } else {
                // Fallback to localStorage for development
                const savedFavorites = localStorage.getItem('hadeeth-garden-favorites');
                this.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
            }
        } catch (error) {
            console.error('Failed to load favorites:', error);
            this.favorites = [];
        }
    }

    applyTheme() {
        const { theme } = this.settings;
        const body = document.body;
        
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            body.removeAttribute('data-theme');
        } else if (theme === 'auto') {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                body.setAttribute('data-theme', 'dark');
            } else {
                body.removeAttribute('data-theme');
            }
        }
    }

    async loadHadithData() {
        try {
            let response;
            // Try to use Chrome extension API first, fallback to relative path
            try {
                response = await fetch(chrome.runtime.getURL('data/riyadussalihin.json'));
            } catch (extensionError) {
                // Fallback for when running outside extension context (like in development server)
                response = await fetch('data/riyadussalihin.json');
            }
            
            if (!response.ok) {
                throw new Error(`Failed to load hadith data: ${response.status}`);
            }
            this.hadithData = await response.json();
            
            if (!this.hadithData || this.hadithData.length === 0) {
                throw new Error('Hadith data is empty');
            }
        } catch (error) {
            console.error('Error loading hadith data:', error);
            throw error;
        }
    }

    async loadCurrentHadith() {
        try {
            let currentIndex = 0;
            
            // Get current index from storage
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                const result = await chrome.storage.local.get(['currentIndex']);
                currentIndex = result.currentIndex || 0;
            } else {
                // Fallback to localStorage for development
                const savedIndex = localStorage.getItem('hadeeth-garden-currentIndex');
                currentIndex = savedIndex ? parseInt(savedIndex) : 0;
            }
            
            // Ensure index is within bounds
            if (currentIndex >= this.hadithData.length) {
                currentIndex = 0;
            }
            
            // Get the hadith at current index
            this.currentHadith = this.hadithData[currentIndex];
            
            // Increment index for next time, with wraparound
            const nextIndex = (currentIndex + 1) % this.hadithData.length;
            
            // Save next index
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ currentIndex: nextIndex });
            } else {
                localStorage.setItem('hadeeth-garden-currentIndex', nextIndex.toString());
            }
            
            // Display the hadith
            this.displayHadith();
            
        } catch (error) {
            console.error('Error loading current hadith:', error);
            this.showErrorState();
        }
    }

    async nextHadith() {
        try {
            let currentIndex = 0;
            
            // Get current index and increment manually
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                const result = await chrome.storage.local.get(['currentIndex']);
                currentIndex = result.currentIndex || 0;
            } else {
                const savedIndex = localStorage.getItem('hadeeth-garden-currentIndex');
                currentIndex = savedIndex ? parseInt(savedIndex) : 0;
            }
            
            // Get the hadith at current index
            this.currentHadith = this.hadithData[currentIndex];
            
            // Increment index for next time
            const nextIndex = (currentIndex + 1) % this.hadithData.length;
            
            // Save next index
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ currentIndex: nextIndex });
            } else {
                localStorage.setItem('hadeeth-garden-currentIndex', nextIndex.toString());
            }
            
            // Display the hadith with animation
            this.displayHadith(true);
            
        } catch (error) {
            console.error('Error loading next hadith:', error);
        }
    }

    displayHadith(animate = false) {
        if (!this.currentHadith) {
            this.showErrorState();
            return;
        }

        const hadithCard = document.getElementById('hadithCard');
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        
        // Hide loading and error states
        loadingState.style.display = 'none';
        errorState.style.display = 'none';

        // Update content
        this.updateHadithContent();
        
        // Show the hadith card with animation
        if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            hadithCard.style.opacity = '0';
            hadithCard.style.transform = 'translateY(20px)';
            hadithCard.style.display = 'block';
            
            // Force reflow
            hadithCard.offsetHeight;
            
            hadithCard.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            hadithCard.style.opacity = '1';
            hadithCard.style.transform = 'translateY(0)';
        } else {
            hadithCard.style.display = 'block';
        }

        // Update favorites button state
        this.updateFavoritesButton();
    }

    updateHadithContent() {
        const { currentHadith, settings } = this;
        
        // Update meta information
        document.getElementById('bookChip').textContent = `Book ${currentHadith.book}`;
        document.getElementById('numberChip').textContent = `Hadith ${currentHadith.number}`;
        
        // Update Arabic text
        const arabicText = document.getElementById('arabicText');
        if (settings.showArabic && currentHadith.arabic) {
            arabicText.textContent = currentHadith.arabic;
            arabicText.style.display = 'block';
        } else {
            arabicText.style.display = 'none';
        }
        
        // Update English text
        const englishText = document.getElementById('englishText');
        if (settings.showEnglish && currentHadith.english) {
            englishText.textContent = currentHadith.english;
            englishText.style.display = 'block';
        } else {
            englishText.style.display = 'none';
        }
        
        // Apply font size
        arabicText.style.fontSize = `${settings.fontSize * 1.25}px`;
        englishText.style.fontSize = `${settings.fontSize}px`;
    }

    updateFavoritesButton() {
        const favoritesBtn = document.getElementById('addToFavoritesBtn');
        const isFavorited = this.favorites.includes(this.currentHadith.id);
        
        if (isFavorited) {
            favoritesBtn.classList.add('favorited');
            favoritesBtn.innerHTML = '<i data-feather="star"></i><span>Remove from Favorites</span>';
        } else {
            favoritesBtn.classList.remove('favorited');
            favoritesBtn.innerHTML = '<i data-feather="star"></i><span>Add to Favorites</span>';
        }
        
        // Re-initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    showErrorState() {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('hadithCard').style.display = 'none';
        document.getElementById('errorState').style.display = 'block';
    }

    setupEventListeners() {
        // Next Hadith button
        document.getElementById('nextHadithBtn').addEventListener('click', () => {
            this.nextHadith();
        });
        
        // Retry button
        document.getElementById('retryBtn').addEventListener('click', () => {
            location.reload();
        });
        
        // View on Sunnah button
        document.getElementById('viewOnSunnahBtn').addEventListener('click', () => {
            if (this.currentHadith && this.currentHadith.url) {
                if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
                    chrome.tabs.create({ url: this.currentHadith.url });
                } else {
                    // Fallback to window.open for development
                    window.open(this.currentHadith.url, '_blank');
                }
            }
        });
        
        // Add to Favorites button
        document.getElementById('addToFavoritesBtn').addEventListener('click', async () => {
            await this.toggleFavorite();
        });
        
        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage();
            } else {
                // Fallback to opening options page directly
                window.open('options.html', '_blank');
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextHadith();
            } else if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
                    chrome.runtime.openOptionsPage();
                } else {
                    window.open('options.html', '_blank');
                }
            } else if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                this.toggleFavorite();
            }
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addListener(() => {
            if (this.settings.theme === 'auto') {
                this.applyTheme();
            }
        });
    }

    async toggleFavorite() {
        if (!this.currentHadith) return;
        
        const hadithId = this.currentHadith.id;
        const isFavorited = this.favorites.includes(hadithId);
        
        try {
            if (isFavorited) {
                // Remove from favorites
                this.favorites = this.favorites.filter(id => id !== hadithId);
            } else {
                // Add to favorites
                this.favorites.push(hadithId);
            }
            
            // Save to storage
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ favorites: this.favorites });
            } else {
                localStorage.setItem('hadeeth-garden-favorites', JSON.stringify(this.favorites));
            }
            
            // Update button state
            this.updateFavoritesButton();
            
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    }
}

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HadeethGardenTab();
    });
} else {
    new HadeethGardenTab();
}

// Extension is ready for use
