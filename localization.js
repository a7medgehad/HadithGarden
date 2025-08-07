// Localization support for Hadeeth Garden Tab
class HadeethLocalization {
    constructor() {
        this.currentLanguage = 'en'; // Default to English
        this.translations = {
            'en': {
                // App Title
                'app.title': 'Hadith Garden Tab',
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
                'favorites.title': 'Your Favorite Hadith',
                'favorites.empty': 'You haven\'t saved any favorites yet.',
                'favorites.close': 'Close',
                'favorites.remove': 'Remove from Favorites'
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
                'hadith.number': 'الحديث',
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
                'favorites.title': 'أحاديثك المفضلة',
                'favorites.empty': 'لم تقم بحفظ أي أحاديث في المفضلة بعد.',
                'favorites.close': 'إغلاق',
                'favorites.remove': 'إزالة من المفضلة'
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
}

// Export for use in other modules
window.HadeethLocalization = HadeethLocalization;