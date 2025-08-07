// Hadeeth Garden Tab - Options/Settings Script
class HadeethGardenOptions {
    constructor() {
        this.settings = {
            showArabic: true,
            showEnglish: true,
            fontSize: 16,
            theme: 'auto'
        };
        this.favorites = [];
        this.hadithData = [];
        this.init();
    }

    async init() {
        try {
            await this.loadHadithData();
            await this.loadSettings();
            await this.loadFavorites();
            await this.updateProgressInfo();
            this.setupEventListeners();
            this.updateUI();
            
            // Initialize Feather icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        } catch (error) {
            console.error('Failed to initialize options:', error);
            this.showNotification('Failed to load settings. Please try again.', 'error');
        }
    }

    async loadHadithData() {
        try {
            const response = await fetch(chrome.runtime.getURL('data/riyadussalihin.json'));
            if (!response.ok) {
                throw new Error(`Failed to load hadith data: ${response.status}`);
            }
            this.hadithData = await response.json();
        } catch (error) {
            console.error('Error loading hadith data:', error);
            throw error;
        }
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['settings']);
            if (result.settings) {
                this.settings = { ...this.settings, ...result.settings };
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    async loadFavorites() {
        try {
            const result = await chrome.storage.local.get(['favorites']);
            this.favorites = result.favorites || [];
        } catch (error) {
            console.error('Failed to load favorites:', error);
            this.favorites = [];
        }
    }

    async updateProgressInfo() {
        try {
            const result = await chrome.storage.local.get(['currentIndex']);
            const currentIndex = result.currentIndex || 0;
            const totalHadiths = this.hadithData.length;
            const progressPercentage = Math.round((currentIndex / totalHadiths) * 100);

            document.getElementById('currentHadithNumber').textContent = currentIndex + 1;
            document.getElementById('totalHadiths').textContent = totalHadiths;
            document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
            
            const progressFill = document.getElementById('progressFill');
            progressFill.style.width = `${progressPercentage}%`;
            
            document.getElementById('favoritesCount').textContent = this.favorites.length;
        } catch (error) {
            console.error('Error updating progress info:', error);
        }
    }

    updateUI() {
        // Update display settings
        document.getElementById('showArabic').checked = this.settings.showArabic;
        document.getElementById('showEnglish').checked = this.settings.showEnglish;
        document.getElementById('fontSize').value = this.settings.fontSize;
        document.getElementById('fontSizeValue').textContent = `${this.settings.fontSize}px`;

        // Update theme settings
        const themeInputs = document.querySelectorAll('input[name="theme"]');
        themeInputs.forEach(input => {
            input.checked = input.value === this.settings.theme;
        });



        // Apply current theme to options page
        this.applyTheme();
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

    setupEventListeners() {
        // Display settings
        document.getElementById('showArabic').addEventListener('change', (e) => {
            this.settings.showArabic = e.target.checked;
        });

        document.getElementById('showEnglish').addEventListener('change', (e) => {
            this.settings.showEnglish = e.target.checked;
        });

        document.getElementById('fontSize').addEventListener('input', (e) => {
            this.settings.fontSize = parseInt(e.target.value);
            document.getElementById('fontSizeValue').textContent = `${this.settings.fontSize}px`;
        });

        // Theme settings
        const themeInputs = document.querySelectorAll('input[name="theme"]');
        themeInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.settings.theme = e.target.value;
                    this.applyTheme();
                }
            });
        });

        // Progress management
        document.getElementById('resetProgressBtn').addEventListener('click', async () => {
            await this.resetProgress();
        });

        // Favorites management
        document.getElementById('exportFavoritesBtn').addEventListener('click', () => {
            this.exportFavorites();
        });

        document.getElementById('importFavoritesBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importFavorites(e.target.files[0]);
            }
        });

        document.getElementById('clearFavoritesBtn').addEventListener('click', async () => {
            await this.clearFavorites();
        });

        // Save settings
        document.getElementById('saveSettingsBtn').addEventListener('click', async () => {
            await this.saveSettings();
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addListener(() => {
            if (this.settings.theme === 'auto') {
                this.applyTheme();
            }
        });



        // Close notification
        document.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification();
        });

        // Auto-hide notification after 5 seconds
        let notificationTimeout;
        const notification = document.getElementById('notification');
        const observer = new MutationObserver(() => {
            if (notification.classList.contains('show')) {
                clearTimeout(notificationTimeout);
                notificationTimeout = setTimeout(() => {
                    this.hideNotification();
                }, 5000);
            }
        });
        observer.observe(notification, { attributes: true, attributeFilter: ['class'] });
    }

    async saveSettings() {
        try {
            // Validate settings
            if (!this.settings.showArabic && !this.settings.showEnglish) {
                this.showNotification('At least one language must be enabled.', 'error');
                return;
            }

            await chrome.storage.local.set({ settings: this.settings });
            

            
            this.showNotification('Settings saved successfully!', 'success');
            
            // Add visual feedback to save button
            const saveBtn = document.getElementById('saveSettingsBtn');
            saveBtn.classList.add('success', 'pulse');
            setTimeout(() => {
                saveBtn.classList.remove('success', 'pulse');
            }, 1000);
            
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showNotification('Failed to save settings. Please try again.', 'error');
        }
    }

    async resetProgress() {
        try {
            const confirmed = confirm('Are you sure you want to reset reading progress to the first hadith?');
            if (!confirmed) return;

            await chrome.storage.local.set({ currentIndex: 0 });
            await this.updateProgressInfo();
            this.showNotification('Reading progress reset to the first hadith.', 'success');
        } catch (error) {
            console.error('Failed to reset progress:', error);
            this.showNotification('Failed to reset progress. Please try again.', 'error');
        }
    }

    exportFavorites() {
        try {
            if (this.favorites.length === 0) {
                this.showNotification('No favorites to export.', 'info');
                return;
            }

            // Get favorite hadiths with full data
            const favoriteHadiths = this.favorites.map(id => {
                const hadith = this.hadithData.find(h => h.id === id);
                return hadith || { id, note: 'Hadith not found' };
            });

            const exportData = {
                exported: new Date().toISOString(),
                version: '1.0.0',
                count: this.favorites.length,
                favorites: favoriteHadiths
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `hadeeth-garden-favorites-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification(`${this.favorites.length} favorites exported successfully!`, 'success');
        } catch (error) {
            console.error('Failed to export favorites:', error);
            this.showNotification('Failed to export favorites. Please try again.', 'error');
        }
    }

    async importFavorites(file) {
        try {
            const text = await file.text();
            const importData = JSON.parse(text);
            
            if (!importData.favorites || !Array.isArray(importData.favorites)) {
                throw new Error('Invalid favorites file format');
            }

            // Extract hadith IDs and validate they exist in our data
            const validIds = importData.favorites
                .map(hadith => hadith.id)
                .filter(id => this.hadithData.some(h => h.id === id));

            if (validIds.length === 0) {
                this.showNotification('No valid favorites found in the imported file.', 'error');
                return;
            }

            const confirmed = confirm(
                `Import ${validIds.length} favorites? This will replace your current favorites.`
            );
            if (!confirmed) return;

            this.favorites = validIds;
            await chrome.storage.local.set({ favorites: this.favorites });
            await this.updateProgressInfo();
            
            this.showNotification(
                `${validIds.length} favorites imported successfully!`, 
                'success'
            );
        } catch (error) {
            console.error('Failed to import favorites:', error);
            this.showNotification(
                'Failed to import favorites. Please check the file format.', 
                'error'
            );
        }
    }

    async clearFavorites() {
        try {
            if (this.favorites.length === 0) {
                this.showNotification('No favorites to clear.', 'info');
                return;
            }

            const confirmed = confirm(
                `Are you sure you want to clear all ${this.favorites.length} favorites? This cannot be undone.`
            );
            if (!confirmed) return;

            this.favorites = [];
            await chrome.storage.local.set({ favorites: this.favorites });
            await this.updateProgressInfo();
            
            this.showNotification('All favorites cleared successfully.', 'success');
        } catch (error) {
            console.error('Failed to clear favorites:', error);
            this.showNotification('Failed to clear favorites. Please try again.', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageElement = notification.querySelector('.notification-message');
        
        messageElement.textContent = message;
        
        // Remove existing type classes
        notification.classList.remove('success', 'error', 'info');
        if (type !== 'info') {
            notification.classList.add(type);
        }
        
        notification.classList.add('show');
    }

    hideNotification() {
        const notification = document.getElementById('notification');
        notification.classList.remove('show');
    }


}

// Initialize the options page when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HadeethGardenOptions();
    });
} else {
    new HadeethGardenOptions();
}
