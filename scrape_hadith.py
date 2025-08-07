#!/usr/bin/env python3
"""
Hadith Scraper for Riyad al-Salihin from sunnah.com
Downloads all hadith from the complete collection for offline use.
"""

import json
import time
import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin, urlparse
import sys

class RiyadSalihinScraper:
    def __init__(self):
        self.base_url = "https://sunnah.com"
        self.collection_url = "https://sunnah.com/riyadussaliheen"
        self.hadith_data = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
    def get_chapter_links(self):
        """Get all chapter links from the main collection page"""
        print("Fetching chapter links from Riyad al-Salihin...")
        
        try:
            response = self.session.get(self.collection_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find chapter links - they typically have a specific class or pattern
            chapter_links = []
            
            # Look for chapter links in the table of contents or chapter list
            for link in soup.find_all('a', href=True):
                href = link['href']
                # Check if this is a chapter link (usually contains chapter numbers)
                if '/riyadussaliheen/' in href and re.search(r'/\d+', href):
                    full_url = urljoin(self.base_url, href)
                    chapter_links.append(full_url)
            
            # Remove duplicates and sort
            chapter_links = sorted(list(set(chapter_links)))
            print(f"Found {len(chapter_links)} chapter links")
            return chapter_links
            
        except Exception as e:
            print(f"Error fetching chapter links: {e}")
            return []
    
    def scrape_hadith_from_chapter(self, chapter_url):
        """Scrape all hadith from a single chapter"""
        print(f"Scraping chapter: {chapter_url}")
        
        try:
            response = self.session.get(chapter_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find hadith containers
            hadith_containers = soup.find_all('div', class_=['hadith_narrated', 'actualHadithContainer'])
            
            chapter_hadith = []
            for container in hadith_containers:
                hadith = self.extract_hadith_data(container, chapter_url)
                if hadith:
                    chapter_hadith.append(hadith)
            
            print(f"  Found {len(chapter_hadith)} hadith in this chapter")
            return chapter_hadith
            
        except Exception as e:
            print(f"Error scraping chapter {chapter_url}: {e}")
            return []
    
    def extract_hadith_data(self, container, source_url):
        """Extract hadith data from a container element"""
        try:
            # Extract hadith number
            hadith_number = None
            number_elem = container.find(['span', 'div'], class_=['hadith_number', 'hadithNumber'])
            if number_elem:
                number_text = number_elem.get_text(strip=True)
                hadith_number = re.search(r'\d+', number_text)
                hadith_number = int(hadith_number.group()) if hadith_number else None
            
            # Extract Arabic text
            arabic_text = ""
            arabic_elem = container.find(['div', 'span'], class_=['arabic_hadith_full', 'arabic_sanad', 'arabic'])
            if arabic_elem:
                arabic_text = arabic_elem.get_text(strip=True)
            
            # Extract English text
            english_text = ""
            english_elem = container.find(['div', 'span'], class_=['english_hadith_full', 'hadith_english'])
            if english_elem:
                english_text = english_elem.get_text(strip=True)
            
            # Extract chapter information
            chapter_info = self.extract_chapter_info(source_url)
            
            # Create hadith object
            if hadith_number and (arabic_text or english_text):
                hadith = {
                    'id': hadith_number,
                    'book': 'Riyad as-Salihin',
                    'chapter': chapter_info.get('title', ''),
                    'chapterNumber': chapter_info.get('number', ''),
                    'hadithNumber': hadith_number,
                    'arabicText': arabic_text,
                    'englishText': english_text,
                    'source': 'sunnah.com',
                    'collection': 'riyadussaliheen',
                    'url': source_url
                }
                return hadith
        
        except Exception as e:
            print(f"Error extracting hadith data: {e}")
        
        return None
    
    def extract_chapter_info(self, url):
        """Extract chapter information from URL"""
        try:
            # Extract chapter number from URL
            match = re.search(r'/(\d+)(?:/|$)', url)
            chapter_number = int(match.group(1)) if match else None
            
            return {
                'number': chapter_number,
                'title': f'Chapter {chapter_number}' if chapter_number else 'Unknown Chapter'
            }
        except:
            return {'number': None, 'title': 'Unknown Chapter'}
    
    def scrape_all_hadith(self):
        """Scrape all hadith from Riyad al-Salihin"""
        print("Starting complete hadith scraping from Riyad al-Salihin...")
        
        # Get all chapter links
        chapter_links = self.get_chapter_links()
        if not chapter_links:
            print("No chapter links found. Trying alternative approach...")
            # Alternative: Try direct hadith page access
            return self.scrape_direct_hadith()
        
        all_hadith = []
        
        for i, chapter_url in enumerate(chapter_links, 1):
            print(f"Processing chapter {i}/{len(chapter_links)}")
            
            chapter_hadith = self.scrape_hadith_from_chapter(chapter_url)
            all_hadith.extend(chapter_hadith)
            
            # Rate limiting - be respectful to the server
            time.sleep(1)
            
            # Progress update every 10 chapters
            if i % 10 == 0:
                print(f"Progress: {i}/{len(chapter_links)} chapters, {len(all_hadith)} hadith collected")
        
        # Sort by hadith number
        all_hadith.sort(key=lambda x: x.get('hadithNumber', 0))
        
        print(f"Scraping complete! Total hadith collected: {len(all_hadith)}")
        return all_hadith
    
    def scrape_direct_hadith(self):
        """Alternative method: Try to access hadith directly by number"""
        print("Attempting direct hadith access...")
        
        all_hadith = []
        hadith_number = 1
        consecutive_failures = 0
        max_failures = 10
        
        while consecutive_failures < max_failures:
            hadith_url = f"{self.collection_url}/{hadith_number}"
            
            try:
                response = self.session.get(hadith_url)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Look for hadith content
                    hadith_container = soup.find('div', class_=['actualHadithContainer', 'hadith_narrated'])
                    if hadith_container:
                        hadith = self.extract_hadith_data(hadith_container, hadith_url)
                        if hadith:
                            all_hadith.append(hadith)
                            consecutive_failures = 0
                            print(f"Found hadith {hadith_number}")
                        else:
                            consecutive_failures += 1
                    else:
                        consecutive_failures += 1
                else:
                    consecutive_failures += 1
                
                hadith_number += 1
                
                # Progress update
                if hadith_number % 50 == 0:
                    print(f"Checked up to hadith {hadith_number}, found {len(all_hadith)} hadith")
                
                # Rate limiting
                time.sleep(0.5)
                
            except Exception as e:
                print(f"Error accessing hadith {hadith_number}: {e}")
                consecutive_failures += 1
                hadith_number += 1
        
        print(f"Direct scraping complete! Total hadith collected: {len(all_hadith)}")
        return all_hadith
    
    def save_to_json(self, hadith_list, filename):
        """Save hadith data to JSON file"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(hadith_list, f, ensure_ascii=False, indent=2)
            print(f"Hadith data saved to {filename}")
            return True
        except Exception as e:
            print(f"Error saving to file: {e}")
            return False

def main():
    scraper = RiyadSalihinScraper()
    
    print("=" * 60)
    print("RIYAD AL-SALIHIN HADITH SCRAPER")
    print("=" * 60)
    
    # Scrape all hadith
    hadith_data = scraper.scrape_all_hadith()
    
    if hadith_data:
        # Save to the data directory
        output_file = 'data/riyadussalihin_complete.json'
        
        # Create data directory if it doesn't exist
        import os
        os.makedirs('data', exist_ok=True)
        
        if scraper.save_to_json(hadith_data, output_file):
            print(f"\nSUCCESS!")
            print(f"Scraped {len(hadith_data)} hadith from Riyad al-Salihin")
            print(f"Data saved to: {output_file}")
            
            # Display sample of first few hadith
            print("\nSample of scraped data:")
            for hadith in hadith_data[:3]:
                print(f"  Hadith {hadith['hadithNumber']}: {hadith['englishText'][:100]}...")
        else:
            print("Failed to save data to file")
    else:
        print("No hadith data was scraped. Please check the website structure or connection.")

if __name__ == "__main__":
    main()