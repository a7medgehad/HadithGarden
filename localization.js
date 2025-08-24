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
                'achievement.firstDay.desc': 'Read your first hadith',
                'achievement.firstWeek.desc': 'Maintain a 7-day reading streak',
                'achievement.firstMonth.desc': 'Maintain a 30-day reading streak',
                'achievement.hundred.desc': 'Read 100 hadith in total',
                
                // Settings/Options
                'options.title': 'Hadith Garden Settings',
                'options.subtitle': 'Customize your Islamic garden experience',
                'options.display': 'Display Settings',
                'options.showArabic': 'Show Arabic Text',
                'options.showEnglish': 'Show English Translation',
                'options.fontSize': 'Font Size',
                'options.theme': 'Theme Settings',
                'options.theme.light': 'Light',
                'options.theme.dark': 'Dark',
                'options.theme.auto': 'Auto',
                'options.language': 'Interface Language',
                'options.gamification': 'Gamification',
                'options.dailyGoal': 'Daily Reading Goal',
                'options.notifications': 'Notifications',
                'options.save': 'Save Settings',
                'options.export': 'Export Favorites',
                'options.import': 'Import Favorites',
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
                
                // New Options Page Keys
                'options.small': 'Small',
                'options.large': 'Large', 
                'options.themeLabel': 'Theme',
                'options.readingProgress': 'Reading Progress',
                'options.currentHadith': 'Current Hadith:',
                'options.totalHadiths': 'Total Hadiths:',
                'options.progress': 'Progress:',
                'options.loading': 'Loading...',
                'options.resetProgress': 'Reset to First Hadith',
                'options.favoritesManagement': 'Favorites Management',
                'options.favoritedHadiths': 'Favorited Hadiths:',
                'options.exportFavorites': 'Export Favorites',
                'options.importFavorites': 'Import Favorites',
                'options.clearFavorites': 'Clear All Favorites',
                'options.interfaceLanguage': 'Interface Language',
                'options.chooseLanguage': 'Choose Language / اختر اللغة',
                'options.languageEnglish': 'English',
                'options.languageArabic': 'Arabic',
                'options.saveSettings': 'Save Settings',
                'options.attribution': 'Hadith content from <a href="https://sunnah.com/riyadussalihin" target="_blank">sunnah.com</a> – used for personal educational purposes.',
                'options.version': 'Hadeeth Garden Tab v1.0.2',
                
                // Collection Options
                'options.hadithCollection': 'Hadith Collection',
                'options.chooseCollection': 'Choose Collection',
                'options.collection.riyadussaliheen': 'Riyāḍ al-Ṣāliḥīn',
                'options.collection.riyadussaliheenDesc': 'The Gardens of the Righteous by Imam al-Nawawi',
                'options.collection.sahih-bukhari': 'Sahih al-Bukhari',
                'options.collection.sahih-bukhariDesc': 'The most authentic hadith collection',
                'options.collection.default': 'Default',
                'options.collection.new': 'New',
                'options.collection.warning': '⚠️ Changing collections will reset your reading progress and favorites',
                
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
                
                // Collections
                'collections.title': 'Hadith Collections',
                'collections.riyadussalihin': 'Riyāḍ al-Ṣāliḥīn',
                'collections.bukhari': 'Sahih al-Bukhari',
                'collections.muslim': 'Sahih Muslim',
                'collections.tirmidhi': 'Jami\' at-Tirmidhi',
                'collections.abudawud': 'Sunan Abu Dawud',
                'collections.nasai': 'Sunan an-Nasa\'i',
                'collections.majah': 'Sunan Ibn Majah',
                'collections.current': 'Current Collection',
                'collections.available': 'Available Collections',
                'collections.comingSoon': 'Coming Soon',
                
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
                'notifications.test_sent': 'Test notification sent!',
                'notifications.description': 'Get reminded to read your daily hadith at your preferred time',
                
                // Error and Success Messages
                'messages.error.loadSettings': 'Failed to load settings. Please try again.',
                'messages.error.saveSettings': 'Failed to save settings. Please try again.',
                'messages.error.resetProgress': 'Failed to reset progress. Please try again.',
                'messages.error.exportFavorites': 'Failed to export favorites. Please try again.',
                'messages.error.importFavorites': 'Failed to import favorites. Please check the file format.',
                'messages.error.clearFavorites': 'Failed to clear favorites. Please try again.',
                'messages.error.languageRequired': 'At least one language must be enabled.',
                'messages.error.invalidFile': 'Invalid favorites file format',
                'messages.error.noValidFavorites': 'No valid favorites found in the imported file.',
                
                'messages.success.settingsSaved': 'Settings saved successfully!',
                'messages.success.progressReset': 'Reading progress reset to the first hadith.',
                'messages.success.favoritesExported': 'favorites exported successfully!',
                'messages.success.favoritesImported': 'favorites imported successfully!',
                'messages.success.favoritesCleared': 'All favorites cleared successfully.',
                
                'messages.info.noFavoritesToExport': 'No favorites to export.',
                'messages.info.noFavoritesToClear': 'No favorites to clear.',
                
                'messages.confirm.resetProgress': 'Are you sure you want to reset reading progress to the first hadith?',
                'messages.confirm.importFavorites': 'Import {count} favorites? This will replace your current favorites.',
                'messages.confirm.clearFavorites': 'Are you sure you want to clear all {count} favorites? This cannot be undone.'
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
                'achievement.firstDay.desc': 'قراءة أول حديث لك',
                'achievement.firstWeek.desc': 'المحافظة على القراءة لمدة 7 أيام متواصلة',
                'achievement.firstMonth.desc': 'المحافظة على القراءة لمدة 30 يوماً متواصلاً',
                'achievement.hundred.desc': 'قراءة 100 حديث إجمالاً',
                
                // Settings/Options Arabic
                'options.title': 'إعدادات حديقة الأحاديث',
                'options.subtitle': 'اضبط تجربة حديقتك الإسلامية',
                'options.display': 'إعدادات العرض',
                'options.showArabic': 'عرض النص العربي',
                'options.showEnglish': 'عرض الترجمة الإنجليزية',
                'options.fontSize': 'حجم الخط',
                'options.theme': 'إعدادات المظهر',
                'options.theme.light': 'فاتح',
                'options.theme.dark': 'داكن',
                'options.theme.auto': 'تلقائي',
                'options.language': 'لغة الواجهة',
                'options.gamification': 'التحفيز التفاعلي',
                'options.dailyGoal': 'هدف القراءة اليومي',
                'options.notifications': 'الإشعارات',
                'options.save': 'حفظ الإعدادات',
                'options.export': 'تصدير المفضلة',
                'options.import': 'استيراد المفضلة',
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
                
                // New Options Page Keys Arabic
                'options.small': 'صغير',
                'options.large': 'كبير',
                'options.themeLabel': 'المظهر',
                'options.readingProgress': 'تقدم القراءة',
                'options.currentHadith': 'الحديث الحالي:',
                'options.totalHadiths': 'إجمالي الأحاديث:',
                'options.progress': 'التقدم:',
                'options.loading': 'جاري التحميل...',
                'options.resetProgress': 'إعادة تعيين إلى أول حديث',
                'options.favoritesManagement': 'إدارة المفضلة',
                'options.favoritedHadiths': 'الأحاديث المفضلة:',
                'options.exportFavorites': 'تصدير المفضلة',
                'options.importFavorites': 'استيراد المفضلة',
                'options.clearFavorites': 'مسح جميع المفضلة',
                'options.interfaceLanguage': 'لغة الواجهة',
                'options.chooseLanguage': 'اختر اللغة / Choose Language',
                'options.languageEnglish': 'الإنجليزية',
                'options.languageArabic': 'العربية',
                'options.saveSettings': 'حفظ الإعدادات',
                'options.attribution': 'محتوى الأحاديث من <a href="https://sunnah.com/riyadussalihin" target="_blank">sunnah.com</a> – للاستخدام التعليمي الشخصي.',
                'options.version': 'تبويبة حديقة الأحاديث v1.0.2',
                
                // Collection Options Arabic
                'options.hadithCollection': 'مجموعة الأحاديث',
                'options.chooseCollection': 'اختر المجموعة',
                'options.collection.riyadussaliheen': 'رياض الصالحين',
                'options.collection.riyadussaliheenDesc': 'حدائق الصالحين للإمام النووي',
                'options.collection.sahih-bukhari': 'صحيح البخاري',
                'options.collection.sahih-bukhariDesc': 'أصح مجموعة أحاديث',
                'options.collection.default': 'افتراضي',
                'options.collection.new': 'جديد',
                'options.collection.warning': '⚠️ تغيير المجموعة سيعيد تعيين تقدم القراءة والمفضلة',
                
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
                
                // Collections Arabic
                'collections.title': 'مجموعات الأحاديث',
                'collections.riyadussalihin': 'رياض الصالحين',
                'collections.bukhari': 'صحيح البخاري',
                'collections.muslim': 'صحيح مسلم',
                'collections.tirmidhi': 'جامع الترمذي',
                'collections.abudawud': 'سنن أبي داود',
                'collections.nasai': 'سنن النسائي',
                'collections.majah': 'سنن ابن ماجه',
                'collections.current': 'المجموعة الحالية',
                'collections.available': 'المجموعات المتاحة',
                'collections.comingSoon': 'قريباً',
                
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
                'notifications.test_sent': 'تم إرسال تذكير تجريبي!',
                'notifications.description': 'احصل على تذكير لقراءة حديث اليوم في الوقت المفضل لديك',
                
                // Error and Success Messages Arabic
                'messages.error.loadSettings': 'فشل في تحميل الإعدادات. يرجى المحاولة مرة أخرى.',
                'messages.error.saveSettings': 'فشل في حفظ الإعدادات. يرجى المحاولة مرة أخرى.',
                'messages.error.resetProgress': 'فشل في إعادة تعيين التقدم. يرجى المحاولة مرة أخرى.',
                'messages.error.exportFavorites': 'فشل في تصدير المفضلة. يرجى المحاولة مرة أخرى.',
                'messages.error.importFavorites': 'فشل في استيراد المفضلة. يرجى التحقق من تنسيق الملف.',
                'messages.error.clearFavorites': 'فشل في مسح المفضلة. يرجى المحاولة مرة أخرى.',
                'messages.error.languageRequired': 'يجب تفعيل لغة واحدة على الأقل.',
                'messages.error.invalidFile': 'تنسيق ملف المفضلة غير صالح',
                'messages.error.noValidFavorites': 'لم يتم العثور على مفضلة صالحة في الملف المستورد.',
                
                'messages.success.settingsSaved': 'تم حفظ الإعدادات بنجاح!',
                'messages.success.progressReset': 'تم إعادة تعيين تقدم القراءة إلى أول حديث.',
                'messages.success.favoritesExported': 'تم تصدير المفضلة بنجاح!',
                'messages.success.favoritesImported': 'تم استيراد المفضلة بنجاح!',
                'messages.success.favoritesCleared': 'تم مسح جميع المفضلة بنجاح.',
                
                'messages.info.noFavoritesToExport': 'لا توجد مفضلة للتصدير.',
                'messages.info.noFavoritesToClear': 'لا توجد مفضلة للمسح.',
                
                'messages.confirm.resetProgress': 'هل أنت متأكد من إعادة تعيين تقدم القراءة إلى أول حديث؟',
                'messages.confirm.importFavorites': 'استيراد {count} مفضلة؟ سيؤدي هذا إلى استبدال مفضلتك الحالية.',
                'messages.confirm.clearFavorites': 'هل أنت متأكد من مسح جميع الـ {count} مفضلة؟ لا يمكن التراجع عن هذا الإجراء.'
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
    
    t(key, fallback = null, replacements = {}) {
        let translation = this.translations[this.currentLanguage]?.[key] || 
                         this.translations['en']?.[key] || 
                         fallback || 
                         key;
        
        // Handle placeholder replacements like {count}, {name}, etc.
        for (const [placeholder, value] of Object.entries(replacements)) {
            translation = translation.replace(`{${placeholder}}`, value);
        }
        
        return translation;
    }
    
    updateAllTranslations() {
        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
        
        // Update all elements with data-i18n-html attribute (for HTML content)
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            element.innerHTML = this.t(key);
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
            'The Book of Miscellany': 'كتاب المقدمات',
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