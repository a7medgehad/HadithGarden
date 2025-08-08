#!/usr/bin/env python3
"""
Complete scraper for all 1,896 hadith from Riyad as-Salihin
Scrapes from sunnah.com with proper chapter organization and authentic references
"""

import requests
import json
import time
from bs4 import BeautifulSoup
import re

def scrape_riyadussalihin_complete():
    """Scrape all hadith from Riyad as-Salihin with proper organization"""
    
    # Chapter mapping with correct Arabic names and hadith ranges
    chapters = [
        {
            "chapterNumber": 0,
            "englishName": "The Book of Miscellany", 
            "arabicName": "كتاب المقدمات",
            "start": 1, "end": 679
        },
        {
            "chapterNumber": 1,
            "englishName": "The Book of Good Manners", 
            "arabicName": "كتاب الأدب",
            "start": 680, "end": 726
        },
        {
            "chapterNumber": 2,
            "englishName": "The Book About the Etiquette of Eating", 
            "arabicName": "كتـــــاب أدب الطعام",
            "start": 727, "end": 777
        },
        {
            "chapterNumber": 3,
            "englishName": "The Book of Dress", 
            "arabicName": "كتــــاب اللباس",
            "start": 778, "end": 812
        },
        {
            "chapterNumber": 4,
            "englishName": "The Book of the Etiquette of Sleeping, Lying and Sitting etc", 
            "arabicName": "كتاب آداب النوم",
            "start": 813, "end": 843
        },
        {
            "chapterNumber": 5,
            "englishName": "The Book of Greetings", 
            "arabicName": "كتاب السلام",
            "start": 844, "end": 893
        },
        {
            "chapterNumber": 6,
            "englishName": "The Book of Visiting the Sick", 
            "arabicName": "كتاب عيادة المريض وتشييع الميت والصلاة عليه وحضور دفنه",
            "start": 894, "end": 955
        },
        {
            "chapterNumber": 7,
            "englishName": "The Book of Etiquette of Traveling", 
            "arabicName": "كتاب آداب السفر",
            "start": 956, "end": 990
        },
        {
            "chapterNumber": 8,
            "englishName": "The Book of Virtues", 
            "arabicName": "كتاب الفضائل",
            "start": 991, "end": 1267
        },
        {
            "chapterNumber": 9,
            "englishName": "The Book of I'tikaf", 
            "arabicName": "كتاب الاعتكاف",
            "start": 1268, "end": 1270
        },
        {
            "chapterNumber": 10,
            "englishName": "The Book of Hajj", 
            "arabicName": "كتاب الحج",
            "start": 1271, "end": 1284
        },
        {
            "chapterNumber": 11,
            "englishName": "The Book of Jihad", 
            "arabicName": "كتاب الجهاد",
            "start": 1285, "end": 1375
        },
        {
            "chapterNumber": 12,
            "englishName": "The Book of Knowledge", 
            "arabicName": "كتاب العلم",
            "start": 1376, "end": 1392
        },
        {
            "chapterNumber": 13,
            "englishName": "The Book of Praise and Gratitude to Allah", 
            "arabicName": "كتاب حمد الله تعالى وشكره",
            "start": 1393, "end": 1396
        },
        {
            "chapterNumber": 14,
            "englishName": "The Book of Supplicating Allah to Exalt the Mention of Allah's Messenger", 
            "arabicName": "كتاب الصلاة على رسول الله صلى الله عليه وسلم",
            "start": 1397, "end": 1407
        },
        {
            "chapterNumber": 15,
            "englishName": "The Book of the Remembrance of Allah", 
            "arabicName": "كتاب الأذكار",
            "start": 1408, "end": 1464
        },
        {
            "chapterNumber": 16,
            "englishName": "The Book of Du'a (Supplications)", 
            "arabicName": "كتاب الدعوات",
            "start": 1465, "end": 1510
        },
        {
            "chapterNumber": 17,
            "englishName": "The Book of the Prohibited actions", 
            "arabicName": "كتاب الأمور المنهي عنها",
            "start": 1511, "end": 1807
        },
        {
            "chapterNumber": 18,
            "englishName": "The Book of Miscellaneous ahadith of Significant Values", 
            "arabicName": "كتاب المنثورات والملح",
            "start": 1808, "end": 1868
        },
        {
            "chapterNumber": 19,
            "englishName": "The Book of Forgiveness", 
            "arabicName": "كتاب الاستغفار",
            "start": 1869, "end": 1896
        }
    ]
    
    all_hadith = []
    total_scraped = 0
    
    print("Starting complete Riyad as-Salihin scraping...")
    
    for chapter in chapters:
        print(f"\nProcessing Chapter {chapter['chapterNumber']}: {chapter['englishName']}")
        print(f"Arabic: {chapter['arabicName']}")
        print(f"Hadith range: {chapter['start']} to {chapter['end']}")
        
        chapter_hadith = []
        
        for hadith_num in range(chapter['start'], chapter['end'] + 1):
            try:
                url = f"https://sunnah.com/riyadussalihin/{hadith_num}"
                
                print(f"  Scraping hadith {hadith_num}...", end="")
                
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
                
                response = requests.get(url, headers=headers)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Extract Arabic text
                arabic_div = soup.find('div', class_='arabic_hadith_full')
                arabic_text = ""
                if arabic_div:
                    arabic_text = arabic_div.get_text(strip=True)
                    # Clean up Arabic text
                    arabic_text = re.sub(r'\s+', ' ', arabic_text).strip()
                
                # Extract English text  
                english_div = soup.find('div', class_='english_hadith_full')
                english_text = ""
                if english_div:
                    english_text = english_div.get_text(strip=True)
                    # Clean up English text
                    english_text = re.sub(r'\s+', ' ', english_text).strip()
                
                # Construct hadith entry
                hadith_entry = {
                    "id": hadith_num,
                    "book": "Riyad as-Salihin",
                    "chapter": chapter['englishName'],
                    "chapterNumber": chapter['chapterNumber'],
                    "hadithNumber": hadith_num,
                    "arabicText": arabic_text,
                    "englishText": english_text,
                    "source": "sunnah.com",
                    "collection": "riyadussaliheen", 
                    "reference": f"Riyad as-Salihin {hadith_num}",
                    "url": url
                }
                
                chapter_hadith.append(hadith_entry)
                all_hadith.append(hadith_entry)
                total_scraped += 1
                
                print(" ✓")
                
                # Respectful delay
                time.sleep(0.5)
                
            except Exception as e:
                print(f" ✗ Error: {e}")
                continue
        
        print(f"Chapter {chapter['chapterNumber']} completed: {len(chapter_hadith)} hadith scraped")
    
    print(f"\n=== Scraping Complete ===")
    print(f"Total hadith scraped: {total_scraped}")
    print(f"Expected: 1,896 hadith")
    
    # Save to JSON file
    with open('data/riyadussalihin_complete.json', 'w', encoding='utf-8') as f:
        json.dump(all_hadith, f, ensure_ascii=False, indent=2)
    
    print(f"Complete data saved to: data/riyadussalihin_complete.json")
    return all_hadith

if __name__ == "__main__":
    hadith_data = scrape_riyadussalihin_complete()