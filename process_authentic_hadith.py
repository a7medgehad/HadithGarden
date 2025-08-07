#!/usr/bin/env python3
"""
Process the authentic Riyad al-Salihin data into the format expected by the Chrome extension
"""

import json
import os

def process_authentic_hadith():
    """Process the downloaded authentic hadith data"""
    
    print("Processing authentic Riyad al-Salihin data...")
    
    # Load the authentic data
    with open('data/riyad_assalihin_authentic.json', 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    hadith_list = raw_data.get('hadiths', [])
    chapters = raw_data.get('chapters', [])
    
    # Create chapter mapping
    chapter_map = {ch['id']: ch for ch in chapters}
    
    print(f"Found {len(hadith_list)} authentic hadith")
    print(f"Found {len(chapters)} chapters")
    
    # Process each hadith into our extension format
    processed_hadith = []
    
    for i, hadith in enumerate(hadith_list):
        chapter_id = hadith.get('chapterId', 0)
        chapter_info = chapter_map.get(chapter_id, {})
        
        # Extract narrator and text from English field
        english_data = hadith.get('english', {})
        narrator = english_data.get('narrator', '') if isinstance(english_data, dict) else ''
        english_text = english_data.get('text', '') if isinstance(english_data, dict) else str(english_data)
        
        # Clean up the text by removing extra whitespace and newlines
        if narrator and english_text:
            full_english = f"{narrator} {english_text}".strip()
        else:
            full_english = english_text.strip()
        
        # Clean up Arabic text
        arabic_text = hadith.get('arabic', '').strip()
        
        processed_hadith.append({
            "id": i + 1,
            "book": "Riyad as-Salihin",
            "chapter": chapter_info.get('english', f'Chapter {chapter_id}'),
            "chapterNumber": chapter_id,
            "hadithNumber": i + 1,
            "arabicText": arabic_text,
            "englishText": full_english,
            "source": "sunnah.com",
            "collection": "riyadussaliheen",
            "reference": f"Riyad as-Salihin {hadith.get('idInBook', i + 1)}",
            "url": f"https://sunnah.com/riyadussalihin/{hadith.get('idInBook', i + 1)}"
        })
    
    return processed_hadith

def save_processed_data(data):
    """Save the processed data to replace the extension's hadith file"""
    
    output_file = 'data/riyadussalihin.json'
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Saved {len(data)} authentic hadith to {output_file}")
        return True
        
    except Exception as e:
        print(f"❌ Error saving processed data: {e}")
        return False

def show_sample_data(data):
    """Show sample of the processed data"""
    
    print("\n📖 Sample of processed authentic hadith:")
    print("=" * 60)
    
    for i, hadith in enumerate(data[:3]):
        print(f"\nHadith {hadith['hadithNumber']} - {hadith['chapter']}")
        print(f"Arabic: {hadith['arabicText'][:80]}...")
        print(f"English: {hadith['englishText'][:100]}...")
        print(f"Reference: {hadith['reference']}")
    
    print("\n" + "=" * 60)
    print(f"Total hadith processed: {len(data)}")
    
    # Show chapter distribution
    chapters = {}
    for hadith in data:
        chapter = hadith['chapter']
        chapters[chapter] = chapters.get(chapter, 0) + 1
    
    print(f"\nChapters included:")
    for chapter, count in list(chapters.items())[:10]:  # Show first 10 chapters
        print(f"  • {chapter}: {count} hadith")
    
    if len(chapters) > 10:
        print(f"  ... and {len(chapters) - 10} more chapters")

def main():
    print("=" * 60)
    print("AUTHENTIC RIYAD AL-SALIHIN PROCESSOR")
    print("Converting authentic data for Chrome Extension")
    print("=" * 60)
    
    # Process the authentic hadith data
    processed_data = process_authentic_hadith()
    
    if processed_data:
        # Save the processed data
        if save_processed_data(processed_data):
            show_sample_data(processed_data)
            print(f"\n🎉 SUCCESS!")
            print(f"✅ Processed {len(processed_data)} authentic hadith from Riyad al-Salihin")
            print(f"✅ Data ready for Chrome extension offline use")
            print(f"✅ Source: AhmedBaset/hadith-json (authenticated)")
        else:
            print("\n❌ Failed to save processed data")
    else:
        print("\n❌ Failed to process hadith data")

if __name__ == "__main__":
    main()