#!/usr/bin/env python3
"""
Download authentic Riyad al-Salihin hadith from AhmedBaset's verified repository
"""

import json
import requests
import os

def download_authentic_riyadussalihin():
    """Download complete authentic Riyad al-Salihin collection"""
    
    print("Downloading authentic Riyad al-Salihin collection...")
    
    # GitHub raw file URL for the complete collection
    url = "https://raw.githubusercontent.com/AhmedBaset/hadith-json/main/db/by_book/other_books/riyadSalihin.json"
    
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Parse the JSON data
        hadith_data = response.json()
        print(f"Downloaded {len(hadith_data)} authentic hadith from Riyad al-Salihin")
        
        # Transform the data to match our extension's expected format
        transformed_data = []
        
        for i, hadith in enumerate(hadith_data, 1):
            transformed_hadith = {
                "id": i,
                "book": "Riyad as-Salihin",
                "chapter": f"Chapter {hadith.get('chapterId', 'Unknown')}",
                "chapterNumber": hadith.get('chapterId', 0),
                "hadithNumber": i,
                "arabicText": hadith.get('arabic', ''),
                "englishText": hadith.get('english', {}).get('text', ''),
                "narrator": hadith.get('english', {}).get('narrator', ''),
                "source": "sunnah.com",
                "collection": "riyadussaliheen",
                "reference": f"Riyad as-Salihin {i}",
                "url": f"https://sunnah.com/riyadussaliheen/{i}"
            }
            transformed_data.append(transformed_hadith)
        
        return transformed_data
        
    except requests.exceptions.RequestException as e:
        print(f"Network error downloading hadith: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON data: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def save_hadith_data(hadith_data, filename):
    """Save hadith data to JSON file"""
    try:
        os.makedirs('data', exist_ok=True)
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(hadith_data, f, ensure_ascii=False, indent=2)
        
        print(f"Authentic hadith data saved to {filename}")
        return True
        
    except Exception as e:
        print(f"Error saving data: {e}")
        return False

def main():
    print("=" * 60)
    print("AUTHENTIC RIYAD AL-SALIHIN DOWNLOADER")
    print("Source: AhmedBaset/hadith-json (Verified)")
    print("=" * 60)
    
    # Download authentic hadith
    hadith_data = download_authentic_riyadussalihin()
    
    if hadith_data:
        # Save to our data directory
        output_file = 'data/riyadussalihin.json'
        
        if save_hadith_data(hadith_data, output_file):
            print(f"\nSUCCESS!")
            print(f"✅ Downloaded {len(hadith_data)} authentic hadith")
            print(f"✅ Saved to: {output_file}")
            print(f"✅ Ready for offline use in Chrome extension")
            
            # Show sample of downloaded data
            print(f"\nFirst 3 hadith preview:")
            for hadith in hadith_data[:3]:
                print(f"\n📖 Hadith {hadith['hadithNumber']}:")
                if hadith['narrator']:
                    print(f"   Narrator: {hadith['narrator']}")
                print(f"   English: {hadith['englishText'][:100]}...")
                if hadith['arabicText']:
                    print(f"   Arabic: {hadith['arabicText'][:100]}...")
        else:
            print("❌ Failed to save authentic hadith data")
    else:
        print("❌ Failed to download authentic hadith collection")
        print("Please check internet connection and try again")

if __name__ == "__main__":
    main()