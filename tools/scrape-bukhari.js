#!/usr/bin/env node

/**
 * Sahih al-Bukhari Scraper for HadithGarden Extension
 * 
 * This script fetches all hadith from Sahih al-Bukhari using the hadith.gading.dev API
 * and formats them according to the HadithGarden JSON schema.
 * 
 * Usage: node tools/scrape-bukhari.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class BukhariScraper {
    constructor() {
        this.baseUrl = 'https://api.hadith.gading.dev';
        this.collection = 'sahih-bukhari';
        this.hadithList = [];
        this.delay = 200; // 200ms between requests to be respectful to API
        this.batchSize = 100; // Request 100 hadith at a time for efficiency
    }

    // Helper to make HTTP requests
    makeRequest(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(new Error(`Failed to parse JSON: ${error.message}`));
                    }
                });
                res.on('error', reject);
            }).on('error', reject);
        });
    }

    // Clean text (remove extra whitespace, clean up formatting)
    cleanText(text) {
        if (!text) return '';
        return text
            .replace(/\s+/g, ' ')
            .replace(/"+/g, '"')
            .trim();
    }

    // Extract chapter name from Indonesian text (convert to English where possible)
    getChapterFromIndonesian(indonesianText) {
        // This is a simple mapping - could be enhanced with a more comprehensive dictionary
        const chapterMappings = {
            'wahyu': 'Revelation',
            'iman': 'Belief', 
            'ilmu': 'Knowledge',
            'wudhu': 'Ablutions (Wudu\')',
            'mandi': 'Bathing (Ghusl)',
            'haid': 'Menstrual Periods',
            'tayamum': 'Rubbing Hands and Feet with Dust (Tayammum)',
            'shalat': 'Prayer (Salat)',
            'jenazah': 'Funerals (Al-Jana\'iz)',
            'zakat': 'Zakat (Obligatory Charity)',
            'haji': 'Pilgrimage (Hajj)',
            'jual beli': 'Sales and Trade',
            'nikah': 'Marriage (Wedlock)',
            'cerai': 'Divorce',
            'jihad': 'Fighting for the Cause of Allah (Jihaad)',
            'makanan': 'Food, Meals',
            'minuman': 'Drinks',
            'medis': 'Medicine',
            'pakaian': 'Dress',
            'adab': 'Good Manners and Form (Al-Adab)',
            'doa': 'Invocations',
            'tafsir': 'Commentary on the Qur\'an (Tafseer)',
            'tauhid': 'Divine Will (Al-Qadar)'
        };
        
        const lowerText = indonesianText.toLowerCase();
        for (const [indo, eng] of Object.entries(chapterMappings)) {
            if (lowerText.includes(indo)) {
                return eng;
            }
        }
        
        // If no mapping found, return a cleaned version of the Indonesian text
        return indonesianText.replace(/^(Telah|telah|menceritakan|mengabarkan|kepada|kami|dari|berkata|bahwa)\s+/g, '')
                            .replace(/\[.*?\]/g, '')
                            .trim() || 'Unknown Chapter';
    }

    // Get chapter number (simplified - could be enhanced)
    getChapterNumber(chapterName) {
        const chapterMap = {
            'Revelation': 1,
            'Belief': 2,
            'Knowledge': 3,
            'Ablutions (Wudu\')': 4,
            'Bathing (Ghusl)': 5,
            'Menstrual Periods': 6,
            'Rubbing Hands and Feet with Dust (Tayammum)': 7,
            'Prayer (Salat)': 8,
            'Funerals (Al-Jana\'iz)': 23,
            'Zakat (Obligatory Charity)': 24,
            'Pilgrimage (Hajj)': 25,
            'Sales and Trade': 34
        };
        return chapterMap[chapterName] || 0;
    }

    // Convert API response to HadithGarden format
    convertHadithFormat(apiHadith, index) {
        const arabicText = this.cleanText(apiHadith.arab);
        
        // Extract English text from the Indonesian translation (it usually contains English)
        // This is a fallback - ideally we'd have direct English translations
        let englishText = this.cleanText(apiHadith.id);
        
        // Try to extract quoted English text from Indonesian translation
        const englishQuoteMatch = englishText.match(/"([^"]+)"/g);
        if (englishQuoteMatch && englishQuoteMatch.length > 0) {
            englishText = englishQuoteMatch.join(' ').replace(/"/g, '');
        }
        
        // Determine chapter from context (this is approximate)
        const chapter = this.getChapterFromIndonesian(englishText);
        
        return {
            id: index + 1,
            book: 'Sahih al-Bukhari',
            chapter: chapter,
            chapterNumber: this.getChapterNumber(chapter),
            hadithNumber: apiHadith.number,
            arabicText: arabicText,
            englishText: englishText,
            source: 'api.hadith.gading.dev',
            collection: 'sahih-bukhari',
            reference: `Sahih al-Bukhari ${apiHadith.number}`,
            url: `https://sunnah.com/bukhari:${apiHadith.number}`
        };
    }

    // Sleep function for rate limiting
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Main scraping function
    async scrapeAll() {
        console.log('Starting Sahih al-Bukhari data fetch from API...');
        console.log('This API-based approach will be much faster than HTML scraping.');
        
        try {
            // First, get info about the collection
            console.log('Getting collection information...');
            const infoUrl = `${this.baseUrl}/books/bukhari?range=1-1`;
            const infoResponse = await this.makeRequest(infoUrl);
            
            if (!infoResponse.data) {
                throw new Error('Failed to get collection information');
            }
            
            const totalHadith = infoResponse.data.available;
            console.log(`Found ${totalHadith} hadith in Sahih al-Bukhari collection`);
            
            // Fetch all hadith in batches
            let currentStart = 1;
            let hadithIndex = 0;
            
            while (currentStart <= totalHadith) {
                const currentEnd = Math.min(currentStart + this.batchSize - 1, totalHadith);
                const batchUrl = `${this.baseUrl}/books/bukhari?range=${currentStart}-${currentEnd}`;
                
                console.log(`Fetching hadith ${currentStart}-${currentEnd}...`);
                
                try {
                    const response = await this.makeRequest(batchUrl);
                    
                    if (response.data && response.data.hadiths && Array.isArray(response.data.hadiths)) {
                        for (const apiHadith of response.data.hadiths) {
                            const convertedHadith = this.convertHadithFormat(apiHadith, hadithIndex);
                            this.hadithList.push(convertedHadith);
                            hadithIndex++;
                        }
                        
                        console.log(`✓ Processed batch ${currentStart}-${currentEnd} - Total: ${this.hadithList.length}`);
                    } else {
                        console.log(`⚠ Empty or invalid response for range ${currentStart}-${currentEnd}`);
                    }
                    
                } catch (error) {
                    console.error(`✗ Error fetching batch ${currentStart}-${currentEnd}:`, error.message);
                    // Continue with next batch rather than failing completely
                }
                
                // Rate limiting between batches
                await this.sleep(this.delay);
                currentStart = currentEnd + 1;
                
                // Save progress every few batches
                if (this.hadithList.length % 500 === 0 && this.hadithList.length > 0) {
                    await this.saveProgress();
                }
            }
            
        } catch (error) {
            console.error('Error in main scraping function:', error.message);
            throw error;
        }
        
        console.log(`\nAPI fetch completed! Retrieved ${this.hadithList.length} hadith.`);
        return this.hadithList;
    }

    // Save progress to temporary file
    async saveProgress() {
        const tempFile = path.join(__dirname, '../data/sahih-bukhari-temp.json');
        try {
            await fs.promises.writeFile(tempFile, JSON.stringify(this.hadithList, null, 2));
            console.log(`Progress saved: ${this.hadithList.length} hadith`);
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    // Save final result
    async saveFinal() {
        const outputFile = path.join(__dirname, '../data/sahih-bukhari.json');
        const backupFile = path.join(__dirname, '../data/sahih-bukhari-old.json');
        
        try {
            // Backup existing file
            if (fs.existsSync(outputFile)) {
                await fs.promises.copyFile(outputFile, backupFile);
                console.log('Backed up existing file to sahih-bukhari-old.json');
            }
            
            // Sort by hadith number
            this.hadithList.sort((a, b) => a.hadithNumber - b.hadithNumber);
            
            // Save final file
            await fs.promises.writeFile(outputFile, JSON.stringify(this.hadithList, null, 2));
            console.log(`Final file saved: ${outputFile}`);
            console.log(`Total hadith scraped: ${this.hadithList.length}`);
            
            // Clean up temp file
            const tempFile = path.join(__dirname, '../data/sahih-bukhari-temp.json');
            if (fs.existsSync(tempFile)) {
                await fs.promises.unlink(tempFile);
            }
            
        } catch (error) {
            console.error('Error saving final file:', error);
            throw error;
        }
    }

    // Resume from temporary file if exists
    async resumeFromProgress() {
        const tempFile = path.join(__dirname, '../data/sahih-bukhari-temp.json');
        
        if (fs.existsSync(tempFile)) {
            try {
                const tempData = await fs.promises.readFile(tempFile, 'utf8');
                this.hadithList = JSON.parse(tempData);
                console.log(`Resuming from progress: ${this.hadithList.length} hadith already scraped`);
                return this.hadithList.length > 0 ? Math.max(...this.hadithList.map(h => h.hadithNumber)) + 1 : 1;
            } catch (error) {
                console.error('Error loading progress file:', error);
                return 1;
            }
        }
        
        return 1;
    }
}

// Main execution
async function main() {
    const scraper = new BukhariScraper();
    
    try {
        // Check for existing progress
        const startFrom = await scraper.resumeFromProgress();
        console.log(`Starting from hadith number: ${startFrom}`);
        
        // Scrape all hadith
        await scraper.scrapeAll();
        
        // Save final result
        await scraper.saveFinal();
        
        console.log('✅ Scraping completed successfully!');
        
    } catch (error) {
        console.error('❌ Scraping failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = BukhariScraper;
