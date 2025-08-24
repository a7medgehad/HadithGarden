#!/usr/bin/env node

/**
 * Sahih al-Bukhari JSON Validation Script
 * 
 * This script validates the scraped Sahih al-Bukhari JSON file
 * to ensure data quality and completeness.
 * 
 * Usage: node tools/validate.js
 */

const fs = require('fs');
const path = require('path');

class BukhariValidator {
    constructor() {
        this.expectedMinHadith = 6000; // Minimum expected hadith count
        this.expectedMaxHadith = 7000; // Maximum expected hadith count
        this.dataFile = path.join(__dirname, '../data/sahih-bukhari.json');
        this.errors = [];
        this.warnings = [];
        this.stats = {
            totalHadith: 0,
            emptyArabicText: 0,
            emptyEnglishText: 0,
            duplicateIds: 0,
            duplicateHadithNumbers: 0,
            uniqueChapters: new Set(),
            uniqueBooks: new Set()
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            'info': '🔍',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        }[type] || 'ℹ️';
        
        console.log(`${prefix} ${message}`);
    }

    error(message) {
        this.errors.push(message);
        this.log(`ERROR: ${message}`, 'error');
    }

    warning(message) {
        this.warnings.push(message);
        this.log(`WARNING: ${message}`, 'warning');
    }

    async validateFile() {
        this.log('Starting Sahih al-Bukhari JSON validation...');

        // Check if file exists
        if (!fs.existsSync(this.dataFile)) {
            this.error(`Data file not found: ${this.dataFile}`);
            return false;
        }

        // Check file size
        const fileStats = fs.statSync(this.dataFile);
        const fileSizeMB = fileStats.size / (1024 * 1024);
        this.log(`File size: ${fileSizeMB.toFixed(2)} MB`);

        if (fileSizeMB < 1) {
            this.warning(`File size seems small (${fileSizeMB.toFixed(2)} MB). Expected at least 1 MB for complete collection.`);
        }

        try {
            // Load and parse JSON
            this.log('Loading JSON file...');
            const jsonData = fs.readFileSync(this.dataFile, 'utf8');
            
            let hadithData;
            try {
                hadithData = JSON.parse(jsonData);
            } catch (parseError) {
                this.error(`JSON parse error: ${parseError.message}`);
                return false;
            }

            // Validate structure
            if (!Array.isArray(hadithData)) {
                this.error('JSON root should be an array');
                return false;
            }

            this.stats.totalHadith = hadithData.length;
            this.log(`Total hadith found: ${this.stats.totalHadith}`);

            // Check hadith count
            if (this.stats.totalHadith < this.expectedMinHadith) {
                this.warning(`Low hadith count: ${this.stats.totalHadith}. Expected at least ${this.expectedMinHadith}`);
            } else if (this.stats.totalHadith > this.expectedMaxHadith) {
                this.warning(`High hadith count: ${this.stats.totalHadith}. Expected at most ${this.expectedMaxHadith}`);
            } else {
                this.log(`Hadith count looks good: ${this.stats.totalHadith}`, 'success');
            }

            // Validate each hadith
            this.log('Validating individual hadith...');
            await this.validateHadithEntries(hadithData);

            // Generate summary
            this.generateSummary();

            return this.errors.length === 0;

        } catch (error) {
            this.error(`Validation failed: ${error.message}`);
            return false;
        }
    }

    async validateHadithEntries(hadithData) {
        const seenIds = new Set();
        const seenHadithNumbers = new Set();
        const requiredFields = ['id', 'book', 'chapter', 'hadithNumber', 'arabicText', 'englishText', 'source', 'collection', 'reference', 'url'];

        let validationCount = 0;
        const totalCount = hadithData.length;

        for (const [index, hadith] of hadithData.entries()) {
            // Progress indicator
            if (++validationCount % 1000 === 0 || validationCount === totalCount) {
                this.log(`Validated ${validationCount}/${totalCount} hadith...`);
            }

            // Check required fields
            for (const field of requiredFields) {
                if (!(field in hadith)) {
                    this.error(`Missing field "${field}" in hadith at index ${index}`);
                }
            }

            // Check for empty critical fields
            if (!hadith.arabicText || hadith.arabicText.trim() === '') {
                this.stats.emptyArabicText++;
                if (this.stats.emptyArabicText <= 5) { // Only report first few
                    this.error(`Empty arabicText in hadith ${hadith.hadithNumber} (index ${index})`);
                }
            }

            if (!hadith.englishText || hadith.englishText.trim() === '') {
                this.stats.emptyEnglishText++;
                if (this.stats.emptyEnglishText <= 5) { // Only report first few
                    this.warning(`Empty englishText in hadith ${hadith.hadithNumber} (index ${index})`);
                }
            }

            // Check for duplicates
            if (seenIds.has(hadith.id)) {
                this.stats.duplicateIds++;
                this.error(`Duplicate ID ${hadith.id} found at index ${index}`);
            } else {
                seenIds.add(hadith.id);
            }

            if (seenHadithNumbers.has(hadith.hadithNumber)) {
                this.stats.duplicateHadithNumbers++;
                this.warning(`Duplicate hadithNumber ${hadith.hadithNumber} found at index ${index}`);
            } else {
                seenHadithNumbers.add(hadith.hadithNumber);
            }

            // Collect unique values for stats
            if (hadith.chapter) {
                this.stats.uniqueChapters.add(hadith.chapter);
            }
            if (hadith.book) {
                this.stats.uniqueBooks.add(hadith.book);
            }

            // Check data types
            if (typeof hadith.id !== 'number') {
                this.warning(`ID should be number, got ${typeof hadith.id} for hadith at index ${index}`);
            }

            if (typeof hadith.hadithNumber !== 'number') {
                this.warning(`hadithNumber should be number, got ${typeof hadith.hadithNumber} for hadith at index ${index}`);
            }

            // Check collection value
            if (hadith.collection !== 'sahih-bukhari') {
                this.warning(`Unexpected collection value "${hadith.collection}" in hadith ${hadith.hadithNumber}`);
            }

            // Check URL format
            if (hadith.url && !hadith.url.startsWith('https://sunnah.com/bukhari:')) {
                this.warning(`Unexpected URL format "${hadith.url}" in hadith ${hadith.hadithNumber}`);
            }
        }
    }

    generateSummary() {
        this.log('\n📊 VALIDATION SUMMARY', 'info');
        this.log(`Total hadith: ${this.stats.totalHadith}`);
        this.log(`Unique chapters: ${this.stats.uniqueChapters.size}`);
        this.log(`Unique books: ${this.stats.uniqueBooks.size}`);
        
        if (this.stats.emptyArabicText > 0) {
            this.log(`Empty Arabic text: ${this.stats.emptyArabicText}`, 'error');
        }
        
        if (this.stats.emptyEnglishText > 0) {
            this.log(`Empty English text: ${this.stats.emptyEnglishText}`, 'warning');
        }
        
        if (this.stats.duplicateIds > 0) {
            this.log(`Duplicate IDs: ${this.stats.duplicateIds}`, 'error');
        }
        
        if (this.stats.duplicateHadithNumbers > 0) {
            this.log(`Duplicate hadith numbers: ${this.stats.duplicateHadithNumbers}`, 'warning');
        }

        this.log(`\nValidation completed with ${this.errors.length} errors and ${this.warnings.length} warnings`);

        if (this.errors.length === 0) {
            this.log('🎉 All validations passed!', 'success');
        } else {
            this.log(`❌ Found ${this.errors.length} critical errors`, 'error');
        }

        if (this.warnings.length > 0) {
            this.log(`⚠️  Found ${this.warnings.length} warnings (non-critical)`, 'warning');
        }
    }

    getResults() {
        return {
            valid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings,
            stats: {
                ...this.stats,
                uniqueChapters: this.stats.uniqueChapters.size,
                uniqueBooks: this.stats.uniqueBooks.size
            }
        };
    }
}

// Main execution
async function main() {
    const validator = new BukhariValidator();
    
    try {
        const isValid = await validator.validateFile();
        const results = validator.getResults();
        
        if (isValid) {
            console.log('\n✅ Validation completed successfully!');
            process.exit(0);
        } else {
            console.log('\n❌ Validation failed with critical errors.');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Validation script failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = BukhariValidator;
