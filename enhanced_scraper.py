#!/usr/bin/env python3
"""
Enhanced Hadith Scraper using trafilatura for reliable text extraction
"""

import json
import requests
import time
import re
from urllib.parse import urljoin
import trafilatura

def get_hadith_urls():
    """Get URLs for individual hadith pages"""
    base_url = "https://sunnah.com/riyadussaliheen"
    hadith_urls = []
    
    # Try different URL patterns for Riyad al-Salihin
    # Pattern 1: Direct hadith access
    for i in range(1, 2000):  # Assuming max ~2000 hadith
        url = f"{base_url}/{i}"
        hadith_urls.append(url)
    
    return hadith_urls

def scrape_hadith_page(url):
    """Scrape a single hadith page using trafilatura"""
    try:
        # Fetch the page
        downloaded = trafilatura.fetch_url(url)
        if not downloaded:
            return None
        
        # Extract text content
        text = trafilatura.extract(downloaded)
        if not text:
            return None
        
        # Extract hadith number from URL
        hadith_match = re.search(r'/(\d+)$', url)
        hadith_number = int(hadith_match.group(1)) if hadith_match else None
        
        if not hadith_number:
            return None
        
        # Clean and process the extracted text
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # Try to separate Arabic and English content
        arabic_text = ""
        english_text = ""
        
        # Look for Arabic text (contains Arabic characters)
        arabic_pattern = re.compile(r'[\u0600-\u06FF]')
        
        for line in lines:
            if arabic_pattern.search(line):
                if len(line) > 50:  # Likely the main hadith text
                    arabic_text = line
            else:
                # English text - look for substantial content
                if len(line) > 100 and not line.startswith(('Book', 'Chapter', 'Hadith')):
                    if not english_text:  # Take the first substantial English text
                        english_text = line
        
        if arabic_text or english_text:
            return {
                'id': hadith_number,
                'book': 'Riyad as-Salihin',
                'hadithNumber': hadith_number,
                'arabicText': arabic_text,
                'englishText': english_text,
                'source': 'sunnah.com',
                'url': url
            }
        
        return None
        
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None

def scrape_batch(urls, batch_size=10, delay=1):
    """Scrape URLs in batches with progress tracking"""
    all_hadith = []
    total = len(urls)
    
    print(f"Starting to scrape {total} URLs in batches of {batch_size}...")
    
    for i in range(0, total, batch_size):
        batch = urls[i:i + batch_size]
        batch_start = i + 1
        batch_end = min(i + batch_size, total)
        
        print(f"Processing batch {batch_start}-{batch_end} of {total}...")
        
        batch_results = []
        for url in batch:
            hadith = scrape_hadith_page(url)
            if hadith:
                batch_results.append(hadith)
        
        all_hadith.extend(batch_results)
        
        print(f"  Found {len(batch_results)} hadith in this batch (Total: {len(all_hadith)})")
        
        # Rate limiting
        time.sleep(delay)
        
        # Stop if we haven't found any hadith in several batches
        if i > 500 and len(all_hadith) == 0:
            print("No hadith found in first 500 attempts, stopping...")
            break
    
    return all_hadith

def main():
    print("=" * 60)
    print("ENHANCED RIYAD AL-SALIHIN SCRAPER")
    print("=" * 60)
    
    # Get all potential hadith URLs
    hadith_urls = get_hadith_urls()
    
    # Scrape in batches
    hadith_data = scrape_batch(hadith_urls[:1000], batch_size=20, delay=2)
    
    if hadith_data:
        # Sort by hadith number
        hadith_data.sort(key=lambda x: x['hadithNumber'])
        
        # Save to JSON file
        output_file = 'data/riyadussalihin_complete.json'
        
        try:
            import os
            os.makedirs('data', exist_ok=True)
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(hadith_data, f, ensure_ascii=False, indent=2)
            
            print(f"\nSUCCESS!")
            print(f"Scraped {len(hadith_data)} hadith from Riyad al-Salihin")
            print(f"Data saved to: {output_file}")
            
            # Show sample data
            print("\nSample hadith:")
            for hadith in hadith_data[:3]:
                print(f"  Hadith {hadith['hadithNumber']}:")
                if hadith['englishText']:
                    print(f"    English: {hadith['englishText'][:100]}...")
                if hadith['arabicText']:
                    print(f"    Arabic: {hadith['arabicText'][:100]}...")
                print()
        
        except Exception as e:
            print(f"Error saving data: {e}")
    else:
        print("No hadith data was scraped.")
        
        # Try a single test URL to debug
        print("\nTrying a test URL to debug...")
        test_url = "https://sunnah.com/riyadussaliheen/1"
        test_hadith = scrape_hadith_page(test_url)
        if test_hadith:
            print("Test successful! Found hadith data.")
        else:
            print("Test failed. Website structure may have changed.")

if __name__ == "__main__":
    main()