/**
 * Sunnah.com API Integration for Hadith Garden Chrome Extension
 * Handles fetching hadith data from the official Sunnah.com API
 */

class SunnahAPI {
    constructor() {
        this.baseUrl = 'https://api.sunnah.com/v1';
        this.apiKey = null; // Will be set from environment or user input
        this.cache = new Map(); // Cache API responses for offline functionality
        this.fallbackData = null; // Fallback to local JSON if API fails
    }

    /**
     * Initialize the API with authentication
     */
    async init() {
        try {
            // Try to get API key from Chrome storage
            const result = await chrome.storage.local.get(['sunnahApiKey']);
            if (result.sunnahApiKey) {
                this.apiKey = result.sunnahApiKey;
                return true;
            }
            
            // If no API key, we'll use the local JSON as fallback
            console.log('No Sunnah.com API key found, using local fallback data');
            await this.loadFallbackData();
            return false;
        } catch (error) {
            console.error('Error initializing Sunnah API:', error);
            await this.loadFallbackData();
            return false;
        }
    }

    /**
     * Load local JSON data as fallback
     */
    async loadFallbackData() {
        try {
            const response = await fetch('data/riyadussalihin.json');
            this.fallbackData = await response.json();
            console.log(`Loaded ${this.fallbackData.length} hadith from local fallback`);
        } catch (error) {
            console.error('Error loading fallback data:', error);
        }
    }

    /**
     * Set API key for authentication
     */
    async setApiKey(apiKey) {
        this.apiKey = apiKey;
        await chrome.storage.local.set({ sunnahApiKey: apiKey });
    }

    /**
     * Make authenticated request to Sunnah.com API
     */
    async apiRequest(endpoint) {
        if (!this.apiKey) {
            throw new Error('API key not configured');
        }

        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Get all Riyad as-Salihin hadith from API
     */
    async getRiyadusSalihinHadith() {
        try {
            // Try API first if available
            if (this.apiKey) {
                const cacheKey = 'riyadus_salihin_complete';
                
                // Check cache first
                if (this.cache.has(cacheKey)) {
                    return this.cache.get(cacheKey);
                }

                // Try different API endpoints for Riyad as-Salihin
                const possibleEndpoints = [
                    '/collections/riyadussalihin/hadiths',
                    '/books/riyadussalihin/hadiths', 
                    '/collections/riyad-as-salihin/hadiths',
                    '/books/riyad-as-salihin/hadiths'
                ];

                for (const endpoint of possibleEndpoints) {
                    try {
                        const data = await this.apiRequest(endpoint);
                        if (data && data.length > 0) {
                            // Transform API data to our format
                            const transformedData = this.transformApiData(data);
                            this.cache.set(cacheKey, transformedData);
                            return transformedData;
                        }
                    } catch (error) {
                        console.log(`Endpoint ${endpoint} failed:`, error.message);
                        continue;
                    }
                }
            }

            // Fall back to local data
            if (this.fallbackData) {
                console.log('Using fallback data for Riyad as-Salihin');
                return this.fallbackData;
            }

            throw new Error('No data source available');

        } catch (error) {
            console.error('Error fetching Riyad as-Salihin hadith:', error);
            
            // Always fall back to local data
            if (this.fallbackData) {
                return this.fallbackData;
            }
            
            throw error;
        }
    }

    /**
     * Transform API response data to our extension format
     */
    transformApiData(apiData) {
        return apiData.map((hadith, index) => ({
            id: hadith.id || index + 1,
            book: "Riyad as-Salihin",
            chapter: hadith.chapter?.name || hadith.chapterName || "Unknown Chapter",
            chapterNumber: hadith.chapter?.number || hadith.chapterNumber || 0,
            hadithNumber: hadith.hadithNumber || hadith.number || index + 1,
            arabicText: hadith.arabic || hadith.arabicText || '',
            englishText: this.combineEnglishText(hadith.english || hadith.englishText),
            source: "sunnah.com",
            collection: "riyadussaliheen",
            reference: `Riyad as-Salihin ${hadith.hadithNumber || index + 1}`,
            url: `https://sunnah.com/riyadussalihin/${hadith.hadithNumber || index + 1}`
        }));
    }

    /**
     * Combine narrator and text for English translation
     */
    combineEnglishText(english) {
        if (typeof english === 'string') {
            return english;
        }
        
        if (typeof english === 'object' && english !== null) {
            const narrator = english.narrator || '';
            const text = english.text || '';
            return `${narrator} ${text}`.trim();
        }
        
        return '';
    }

    /**
     * Get specific hadith by ID
     */
    async getHadithById(id) {
        const allHadith = await this.getRiyadusSalihinHadith();
        return allHadith.find(hadith => hadith.id == id || hadith.hadithNumber == id);
    }

    /**
     * Search hadith by text
     */
    async searchHadith(query, language = 'both') {
        const allHadith = await this.getRiyadusSalihinHadith();
        const lowerQuery = query.toLowerCase();
        
        return allHadith.filter(hadith => {
            if (language === 'arabic' || language === 'both') {
                if (hadith.arabicText.toLowerCase().includes(lowerQuery)) {
                    return true;
                }
            }
            
            if (language === 'english' || language === 'both') {
                if (hadith.englishText.toLowerCase().includes(lowerQuery)) {
                    return true;
                }
            }
            
            return false;
        });
    }

    /**
     * Get hadith by chapter
     */
    async getHadithByChapter(chapterNumber) {
        const allHadith = await this.getRiyadusSalihinHadith();
        return allHadith.filter(hadith => hadith.chapterNumber === chapterNumber);
    }

    /**
     * Check if API is working
     */
    async testConnection() {
        if (!this.apiKey) {
            return { success: false, message: 'No API key configured' };
        }

        try {
            await this.apiRequest('/collections');
            return { success: true, message: 'API connection successful' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

// Export for use in extension
window.SunnahAPI = SunnahAPI;