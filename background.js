// Background service worker for daily hadith notifications
class NotificationService {
    constructor() {
        this.setupAlarmListeners();
        this.setupNotificationListeners();
        this.initializeNotifications();
    }

    setupAlarmListeners() {
        // Listen for alarm triggers
        chrome.alarms.onAlarm.addListener(async (alarm) => {
            if (alarm.name === 'dailyHadithNotification') {
                await this.showDailyHadithNotification();
            }
        });
    }

    setupNotificationListeners() {
        // Handle notification clicks
        chrome.notifications.onClicked.addListener((notificationId) => {
            if (notificationId.startsWith('hadith-')) {
                // Open new tab with the extension
                chrome.tabs.create({ url: 'chrome://newtab/' });
                // Clear the notification
                chrome.notifications.clear(notificationId);
            }
        });

        // Handle notification button clicks
        chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
            if (notificationId.startsWith('hadith-')) {
                if (buttonIndex === 0) {
                    // "Read Now" button clicked
                    chrome.tabs.create({ url: 'chrome://newtab/' });
                } else if (buttonIndex === 1) {
                    // "Remind Later" button clicked
                    await this.scheduleReminderNotification();
                }
                chrome.notifications.clear(notificationId);
            }
        });
    }

    async initializeNotifications() {
        try {
            const { settings = {} } = await chrome.storage.local.get('settings');
            
            if (settings.notificationsEnabled !== false && settings.notificationTime) {
                await this.scheduleNotification(settings.notificationTime);
            }
        } catch (error) {
            console.error('Failed to initialize notifications:', error);
        }
    }

    async scheduleNotification(time) {
        try {
            // Clear existing alarm
            await chrome.alarms.clear('dailyHadithNotification');

            // Parse time (format: "HH:MM")
            const [hours, minutes] = time.split(':').map(Number);
            
            // Calculate next notification time
            const now = new Date();
            const scheduledTime = new Date();
            scheduledTime.setHours(hours, minutes, 0, 0);

            // If the time has already passed today, schedule for tomorrow
            if (scheduledTime <= now) {
                scheduledTime.setDate(scheduledTime.getDate() + 1);
            }

            // Create recurring daily alarm
            await chrome.alarms.create('dailyHadithNotification', {
                when: scheduledTime.getTime(),
                periodInMinutes: 24 * 60 // 24 hours
            });

            console.log('Daily hadith notification scheduled for:', scheduledTime);
        } catch (error) {
            console.error('Failed to schedule notification:', error);
        }
    }

    async showDailyHadithNotification() {
        try {
            // Get current hadith data and settings
            const result = await chrome.storage.local.get(['currentHadithIndex', 'settings']);
            const { currentHadithIndex = 0, settings = {} } = result;

            // Load hadith data
            const hadithData = await this.loadHadithData();
            if (!hadithData || hadithData.length === 0) return;

            const currentHadith = hadithData[currentHadithIndex];
            if (!currentHadith) return;

            // Get localization
            const localization = new LocalizationService(settings.language || 'en');

            // Create notification content
            const title = localization.t('notifications.daily_title');
            let message = '';
            
            if (settings.showArabic && currentHadith.arabic) {
                message = currentHadith.arabic.substring(0, 100) + '...';
            } else if (settings.showEnglish && currentHadith.english) {
                message = currentHadith.english.substring(0, 100) + '...';
            } else {
                message = localization.t('notifications.daily_message');
            }

            // Create the notification
            const notificationId = `hadith-${Date.now()}`;
            await chrome.notifications.create(notificationId, {
                type: 'basic',
                iconUrl: 'icons/icon-128.svg',
                title: title,
                message: message,
                buttons: [
                    { title: localization.t('notifications.read_now') },
                    { title: localization.t('notifications.remind_later') }
                ],
                requireInteraction: false,
                priority: 1
            });

            console.log('Daily hadith notification shown');
        } catch (error) {
            console.error('Failed to show notification:', error);
        }
    }

    async scheduleReminderNotification() {
        try {
            // Schedule a reminder in 1 hour
            const reminderTime = Date.now() + (60 * 60 * 1000); // 1 hour from now
            
            await chrome.alarms.create('reminderNotification', {
                when: reminderTime
            });
        } catch (error) {
            console.error('Failed to schedule reminder:', error);
        }
    }

    async loadHadithData() {
        try {
            const response = await fetch(chrome.runtime.getURL('data/riyadussalihin.json'));
            return await response.json();
        } catch (error) {
            console.error('Failed to load hadith data:', error);
            return null;
        }
    }

    async clearNotifications() {
        try {
            await chrome.alarms.clear('dailyHadithNotification');
            await chrome.alarms.clear('reminderNotification');
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    }
}

// Simple localization for background context
class LocalizationService {
    constructor(language = 'en') {
        this.language = language;
        this.translations = {
            'en': {
                'notifications.daily_title': '🌿 Daily Hadith from Riyāḍ al-Ṣāliḥīn',
                'notifications.daily_message': 'Your daily hadith is ready for reading',
                'notifications.read_now': 'Read Now',
                'notifications.remind_later': 'Remind Later',
                'notifications.streak_bonus': '🔥 Keep your reading streak alive!'
            },
            'ar': {
                'notifications.daily_title': '🌿 حديث اليوم من رياض الصالحين',
                'notifications.daily_message': 'حديث اليوم جاهز للقراءة',
                'notifications.read_now': 'اقرأ الآن',
                'notifications.remind_later': 'ذكّرني لاحقاً',
                'notifications.streak_bonus': '🔥 حافظ على سلسلة القراءة!'
            }
        };
    }

    t(key) {
        return this.translations[this.language]?.[key] || this.translations['en'][key] || key;
    }
}

// Initialize the notification service
const notificationService = new NotificationService();

// Handle messages from options page
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    try {
        switch (message.action) {
            case 'scheduleNotification':
                await notificationService.scheduleNotification(message.time);
                sendResponse({ success: true });
                break;
            case 'clearNotifications':
                await notificationService.clearNotifications();
                sendResponse({ success: true });
                break;
            default:
                sendResponse({ success: false, error: 'Unknown action' });
        }
    } catch (error) {
        console.error('Error handling message:', error);
        sendResponse({ success: false, error: error.message });
    }
    return true; // Keep message channel open for async response
});

// Handle extension installation/update
chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
        // Set default notification settings
        const { settings = {} } = await chrome.storage.local.get('settings');
        if (!settings.notificationTime) {
            settings.notificationsEnabled = true;
            settings.notificationTime = '09:00'; // Default to 9 AM
            await chrome.storage.local.set({ settings });
        }
    }
});