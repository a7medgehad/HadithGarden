// Gamification system for Hadeeth Garden Tab
class HadeethGamification {
    constructor(localization) {
        this.localization = localization;
        this.userStats = {
            totalHadithRead: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastReadDate: null,
            dailyGoal: 5,
            todaysProgress: 0,
            achievements: [],
            joinDate: null
        };
        this.achievements = [
            {
                id: 'first_day',
                title: 'achievement.firstDay',
                description: 'achievement.firstDay.desc',
                icon: '📖',
                requirement: 1,
                type: 'total'
            },
            {
                id: 'week_warrior',
                title: 'achievement.firstWeek',
                description: 'achievement.firstWeek.desc',
                icon: '📗',
                requirement: 7,
                type: 'streak'
            },
            {
                id: 'monthly_master',
                title: 'achievement.firstMonth',
                description: 'achievement.firstMonth.desc',
                icon: '📘',
                requirement: 30,
                type: 'streak'
            },
            {
                id: 'century_scholar',
                title: 'achievement.hundred',
                description: 'achievement.hundred.desc',
                icon: '📚',
                requirement: 100,
                type: 'total'
            }
        ];
    }
    
    async init() {
        await this.loadUserStats();
        await this.updateDailyProgress();
        this.checkAchievements();
    }
    
    async loadUserStats() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                const result = await chrome.storage.local.get(['userStats']);
                if (result.userStats) {
                    this.userStats = { ...this.userStats, ...result.userStats };
                }
            } else {
                const savedStats = localStorage.getItem('hadeeth-garden-stats');
                if (savedStats) {
                    this.userStats = { ...this.userStats, ...JSON.parse(savedStats) };
                }
            }
            
            // Initialize join date if not set
            if (!this.userStats.joinDate) {
                this.userStats.joinDate = new Date().toISOString();
                await this.saveUserStats();
            }
        } catch (error) {
            console.error('Failed to load user stats:', error);
        }
    }
    
    async saveUserStats() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ userStats: this.userStats });
            } else {
                localStorage.setItem('hadeeth-garden-stats', JSON.stringify(this.userStats));
            }
        } catch (error) {
            console.error('Failed to save user stats:', error);
        }
    }
    
    async updateDailyProgress() {
        const today = new Date().toDateString();
        const lastRead = this.userStats.lastReadDate ? new Date(this.userStats.lastReadDate).toDateString() : null;
        
        if (lastRead !== today) {
            // New day - reset daily progress
            this.userStats.todaysProgress = 0;
            
            // Update streak
            if (lastRead === new Date(Date.now() - 86400000).toDateString()) {
                // Yesterday - continue streak
                this.userStats.currentStreak++;
            } else if (lastRead !== null) {
                // Gap in reading - reset streak
                this.userStats.currentStreak = 0;
            }
            
            // Save the updated stats
            await this.saveUserStats();
        }
    }
    
    async recordHadithRead() {
        const today = new Date().toISOString();
        const todayString = new Date().toDateString();
        
        // Update daily progress
        if (!this.userStats.lastReadDate || new Date(this.userStats.lastReadDate).toDateString() !== todayString) {
            this.userStats.todaysProgress = 1;
            this.userStats.currentStreak = this.calculateNewStreak();
        } else {
            this.userStats.todaysProgress++;
        }
        
        // Update totals
        this.userStats.totalHadithRead++;
        this.userStats.lastReadDate = today;
        this.userStats.longestStreak = Math.max(this.userStats.longestStreak, this.userStats.currentStreak);
        
        // Save stats
        await this.saveUserStats();
        
        // Check for new achievements
        const newAchievements = this.checkAchievements();
        
        // Update UI
        this.updateProgressDisplay();
        
        // Show achievement notifications
        if (newAchievements.length > 0) {
            this.showAchievementNotifications(newAchievements);
        }
        
        return {
            streakUpdated: true,
            newAchievements,
            dailyGoalMet: this.userStats.todaysProgress >= this.userStats.dailyGoal
        };
    }
    
    calculateNewStreak() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const lastRead = this.userStats.lastReadDate ? new Date(this.userStats.lastReadDate).toDateString() : null;
        
        if (lastRead === yesterday) {
            return this.userStats.currentStreak + 1;
        } else if (lastRead === today) {
            return this.userStats.currentStreak;
        } else {
            return 1; // Start new streak
        }
    }
    
    checkAchievements() {
        const newAchievements = [];
        
        for (const achievement of this.achievements) {
            if (!this.userStats.achievements.includes(achievement.id)) {
                let unlocked = false;
                
                switch (achievement.type) {
                    case 'total':
                        unlocked = this.userStats.totalHadithRead >= achievement.requirement;
                        break;
                    case 'streak':
                        unlocked = this.userStats.currentStreak >= achievement.requirement;
                        break;
                }
                
                if (unlocked) {
                    this.userStats.achievements.push(achievement.id);
                    newAchievements.push(achievement);
                }
            }
        }
        
        return newAchievements;
    }
    
    updateProgressDisplay() {
        // Update streak display
        const streakElement = document.getElementById('streakCounter');
        if (streakElement) {
            streakElement.textContent = this.localization.formatNumber(this.userStats.currentStreak);
        }
        
        // Update daily progress
        const progressElement = document.getElementById('dailyProgress');
        if (progressElement) {
            const percentage = Math.min(100, (this.userStats.todaysProgress / this.userStats.dailyGoal) * 100);
            progressElement.style.width = `${percentage}%`;
        }
        
        const progressText = document.getElementById('progressText');
        if (progressText) {
            const current = this.localization.formatNumber(this.userStats.todaysProgress);
            const goal = this.localization.formatNumber(this.userStats.dailyGoal);
            
            // For Arabic, show goal/current (RTL style: 5/1 instead of 1/5)
            if (this.localization.currentLanguage === 'ar') {
                progressText.textContent = `${goal}/${current}`;
            } else {
                progressText.textContent = `${current}/${goal}`;
            }
        }
        
        // Update total hadith count
        const totalElement = document.getElementById('totalHadith');
        if (totalElement) {
            totalElement.textContent = this.localization.formatNumber(this.userStats.totalHadithRead);
        }
    }
    
    showAchievementNotifications(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.createAchievementNotification(achievement);
            }, index * 2000); // Stagger notifications
        });
    }
    
    createAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <h3 data-i18n="achievement.title">${this.localization.t('achievement.title')}</h3>
                <p class="achievement-name" data-i18n="${achievement.title}">${this.localization.t(achievement.title)}</p>
                <p class="achievement-desc" data-i18n="${achievement.description}">${this.localization.t(achievement.description)}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 4000);
    }
    
    renderProgressCard() {
        return `
            <div class="progress-card">
                <div class="progress-header">
                    <div class="logo-section">
                        <img src="icons/logo.svg" alt="Hadeeth Garden" class="app-logo">
                        <h2 class="app-name" data-i18n="app.title">${this.localization.t('app.title')}</h2>
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card streak-card">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-content">
                            <h3 data-i18n="streak.title">${this.localization.t('streak.title')}</h3>
                            <div class="stat-value">
                                <span id="streakCounter">${this.localization.formatNumber(this.userStats.currentStreak)}</span>
                                <span class="stat-unit" data-i18n="streak.days">${this.localization.t('streak.days')}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card progress-card-inner">
                        <div class="stat-icon">📖</div>
                        <div class="stat-content">
                            <h3 data-i18n="progress.title">${this.localization.t('progress.title')}</h3>
                            <div class="progress-bar">
                                <div id="dailyProgress" class="progress-fill"></div>
                            </div>
                            <div id="progressText" class="progress-text">
                                ${this.localization.formatNumber(this.userStats.todaysProgress)}/${this.localization.formatNumber(this.userStats.dailyGoal)}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="achievements-section">
                    <h3 data-i18n="ui.achievements">🏆 ${this.localization.t('ui.achievements', 'Achievements')}</h3>
                    <div class="achievements-grid">
                        ${this.renderAchievements()}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderAchievements() {
        return this.achievements.map(achievement => {
            const unlocked = this.userStats.achievements.includes(achievement.id);
            return `
                <div class="achievement ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-title" data-i18n="${achievement.title}">
                        ${this.localization.t(achievement.title)}
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Export for use in other modules
window.HadeethGamification = HadeethGamification;