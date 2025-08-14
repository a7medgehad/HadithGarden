// Hadith Garden - Background Service Worker
// Handles daily notifications and alarms

class HadeethNotificationManager {
    constructor() {
        this.init();
    }

    async init() {
        // Set up event listeners
        chrome.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === 'hadithDailyNotification') {
                this.showDailyNotification();
            }
        });

        // Handle notification clicks
        chrome.notifications.onClicked.addListener((notificationId) => {
            if (notificationId === 'hadithDaily') {
                // Open new tab when notification is clicked
                chrome.tabs.create({ url: chrome.runtime.getURL('newtab.html') });
                chrome.notifications.clear(notificationId);
            }
        });

        // Handle notification button clicks
        chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
            if (notificationId === 'hadithDaily') {
                if (buttonIndex === 0) {
                    // "Read Now" button clicked
                    chrome.tabs.create({ url: chrome.runtime.getURL('newtab.html') });
                } else if (buttonIndex === 1) {
                    // "Remind Later" button clicked - schedule another notification in 30 minutes
                    chrome.alarms.create('hadithDailyNotification', { 
                        delayInMinutes: 30 
                    });
                }
                chrome.notifications.clear(notificationId);
            }
        });

        // Initialize notification scheduling if enabled
        await this.initializeNotificationSchedule();

        // Set up message handling
        this.setupMessageHandling();
    }

    async initializeNotificationSchedule() {
        try {
            const result = await chrome.storage.local.get(['notificationSettings']);
            const settings = result.notificationSettings || {
                enabled: false,
                time: '09:00'
            };

            if (settings.enabled) {
                await this.scheduleNotification(settings.time);
            }
        } catch (error) {
            console.error('Failed to initialize notification schedule:', error);
        }
    }

    async scheduleNotification(timeString) {
        try {
            // Parse time (e.g., "09:00")
            const [hours, minutes] = timeString.split(':').map(Number);
            
            // Create date for today at specified time
            const now = new Date();
            const notificationTime = new Date(now);
            notificationTime.setHours(hours, minutes, 0, 0);
            
            // If the time has already passed today, schedule for tomorrow
            if (notificationTime <= now) {
                notificationTime.setDate(notificationTime.getDate() + 1);
            }

            // Clear existing alarm
            await chrome.alarms.clear('hadithDailyNotification');
            
            // Create new alarm
            await chrome.alarms.create('hadithDailyNotification', {
                when: notificationTime.getTime(),
                periodInMinutes: 24 * 60 // Repeat daily
            });

            console.log('Daily notification scheduled for:', notificationTime.toLocaleString());
        } catch (error) {
            console.error('Failed to schedule notification:', error);
        }
    }

    async showDailyNotification() {
        try {
            // Get localization settings
            const settingsResult = await chrome.storage.local.get(['settings']);
            const language = settingsResult.settings?.language || 'en';
            
            // Get current hadith info
            const hadithResult = await chrome.storage.local.get(['currentIndex']);
            const currentIndex = hadithResult.currentIndex || 0;
            
            // Load translations
            const translations = await this.getTranslations(language);
            
            // Create notification
            const notificationOptions = {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('icons/icon-128.png'),
                title: translations['notifications.daily_title'] || '🌿 Daily Hadith from Riyāḍ al-Ṣāliḥīn',
                message: translations['notifications.daily_message'] || 'Your daily hadith is ready for reading',
                buttons: [
                    {
                        title: translations['notifications.read_now'] || 'Read Now'
                    },
                    {
                        title: translations['notifications.remind_later'] || 'Remind Later'
                    }
                ],
                requireInteraction: true
            };

            await chrome.notifications.create('hadithDaily', notificationOptions);
        } catch (error) {
            console.error('Failed to show daily notification:', error);
        }
    }

    async getTranslations(language) {
        // Simplified translation function for background script
        const translations = {
            'en': {
                'notifications.daily_title': '🌿 Daily Hadith from Riyāḍ al-Ṣāliḥīn',
                'notifications.daily_message': 'Your daily hadith is ready for reading',
                'notifications.read_now': 'Read Now',
                'notifications.remind_later': 'Remind Later',
                'notifications.test_sent': 'Test notification sent!'
            },
            'ar': {
                'notifications.daily_title': '🌿 حديث اليوم من رياض الصالحين',
                'notifications.daily_message': 'حديث اليوم جاهز للقراءة',
                'notifications.read_now': 'اقرأ الآن',
                'notifications.remind_later': 'ذكّرني لاحقاً',
                'notifications.test_sent': 'تم إرسال تذكير تجريبي!'
            }
        };

        return translations[language] || translations['en'];
    }

    async testNotification() {
        try {
            // Check if the chrome.notifications API is available
            if (!chrome.notifications) {
                throw new Error('Chrome notifications API not available');
            }

            // Get language setting
            const settingsResult = await chrome.storage.local.get(['settings']);
            const language = settingsResult.settings?.language || 'en';
            const translations = await this.getTranslations(language);

            // Create test notification
            const notificationOptions = {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('icons/icon-128.png'),
                title: translations['notifications.daily_title'] || '🌿 Daily Hadith from Riyāḍ al-Ṣāliḥīn',
                message: translations['notifications.test_sent'] || 'Test notification sent!',
                buttons: [
                    {
                        title: translations['notifications.read_now'] || 'Read Now'
                    }
                ],
                requireInteraction: false
            };

            await chrome.notifications.create('hadithTest', notificationOptions);
            
            // Auto-clear test notification after 5 seconds
            setTimeout(() => {
                chrome.notifications.clear('hadithTest');
            }, 5000);

        } catch (error) {
            console.error('Failed to show test notification:', error);
            throw error;
        }
    }

    async updateNotificationSchedule(enabled, time) {
        try {
            // Save settings
            await chrome.storage.local.set({
                notificationSettings: { enabled, time }
            });

            if (enabled) {
                await this.scheduleNotification(time);
            } else {
                // Clear existing alarm
                await chrome.alarms.clear('hadithDailyNotification');
            }
        } catch (error) {
            console.error('Failed to update notification schedule:', error);
            throw error;
        }
    }

    setupMessageHandling() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'testNotification') {
                this.testNotification().then(() => {
                    sendResponse({ success: true });
                }).catch((error) => {
                    sendResponse({ success: false, error: error.message });
                });
                return true; // Indicates async response
            } else if (request.action === 'updateNotificationSchedule') {
                this.updateNotificationSchedule(request.enabled, request.time).then(() => {
                    sendResponse({ success: true });
                }).catch((error) => {
                    sendResponse({ success: false, error: error.message });
                });
                return true; // Indicates async response
            }
        });
    }
}

// Initialize the notification manager
const notificationManager = new HadeethNotificationManager();

// Expose functions for use by options page
self.notificationManager = notificationManager;
