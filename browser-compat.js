// Browser Compatibility Utility for Hadith Garden
// Ensures compatibility between Chrome and Edge browsers

/**
 * Browser compatibility wrapper for extension APIs
 * Both Chrome and Edge use the same underlying API, but this provides
 * a consistent interface and handles any future differences
 */
class BrowserCompat {
    constructor() {
        // Both Chrome and Edge use the 'chrome' global object
        this.api = (typeof chrome !== 'undefined') ? chrome : null;
        this.isExtensionContext = this.api && this.api.runtime && this.api.runtime.getURL;
    }

    /**
     * Get extension storage API
     */
    get storage() {
        return this.api?.storage || null;
    }

    /**
     * Get extension notifications API
     */
    get notifications() {
        return this.api?.notifications || null;
    }

    /**
     * Get extension alarms API
     */
    get alarms() {
        return this.api?.alarms || null;
    }

    /**
     * Get extension runtime API
     */
    get runtime() {
        return this.api?.runtime || null;
    }

    /**
     * Get extension tabs API
     */
    get tabs() {
        return this.api?.tabs || null;
    }

    /**
     * Get a resource URL for both Chrome and Edge
     * @param {string} path - The resource path
     * @returns {string} - The full extension URL
     */
    getResourceURL(path) {
        if (this.runtime && this.runtime.getURL) {
            return this.runtime.getURL(path);
        }
        // Fallback for development/testing
        return path;
    }

    /**
     * Check if extension APIs are available
     * @returns {boolean}
     */
    isAvailable() {
        return this.api !== null && this.isExtensionContext;
    }

    /**
     * Get the browser name
     * @returns {string} - 'chrome', 'edge', or 'unknown'
     */
    getBrowserName() {
        if (typeof navigator === 'undefined') return 'unknown';
        
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('edg/')) {
            return 'edge';
        } else if (userAgent.includes('chrome')) {
            return 'chrome';
        }
        return 'unknown';
    }

    /**
     * Storage helper methods with fallback to localStorage
     */
    async getStorageItem(key) {
        if (this.storage && this.storage.local) {
            const result = await this.storage.local.get([key]);
            return result[key];
        } else {
            // Fallback to localStorage for development
            const item = localStorage.getItem(`hadith-garden-${key}`);
            return item ? JSON.parse(item) : undefined;
        }
    }

    async setStorageItem(key, value) {
        if (this.storage && this.storage.local) {
            await this.storage.local.set({ [key]: value });
        } else {
            // Fallback to localStorage for development
            localStorage.setItem(`hadith-garden-${key}`, JSON.stringify(value));
        }
    }

    /**
     * Fetch a resource with proper URL handling
     * @param {string} path - The resource path
     * @returns {Promise<Response>}
     */
    async fetchResource(path) {
        try {
            // Try extension URL first
            return await fetch(this.getResourceURL(path));
        } catch (extensionError) {
            // Fallback for development/testing
            return await fetch(path);
        }
    }
}

// Create a global instance for use throughout the extension
const browserCompat = new BrowserCompat();

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrowserCompat;
}
