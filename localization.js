// Localization support for Hadeeth Garden Tab
class HadeethLocalization {
    constructor() {
        this.currentLanguage = 'en'; // Default to English
        this.translations = {
            'en': {
                // App Title
                'app.title': 'Hadith Garden',
                'app.subtitle': 'Daily Hadith from the Garden of the Righteous',
                
                // Loading and Error States
                'loading.text': 'Loading hadith...',
                'error.title': 'Unable to load hadith',
                'error.description': 'Please check your extension installation and try again.',
                'error.retry': 'Retry',
                
                // Hadith Display
                'hadith.book': 'Book',
                'hadith.number': 'Hadith',
                'hadith.viewOnSunnah': 'View on sunnah.com',
                'hadith.addToFavorites': 'Add to Favorites',
                'hadith.removeFromFavorites': 'Remove from Favorites',
                'hadith.settings': 'Settings',
                'hadith.nextHadith': 'Next Hadith',
                
                // Gamification
                'streak.title': 'Reading Streak',
                'streak.days': 'Days',
                'streak.today': 'Today',
                'streak.congratulations': 'Great job! Keep your streak going!',
                'progress.title': 'Daily Progress',
                'progress.complete': 'Daily Goal Complete!',
                'progress.read': 'Hadith Read Today',
                'progress.goal': 'Daily Goal',
                'achievement.title': 'Achievement Unlocked!',
                'achievement.firstDay': 'First Steps',
                'achievement.firstWeek': 'Week Warrior',
                'achievement.firstMonth': 'Monthly Master',
                'achievement.hundred': 'Century Scholar',
                
                // Settings
                'settings.title': 'Settings',
                'settings.display': 'Display Options',
                'settings.showArabic': 'Show Arabic Text',
                'settings.showEnglish': 'Show English Text',
                'settings.fontSize': 'Font Size',
                'settings.theme': 'Theme',
                'settings.theme.light': 'Light',
                'settings.theme.dark': 'Dark',
                'settings.theme.auto': 'Auto',
                'settings.language': 'Interface Language',
                'settings.gamification': 'Gamification',
                'settings.dailyGoal': 'Daily Reading Goal',
                'settings.notifications': 'Reminders',
                'settings.save': 'Save Settings',
                'settings.export': 'Export Favorites',
                'settings.import': 'Import Favorites',
                
                // Additional UI elements
                'ui.achievements': 'Achievements',
                'ui.daily_goal': 'Daily Goal',
                'ui.hadith_goal': 'hadith',
                
                // Favorites
                'favorites.view': 'View Favorites',
                'favorites.title': 'My Favorite Hadith',
                'favorites.empty': 'You haven\'t saved any favorites yet.',
                'favorites.close': 'Close',
                'favorites.remove': 'Remove',
                'favorites.goto': 'Go to',
                
                // Buttons
                'button.next': 'Next',
                'button.previous': 'Previous',
                
                // Search
                'search.title': 'Search Hadith',
                'search.placeholder': 'Search in Arabic or English text...',
                'search.all': 'All Languages',
                'search.arabic': 'Arabic Only',
                'search.english': 'English Only',
                'search.noResults': 'No hadith found matching your search.',
                
                // Notifications
                'notifications.enable': 'Enable Daily Notifications',
                'notifications.time': 'Notification Time',
                'notifications.test': 'Test Notification',
                'notifications.daily_title': '🌿 Daily Hadith from Riyāḍ al-Ṣāliḥīn',
                'notifications.daily_message': 'Your daily hadith is ready for reading',
                'notifications.read_now': 'Read Now',
                'notifications.remind_later': 'Remind Later',
                'notifications.streak_bonus': '🔥 Keep your reading streak alive!',
                'notifications.permission_needed': 'Please enable notifications in your browser settings',
                'notifications.test_sent': 'Test notification sent!'
            },
            'ar': {
                // App Title
                'app.title': 'حديقة الأحاديث',
                'app.subtitle': 'أحاديث يومية من رياض الصالحين',
                
                // Loading and Error States
                'loading.text': 'جاري تحميل الحديث...',
                'error.title': 'لا يمكن تحميل الحديث',
                'error.description': 'يرجى التحقق من تثبيت الامتداد والمحاولة مرة أخرى.',
                'error.retry': 'إعادة المحاولة',
                
                // Hadith Display
                'hadith.book': 'الكتاب',
                'hadith.number': 'الحديث رقم',
                'hadith.viewOnSunnah': 'عرض على موقع السنة',
                'hadith.addToFavorites': 'إضافة إلى المفضلة',
                'hadith.removeFromFavorites': 'إزالة من المفضلة',
                'hadith.settings': 'الإعدادات',
                'hadith.nextHadith': 'الحديث التالي',
                
                // Gamification
                'streak.title': 'أيام القراءة المتواصلة',
                'streak.days': 'أيام',
                'streak.today': 'اليوم',
                'streak.congratulations': 'أحسنت! استمر في سلسلة القراءة!',
                'progress.title': 'التقدم اليومي',
                'progress.complete': 'تم إنجاز الهدف اليومي!',
                'progress.read': 'أحاديث قُرئت اليوم',
                'progress.goal': 'الهدف اليومي',
                'achievement.title': 'تم فتح إنجاز!',
                'achievement.firstDay': 'بداية مباركة',
                'achievement.firstWeek': 'مواظب الأسبوع',
                'achievement.firstMonth': 'نجم الشهر',
                'achievement.hundred': 'طالب علم مجتهد',
                
                // Settings
                'settings.title': 'الإعدادات',
                'settings.display': 'خيارات العرض',
                'settings.showArabic': 'عرض النص العربي',
                'settings.showEnglish': 'عرض النص الإنجليزي',
                'settings.fontSize': 'حجم الخط',
                'settings.theme': 'المظهر',
                'settings.theme.light': 'فاتح',
                'settings.theme.dark': 'داكن',
                'settings.theme.auto': 'تلقائي',
                'settings.language': 'لغة الواجهة',
                'settings.gamification': 'التحفيز التفاعلي',
                'settings.dailyGoal': 'هدف القراءة اليومي',
                'settings.notifications': 'التذكيرات',
                'settings.save': 'حفظ الإعدادات',
                'settings.export': 'تصدير المفضلة',
                'settings.import': 'استيراد المفضلة',
                
                // Additional UI elements
                'ui.achievements': 'الإنجازات',
                'ui.daily_goal': 'الهدف اليومي',
                'ui.hadith_goal': 'أحاديث',
                
                // Favorites
                'favorites.view': 'عرض المفضلة',
                'favorites.title': 'أحاديثي المفضلة',
                'favorites.empty': 'لم تقم بحفظ أي أحاديث في المفضلة بعد.',
                'favorites.close': 'إغلاق',
                'favorites.remove': 'إزالة',
                'favorites.goto': 'الانتقال إلى',
                
                // Buttons Arabic
                'button.next': 'التالي',
                'button.previous': 'السابق',
                
                // Search Arabic
                'search.title': 'البحث في الأحاديث',
                'search.placeholder': 'ابحث في النص العربي أو الإنجليزي...',
                'search.all': 'جميع اللغات',
                'search.arabic': 'العربية فقط',
                'search.english': 'الإنجليزية فقط',
                'search.noResults': 'لم يتم العثور على أحاديث تطابق البحث.',
                
                // Notifications
                'notifications.enable': 'تفعيل التذكيرات اليومية',
                'notifications.time': 'وقت التذكير',
                'notifications.test': 'اختبار التذكير',
                'notifications.daily_title': '🌿 حديث اليوم من رياض الصالحين',
                'notifications.daily_message': 'حديث اليوم جاهز للقراءة',
                'notifications.read_now': 'اقرأ الآن',
                'notifications.remind_later': 'ذكّرني لاحقاً',
                'notifications.streak_bonus': '🔥 حافظ على سلسلة القراءة!',
                'notifications.permission_needed': 'يرجى تفعيل الإشعارات في إعدادات المتصفح',
                'notifications.test_sent': 'تم إرسال تذكير تجريبي!'
            }
        };
    }
    
    setLanguage(language) {
        this.currentLanguage = language;
        this.updateDocumentDirection();
        this.updateAllTranslations();
    }
    
    updateDocumentDirection() {
        const isRTL = this.currentLanguage === 'ar';
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLanguage;
    }
    
    t(key, fallback = null) {
        const translation = this.translations[this.currentLanguage]?.[key] || 
                           this.translations['en']?.[key] || 
                           fallback || 
                           key;
        return translation;
    }
    
    updateAllTranslations() {
        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
        
        // Update placeholders
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // Update titles
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
        
        // Trigger custom event for language change
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: this.currentLanguage }
        }));
    }
    
    formatNumber(number) {
        // Always use Western Arabic numerals (1,2,3) even for Arabic interface
        return number.toString();
    }
    
    formatDate(date) {
        if (this.currentLanguage === 'ar') {
            return new Intl.DateTimeFormat('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        }
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    // Arabic chapter name mappings for authentic display
    getArabicChapterName(englishChapter) {
        const chapterMap = {
            'The Book of Good Manners': 'كتاب الأدب',
            'The Book About the Etiquette of Eating': 'كتاب آداب الطعام',
            'The Book of Dress': 'كتاب اللباس',
            'The Book of Du\'a (Supplications)': 'كتاب الدعوات',
            'The Book of Etiquette of Traveling': 'كتاب آداب السفر',
            'The Book of Forgiveness': 'كتاب الاستغفار',
            'The Book of Greetings': 'كتاب السلام',
            'The Book of Hajj': 'كتاب الحج',
            'The Book of I\'tikaf': 'كتاب الاعتكاف',
            'The Book of Jihad': 'كتاب الجهاد',
            'The Book of Knowledge': 'كتاب العلم',
            'The Book of Miscellaneous ahadith of Significant Values': 'كتاب المنثورات والملح',
            'The Book of Miscellany': 'كتاب المنثورات والملح',
            'The Book of Praise and Gratitude to Allah': 'كتاب الحمد والشكر لله تعالى',
            'The Book of Supplicating Allah to Exalt the Mention of Allah\'s Messenger': 'كتاب الصلاة على رسول الله صلى الله عليه وسلم',
            'The Book of the Etiquette of Sleeping, Lying and Sitting etc': 'كتاب آداب النوم والاضطجاع والجلوس',
            'The Book of the Prohibited actions': 'كتاب المنهيات',
            'The Book of the Remembrance of Allah': 'كتاب الأذكار',
            'The Book of Virtues': 'كتاب الفضائل',
            'The Book of Visiting the Sick': 'كتاب عيادة المريض واتباع الجنائز'
        };
        
        return chapterMap[englishChapter] || englishChapter;
    }
}

// Export for use in other modules
window.HadeethLocalization = HadeethLocalization;