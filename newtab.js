// Hadeeth Garden Tab - New Tab Script
class HadeethGardenTab {
    constructor() {
        this.currentHadith = null;
        this.hadithData = [];
        this.currentIndex = 0;
        this.settings = {
            showArabic: true,
            showEnglish: true,
            fontSize: 16,
            theme: 'auto',
            language: 'en',
            dailyGoal: 5
        };
        this.favorites = [];
        this.localization = new HadeethLocalization();
        this.gamification = new HadeethGamification(this.localization);
        this.filteredHadithData = [];
        this.init();
    }

    async init() {
        try {
            // Load settings and favorites from storage
            await this.loadSettings();
            await this.loadFavorites();
            
            // Initialize localization
            this.localization.setLanguage(this.settings.language);
            
            // Initialize gamification
            await this.gamification.init();
            
            // Apply theme
            this.applyTheme();
            
            // Render progress section
            this.renderProgressSection();
            
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
            
            // Get current index from storage - DON'T auto-increment on load
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
            
            // Get the hadith at current index (DO NOT increment here)
            this.currentHadith = this.hadithData[currentIndex];
            this.currentIndex = currentIndex;
            
            // Display the hadith
            this.displayHadith();
            
        } catch (error) {
            console.error('Error loading current hadith:', error);
            this.showErrorState();
        }
    }

    async nextHadith() {
        try {
            // Increment to next hadith
            const nextIndex = (this.currentIndex + 1) % this.hadithData.length;
            
            // Update current hadith and index
            this.currentHadith = this.hadithData[nextIndex];
            this.currentIndex = nextIndex;
            
            // Save new index
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ currentIndex: nextIndex });
            } else {
                localStorage.setItem('hadeeth-garden-currentIndex', nextIndex.toString());
            }
            
            // Display the hadith with animation
            this.displayHadith(true);
            
            // Update gamification progress
            await this.gamification.markHadithRead();
            this.renderProgressSection();
            
        } catch (error) {
            console.error('Error loading next hadith:', error);
        }
    }

    async previousHadith() {
        try {
            // Decrement to previous hadith with wraparound
            const prevIndex = this.currentIndex === 0 ? this.hadithData.length - 1 : this.currentIndex - 1;
            
            // Update current hadith and index
            this.currentHadith = this.hadithData[prevIndex];
            this.currentIndex = prevIndex;
            
            // Save new index
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ currentIndex: prevIndex });
            } else {
                localStorage.setItem('hadeeth-garden-currentIndex', prevIndex.toString());
            }
            
            // Display the hadith with animation
            this.displayHadith(true);
            
        } catch (error) {
            console.error('Error loading previous hadith:', error);
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
        
        // Update meta information with proper Arabic chapter names
        const chapterName = currentHadith.chapter || 'رياض الصالحين';
        const displayChapterName = this.localization.currentLanguage === 'ar' ? 
            this.localization.getArabicChapterName(chapterName) : 
            chapterName;
        
        const bookText = `${displayChapterName}`;
        const hadithText = `${this.localization.t('hadith.number')} ${this.localization.formatNumber(currentHadith.hadithNumber || currentHadith.id)}`;
        
        document.getElementById('bookChip').textContent = bookText;
        document.getElementById('numberChip').textContent = hadithText;
        
        // Update Arabic text
        const arabicText = document.getElementById('arabicText');
        if (settings.showArabic && currentHadith.arabicText) {
            arabicText.textContent = currentHadith.arabicText;
            arabicText.style.display = 'block';
        } else {
            arabicText.style.display = 'none';
        }
        
        // Update English text
        const englishText = document.getElementById('englishText');
        if (settings.showEnglish && currentHadith.englishText) {
            englishText.textContent = currentHadith.englishText;
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
        if (!favoritesBtn || !this.currentHadith) return;
        
        const isFavorited = this.favorites.includes(this.currentHadith.id);
        
        if (isFavorited) {
            favoritesBtn.classList.add('favorited');
            favoritesBtn.innerHTML = `<i class="star-icon favorited-star" data-feather="star"></i><span>${this.localization.t('hadith.removeFromFavorites')}</span>`;
        } else {
            favoritesBtn.classList.remove('favorited');
            favoritesBtn.innerHTML = `<i class="star-icon" data-feather="star"></i><span>${this.localization.t('hadith.addToFavorites')}</span>`;
        }
        
        // Re-initialize feather icons immediately
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Force apply star color after feather replace
        setTimeout(() => {
            const starIcon = favoritesBtn.querySelector('.star-icon');
            if (starIcon && isFavorited) {
                starIcon.style.color = 'var(--accent-gold)';
                starIcon.style.fill = 'var(--accent-gold)';
            }
        }, 50);
        
        // Force apply star color after feather replace
        setTimeout(() => {
            const starIcon = favoritesBtn.querySelector('.star-icon');
            if (starIcon && isFavorited) {
                starIcon.style.color = 'var(--accent-gold)';
                starIcon.style.fill = 'var(--accent-gold)';
            }
        }, 50);
    }

    showErrorState() {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('hadithCard').style.display = 'none';
        document.getElementById('errorState').style.display = 'block';
    }

    renderProgressSection() {
        const progressSection = document.getElementById('progressSection');
        progressSection.innerHTML = this.gamification.renderProgressCard();
        this.gamification.updateProgressDisplay();
    }

    setupEventListeners() {
        // Language selector
        const languageSelect = document.getElementById('languageSelect');
        languageSelect.value = this.settings.language;
        languageSelect.addEventListener('change', (e) => {
            this.settings.language = e.target.value;
            this.localization.setLanguage(this.settings.language);
            this.saveSettings();
            
            // Update favorites button text immediately when language changes
            this.updateFavoritesButton();
        });

        // Daily goal input
        const dailyGoalInput = document.getElementById('dailyGoalInput');
        dailyGoalInput.value = this.settings.dailyGoal;
        dailyGoalInput.addEventListener('change', async (e) => {
            const newGoal = parseInt(e.target.value);
            if (newGoal >= 1 && newGoal <= 20) {
                this.settings.dailyGoal = newGoal;
                this.gamification.userStats.dailyGoal = newGoal;
                await this.saveSettings();
                await this.gamification.saveUserStats();
                this.renderProgressSection();
            }
        });

        // Next Hadith button
        document.getElementById('nextHadithBtn').addEventListener('click', async () => {
            await this.nextHadith();
            // Record hadith read for gamification
            const result = await this.gamification.recordHadithRead();
            if (result.dailyGoalMet) {
                this.showDailyGoalCompletionCelebration();
            }
        });
        
        // Retry button
        document.getElementById('retryBtn').addEventListener('click', () => {
            location.reload();
        });
        
        // View on Sunnah button
        document.getElementById('viewOnSunnahBtn').addEventListener('click', () => {
            if (this.currentHadith) {
                // Always construct the URL with correct format using hadith number
                const hadithNum = this.currentHadith.hadithNumber || this.currentHadith.id;
                const url = `https://sunnah.com/riyadussalihin:${hadithNum}`;
                
                console.log('Opening URL:', url); // Debug log
                
                if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
                    chrome.tabs.create({ url: url });
                } else {
                    // Fallback to window.open for development
                    window.open(url, '_blank');
                }
            }
        });
        
        // Add to Favorites button
        document.getElementById('addToFavoritesBtn').addEventListener('click', async () => {
            await this.toggleFavorite();
        });

        // Collections button
        document.getElementById('collectionsBtn').addEventListener('click', () => {
            this.showCollectionsModal();
        });

        // View Favorites button
        document.getElementById('favoritesBtn').addEventListener('click', () => {
            this.showFavoritesModal();
        });

        // Search button
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.showSearchModal();
        });

        // Previous button
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousHadith();
        });

        // Next button (explicit handler)
        document.getElementById('nextBtn').addEventListener('click', async () => {
            await this.nextHadith();
            // Record hadith read for gamification
            const result = await this.gamification.recordHadithRead();
            if (result.dailyGoalMet) {
                this.showDailyGoalCompletionCelebration();
            }
            this.renderProgressSection();
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
            // Skip if user is typing in an input field or search is open
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || 
                document.getElementById('searchModal').style.display === 'block') {
                return;
            }
            
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextHadith();
                // Record hadith read for gamification when using keyboard
                this.gamification.recordHadithRead().then(result => {
                    if (result.dailyGoalMet) {
                        this.showDailyGoalCompletionCelebration();
                    }
                    this.renderProgressSection();
                });
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousHadith();
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
            } else if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
                e.preventDefault();
                this.showSearchModal();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.hideSearchModal();
            }
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addListener(() => {
            if (this.settings.theme === 'auto') {
                this.applyTheme();
            }
        });
        
        // Listen for language changes to update favorites button
        window.addEventListener('languageChanged', () => {
            this.updateFavoritesButton();
        });
    }

    async saveSettings() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ settings: this.settings });
            } else {
                localStorage.setItem('hadeeth-garden-settings', JSON.stringify(this.settings));
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    showDailyGoalCompletionCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'daily-goal-celebration';
        celebration.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🎉</div>
                <h3 data-i18n="progress.complete">${this.localization.t('progress.complete')}</h3>
                <p data-i18n="streak.congratulations">${this.localization.t('streak.congratulations')}</p>
            </div>
        `;
        
        // Add celebration styles
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: var(--card-bg);
            border: 3px solid var(--accent-gold);
            border-radius: var(--border-radius);
            padding: 2rem;
            text-align: center;
            box-shadow: 0 10px 40px rgba(255, 215, 0, 0.4);
            z-index: 1001;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(celebration);
        
        // Animate in
        setTimeout(() => {
            celebration.style.opacity = '1';
            celebration.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            celebration.style.opacity = '0';
            celebration.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                if (document.body.contains(celebration)) {
                    document.body.removeChild(celebration);
                }
            }, 300);
        }, 3000);
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
            
            // Update button immediately
            this.updateFavoritesButton();
            
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    }

    showFavoritesModal() {
        // Remove any existing modal
        const existingModal = document.querySelector('.favorites-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        if (this.favorites.length === 0) {
            this.showNotificationToast(this.localization.t('favorites.empty'), 'info');
            return;
        }

        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'favorites-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'favorites-modal-content';
        const isArabic = this.settings.language === 'ar';
        modalContent.style.cssText = `
            background: var(--surface-color);
            border-radius: 16px;
            max-width: 90vw;
            max-height: 80vh;
            width: 700px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            transform: scale(0.8);
            transition: transform 0.3s ease;
            direction: ${isArabic ? 'rtl' : 'ltr'};
        `;
        
        // Modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalHeader.style.cssText = `
            padding: 1.5rem 2rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--header-bg);
        `;
        modalHeader.innerHTML = `
            <h2 style="margin: 0; color: var(--text-primary); font-size: 1.5rem;">${this.localization.t('favorites.title')}</h2>
            <button class="close-modal-btn" style="
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 8px;
                border-radius: 6px;
                transition: all 0.2s ease;
            " aria-label="${this.localization.t('favorites.close')}">
                <i data-feather="x" style="width: 20px; height: 20px;"></i>
            </button>
        `;
        
        // Modal body
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.style.cssText = `
            padding: 1.5rem 2rem 2rem;
            max-height: 60vh;
            overflow-y: auto;
        `;
        
        // Favorites list
        const favoritesList = document.createElement('div');
        favoritesList.className = 'favorites-list';
        favoritesList.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 1rem;
        `;
        
        this.favorites.forEach(hadithId => {
            const hadith = this.hadithData.find(h => h.id === hadithId);
            if (!hadith) return;
            
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.style.cssText = `
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 1.5rem;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 1rem;
                transition: all 0.2s ease;
            `;
            
            // Get display text based on language and settings
            const isArabic = this.settings.language === 'ar';
            const showArabicText = this.settings.showArabic && hadith.arabicText;
            const showEnglishText = this.settings.showEnglish && hadith.englishText;
            
            let displayText = '';
            if (isArabic && showArabicText) {
                displayText = hadith.arabicText.substring(0, 150) + (hadith.arabicText.length > 150 ? '...' : '');
            } else if (showEnglishText) {
                displayText = hadith.englishText.substring(0, 150) + (hadith.englishText.length > 150 ? '...' : '');
            } else if (showArabicText) {
                displayText = hadith.arabicText.substring(0, 150) + (hadith.arabicText.length > 150 ? '...' : '');
            } else {
                displayText = hadith.englishText.substring(0, 150) + (hadith.englishText.length > 150 ? '...' : '');
            }
            
            const hadithNumberText = isArabic ? `${this.localization.t('hadith.number')} ${hadith.id}` : `Hadith ${hadith.id}`;
            const bookName = isArabic ? 'رياض الصالحين' : 'Riyāḍ al-Ṣāliḥīn';
            
            favoriteItem.innerHTML = `
                <div class="favorite-content" style="flex: 1; min-width: 0;">
                    <div class="favorite-hadith-info" style="
                        display: flex;
                        gap: 1rem;
                        margin-bottom: 0.75rem;
                        font-size: 0.875rem;
                        color: var(--text-secondary);
                        direction: ${isArabic ? 'rtl' : 'ltr'};
                    ">
                        <span class="hadith-number" style="
                            background: var(--primary-green);
                            color: white;
                            padding: 0.25rem 0.75rem;
                            border-radius: 20px;
                            font-weight: 500;
                        ">${hadithNumberText}</span>
                        <span class="hadith-book">${bookName}</span>
                    </div>
                    <div class="favorite-text" style="
                        color: var(--text-primary);
                        line-height: 1.6;
                        font-size: 0.95rem;
                        direction: ${isArabic && showArabicText ? 'rtl' : 'ltr'};
                        text-align: ${isArabic && showArabicText ? 'right' : 'left'};
                        font-family: ${isArabic && showArabicText ? 'Arabic Typesetting, Times New Roman, serif' : 'Inter, system-ui, sans-serif'};
                    ">
                        ${displayText}
                    </div>
                </div>
                <div class="favorite-actions" style="
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    flex-shrink: 0;
                ">
                    <button class="action-btn jump-to-btn" data-hadith-id="${hadith.id}" style="
                        background: var(--primary-green);
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.875rem;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        transition: all 0.2s ease;
                    " title="${this.localization.t('favorites.goto')}">
                        <i data-feather="external-link" style="width: 16px; height: 16px;"></i>
                        ${this.localization.t('favorites.goto')}
                    </button>
                    <button class="action-btn remove-favorite-btn" data-hadith-id="${hadith.id}" style="
                        background: #dc3545;
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.875rem;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        transition: all 0.2s ease;
                    " title="${this.localization.t('favorites.remove')}">
                        <i data-feather="trash-2" style="width: 16px; height: 16px;"></i>
                        ${this.localization.t('favorites.remove')}
                    </button>
                </div>
            `;
            
            favoritesList.appendChild(favoriteItem);
        });
        
        modalBody.appendChild(favoritesList);
        
        // Assemble modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Refresh feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Add event listeners
        const closeBtn = modalOverlay.querySelector('.close-modal-btn');
        closeBtn.addEventListener('click', () => {
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => modalOverlay.remove(), 300);
        });
        
        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.style.opacity = '0';
                modalContent.style.transform = 'scale(0.8)';
                setTimeout(() => modalOverlay.remove(), 300);
            }
        });
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modalOverlay.style.opacity = '0';
                modalContent.style.transform = 'scale(0.8)';
                setTimeout(() => modalOverlay.remove(), 300);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Jump to hadith buttons
        modalOverlay.querySelectorAll('.jump-to-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hadithId = parseInt(e.currentTarget.dataset.hadithId);
                this.goToHadith(hadithId);
                modalOverlay.style.opacity = '0';
                modalContent.style.transform = 'scale(0.8)';
                setTimeout(() => modalOverlay.remove(), 300);
            });
        });
        
        // Remove from favorites buttons
        modalOverlay.querySelectorAll('.remove-favorite-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const hadithId = parseInt(e.currentTarget.dataset.hadithId);
                await this.removeFromFavorites(hadithId);
                
                // Refresh modal
                modalOverlay.style.opacity = '0';
                modalContent.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    modalOverlay.remove();
                    this.showFavoritesModal();
                }, 300);
            });
        });
        
        // Animate modal in
        requestAnimationFrame(() => {
            modalOverlay.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        });
    }

    async removeFromFavorites(hadithId) {
        this.favorites = this.favorites.filter(id => id !== hadithId);
        await this.saveFavorites();
        this.updateFavoritesButton();
    }

    showNotificationToast(message, type = 'info') {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary-green)' : type === 'error' ? '#f44336' : 'var(--text-light)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // Refresh modal if open
        const existingModal = document.querySelector('.favorites-modal-overlay');
        if (existingModal) {
            existingModal.remove();
            this.showFavoritesModal();
        }
        
        // Update favorite button if current hadith
        if (this.currentHadith && this.currentHadith.id === hadithId) {
            this.updateFavoritesButton();
        }
    }

    async goToHadith(hadithId) {
        try {
            const hadithIndex = this.hadithData.findIndex(h => h.id === hadithId);
            if (hadithIndex !== -1) {
                this.currentHadith = this.hadithData[hadithIndex];
                this.currentIndex = hadithIndex;
                
                // Save the new index
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    await chrome.storage.local.set({ currentIndex: hadithIndex });
                } else {
                    localStorage.setItem('hadeeth-garden-currentIndex', hadithIndex.toString());
                }
                
                // Display the hadith
                this.displayHadith();
                
                // Close modal
                const modal = document.querySelector('.favorites-modal-overlay');
                if (modal) {
                    modal.style.opacity = '0';
                    setTimeout(() => modal.remove(), 300);
                }
                
                // Don't show notification to avoid error message
            }
        } catch (error) {
            console.error('Error going to hadith:', error);
            this.showNotificationToast('Error loading hadith', 'error');
        }
    }

    // Search functionality
    showSearchModal() {
        const modal = document.getElementById('searchModal');
        const searchInput = document.getElementById('searchInput');
        modal.style.display = 'block';
        searchInput.focus();
        
        // Set up search event listeners if not already done
        if (!searchInput.hasAttribute('data-listeners-added')) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
            
            // Search filters
            const filterInputs = document.querySelectorAll('input[name="searchLanguage"]');
            filterInputs.forEach(input => {
                input.addEventListener('change', () => {
                    this.performSearch(searchInput.value);
                });
            });
            
            // Modal close
            modal.querySelector('.modal-close').addEventListener('click', () => {
                this.hideSearchModal();
            });
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideSearchModal();
                }
            });
            
            searchInput.setAttribute('data-listeners-added', 'true');
        }
    }

    hideSearchModal() {
        const modal = document.getElementById('searchModal');
        modal.style.display = 'none';
        document.getElementById('searchInput').value = '';
        document.getElementById('searchResults').innerHTML = '';
    }

    performSearch(query) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (!query.trim()) {
            resultsContainer.innerHTML = '';
            return;
        }

        // Get selected language filter
        const selectedFilter = document.querySelector('input[name="searchLanguage"]:checked').value;
        
        // Search through hadith data
        const results = this.hadithData.filter((hadith, index) => {
            const arabicMatch = hadith.arabicText && hadith.arabicText.toLowerCase().includes(query.toLowerCase());
            const englishMatch = hadith.englishText && hadith.englishText.toLowerCase().includes(query.toLowerCase());
            
            switch (selectedFilter) {
                case 'arabic':
                    return arabicMatch;
                case 'english':
                    return englishMatch;
                default:
                    return arabicMatch || englishMatch;
            }
        });

        // Display results
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p data-i18n="search.noResults">No hadith found matching your search.</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = results.slice(0, 10).map((hadith, index) => {
                const actualIndex = this.hadithData.indexOf(hadith);
                return `
                    <div class="search-result" data-index="${actualIndex}">
                        <div class="search-result-meta">
                            <span class="search-result-book">${this.localization.getArabicChapterName(hadith.chapter || 'رياض الصالحين')}</span>
                            <span class="search-result-number">${this.localization.t('hadith.number')} ${this.localization.formatNumber(hadith.hadithNumber || hadith.id)}</span>
                        </div>
                        <div class="search-result-preview">
                            ${hadith.arabicText ? `<div class="arabic-preview" dir="rtl">${this.truncateText(hadith.arabicText, 100)}</div>` : ''}
                            ${hadith.englishText ? `<div class="english-preview">${this.truncateText(hadith.englishText, 150)}</div>` : ''}
                        </div>
                    </div>
                `;
            }).join('');

            // Add click handlers to search results
            resultsContainer.querySelectorAll('.search-result').forEach(result => {
                result.addEventListener('click', () => {
                    const index = parseInt(result.dataset.index);
                    this.goToHadithByIndex(index);
                    this.hideSearchModal();
                });
            });
        }
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    async goToHadithByIndex(index) {
        try {
            // Update current hadith and index
            this.currentHadith = this.hadithData[index];
            this.currentIndex = index;
            
            // Save new index
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ currentIndex: index });
            } else {
                localStorage.setItem('hadeeth-garden-currentIndex', index.toString());
            }
            
            // Display the hadith with animation
            this.displayHadith(true);
            
        } catch (error) {
            console.error('Error navigating to hadith:', error);
        }
    }

    showCollectionsModal() {
        // Remove any existing modal
        const existingModal = document.querySelector('.collections-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'collections-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'collections-modal-content';
        const isArabic = this.settings.language === 'ar';
        modalContent.style.cssText = `
            background: var(--surface-color);
            border-radius: 16px;
            max-width: 90vw;
            max-height: 80vh;
            width: 800px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            transform: scale(0.8);
            transition: transform 0.3s ease;
            direction: ${isArabic ? 'rtl' : 'ltr'};
        `;
        
        // Collections data
        const collections = [
            {
                id: 'riyadussalihin',
                nameKey: 'collections.riyadussalihin',
                status: 'available',
                description: isArabic ? 'مجموعة من أفضل الأحاديث في الأخلاق والآداب' : 'A collection of the finest hadith on ethics and manners',
                count: 1896,
                icon: '🌿'
            },
            {
                id: 'bukhari',
                nameKey: 'collections.bukhari',
                status: 'coming-soon',
                description: isArabic ? 'أصح كتاب بعد القرآن الكريم' : 'The most authentic book after the Quran',
                count: 7563,
                icon: '📖'
            },
            {
                id: 'muslim',
                nameKey: 'collections.muslim',
                status: 'coming-soon',
                description: isArabic ? 'ثاني أصح الكتب بعد البخاري' : 'Second most authentic after Bukhari',
                count: 7500,
                icon: '📗'
            },
            {
                id: 'tirmidhi',
                nameKey: 'collections.tirmidhi',
                status: 'coming-soon',
                description: isArabic ? 'مع شروحات فقهية مفيدة' : 'With useful jurisprudential explanations',
                count: 3956,
                icon: '📘'
            },
            {
                id: 'abudawud',
                nameKey: 'collections.abudawud',
                status: 'coming-soon',
                description: isArabic ? 'متخصص في الأحكام الفقهية' : 'Specialized in jurisprudential rulings',
                count: 4800,
                icon: '📙'
            },
            {
                id: 'nasai',
                nameKey: 'collections.nasai',
                status: 'coming-soon',
                description: isArabic ? 'من أدق كتب السنن' : 'One of the most precise Sunan books',
                count: 5270,
                icon: '📕'
            }
        ];
        
        // Modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalHeader.style.cssText = `
            padding: 1.5rem 2rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--header-bg);
        `;
        modalHeader.innerHTML = `
            <h2 style="margin: 0; color: var(--text-primary); font-size: 1.5rem;">${this.localization.t('collections.title')}</h2>
            <button class="close-modal-btn" style="
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 8px;
                border-radius: 6px;
                transition: all 0.2s ease;
            " aria-label="Close">
                <i data-feather="x" style="width: 20px; height: 20px;"></i>
            </button>
        `;
        
        // Modal body
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.style.cssText = `
            padding: 2rem;
            max-height: 60vh;
            overflow-y: auto;
        `;
        
        // Current collection section
        const currentSection = document.createElement('div');
        currentSection.style.cssText = `
            margin-bottom: 2rem;
        `;
        currentSection.innerHTML = `
            <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.1rem;">
                ${this.localization.t('collections.current')}
            </h3>
            <div style="
                background: var(--primary-green);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 1rem;
            ">
                <span style="font-size: 1.5rem;">🌿</span>
                <div>
                    <h4 style="margin: 0; font-size: 1rem;">${this.localization.t('collections.riyadussalihin')}</h4>
                    <p style="margin: 0; opacity: 0.9; font-size: 0.9rem;">
                        ${isArabic ? `${this.localization.formatNumber(1896)} حديث` : `${this.localization.formatNumber(1896)} hadith`}
                    </p>
                </div>
            </div>
        `;
        
        // Available collections section
        const availableSection = document.createElement('div');
        availableSection.innerHTML = `
            <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.1rem;">
                ${this.localization.t('collections.available')}
            </h3>
        `;
        
        // Collections grid
        const collectionsGrid = document.createElement('div');
        collectionsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
        `;
        
        collections.slice(1).forEach(collection => {
            const collectionCard = document.createElement('div');
            collectionCard.className = 'collection-card';
            collectionCard.style.cssText = `
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 1.5rem;
                transition: all 0.2s ease;
                cursor: ${collection.status === 'available' ? 'pointer' : 'not-allowed'};
                opacity: ${collection.status === 'available' ? '1' : '0.6'};
                position: relative;
            `;
            
            collectionCard.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                    <span style="font-size: 2rem; flex-shrink: 0;">${collection.icon}</span>
                    <div style="flex: 1; min-width: 0;">
                        <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary); font-size: 1rem;">
                            ${this.localization.t(collection.nameKey)}
                        </h4>
                        <p style="margin: 0 0 0.75rem 0; color: var(--text-secondary); font-size: 0.875rem; line-height: 1.4;">
                            ${collection.description}
                        </p>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span style="color: var(--text-secondary); font-size: 0.875rem;">
                                ${isArabic ? `${this.localization.formatNumber(collection.count)} حديث` : `${this.localization.formatNumber(collection.count)} hadith`}
                            </span>
                            <span style="
                                background: var(--orange-light);
                                color: var(--orange-dark);
                                padding: 0.25rem 0.75rem;
                                border-radius: 20px;
                                font-size: 0.75rem;
                                font-weight: 500;
                            ">
                                ${this.localization.t('collections.comingSoon')}
                            </span>
                        </div>
                    </div>
                </div>
            `;
            
            collectionsGrid.appendChild(collectionCard);
        });
        
        availableSection.appendChild(collectionsGrid);
        modalBody.appendChild(currentSection);
        modalBody.appendChild(availableSection);
        
        // Assemble modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Refresh feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Add event listeners
        const closeBtn = modalOverlay.querySelector('.close-modal-btn');
        closeBtn.addEventListener('click', () => {
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => modalOverlay.remove(), 300);
        });
        
        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.style.opacity = '0';
                modalContent.style.transform = 'scale(0.8)';
                setTimeout(() => modalOverlay.remove(), 300);
            }
        });
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modalOverlay.style.opacity = '0';
                modalContent.style.transform = 'scale(0.8)';
                setTimeout(() => modalOverlay.remove(), 300);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Animate in
        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    }


}

// Initialize the application when DOM is loaded
let hadeethGardenInstance;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        hadeethGardenInstance = new HadeethGardenTab();
        window.hadeethGarden = hadeethGardenInstance;
    });
} else {
    hadeethGardenInstance = new HadeethGardenTab();
    window.hadeethGarden = hadeethGardenInstance;
}
