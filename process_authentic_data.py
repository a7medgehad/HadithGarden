#!/usr/bin/env python3
"""
Process the authentic Riyad as-Salihin dataset from AhmedBaset/hadith-json
and convert it to our extension's format
"""

import json

def process_authentic_riyadussalihin():
    """Process the authentic dataset and convert to our format"""
    
    print("Processing authentic Riyad as-Salihin dataset...")
    
    # Load the authentic dataset
    with open('data/riyadussalihin_complete_authentic.json', 'r', encoding='utf-8') as f:
        authentic_data = json.load(f)
    
    print(f"Loaded dataset structure with keys: {list(authentic_data.keys()) if isinstance(authentic_data, dict) else 'Not a dict'}")
    
    # Extract the hadith array from the nested structure
    hadith_list = authentic_data.get('hadiths', []) if isinstance(authentic_data, dict) else authentic_data
    print(f"Found {len(hadith_list)} hadith from authentic source")
    
    # Chapter mapping to English names
    chapter_names = {
        1: "The Book of Miscellany",
        2: "The Book of Good Manners", 
        3: "The Book About the Etiquette of Eating",
        4: "The Book of Dress",
        5: "The Book of the Etiquette of Sleeping, Lying and Sitting etc",
        6: "The Book of Greetings",
        7: "The Book of Visiting the Sick",
        8: "The Book of Etiquette of Traveling", 
        9: "The Book of Virtues",
        10: "The Book of I'tikaf",
        11: "The Book of Hajj",
        12: "The Book of Jihad",
        13: "The Book of Knowledge",
        14: "The Book of Praise and Gratitude to Allah",
        15: "The Book of Supplicating Allah to Exalt the Mention of Allah's Messenger",
        16: "The Book of the Remembrance of Allah",
        17: "The Book of Du'a (Supplications)",
        18: "The Book of the Prohibited actions",
        19: "The Book of Miscellaneous ahadith of Significant Values", 
        20: "The Book of Forgiveness"
    }
    
    # Process each hadith into our format
    processed_hadith = []
    
    for hadith in hadith_list:
        # Extract the data
        hadith_id = hadith.get('id', len(processed_hadith) + 1)
        chapter_id = hadith.get('chapterId', 1)
        arabic_text = hadith.get('arabic', '')
        
        # English text processing
        english_data = hadith.get('english', {})
        narrator = english_data.get('narrator', '') if isinstance(english_data, dict) else ''
        english_text = english_data.get('text', '') if isinstance(english_data, dict) else str(english_data)
        
        # Combine narrator and text if both exist
        full_english = f"{narrator} {english_text}".strip() if narrator and english_text else (narrator or english_text or '')
        
        # Get chapter name
        chapter_name = chapter_names.get(chapter_id, f"Chapter {chapter_id}")
        
        # Create our format
        processed_entry = {
            "id": hadith_id,
            "book": "Riyad as-Salihin",
            "chapter": chapter_name,
            "chapterNumber": chapter_id - 1,  # 0-indexed for our system
            "hadithNumber": hadith_id,
            "arabicText": arabic_text,
            "englishText": full_english,
            "source": "sunnah.com",
            "collection": "riyadussaliheen",
            "reference": f"Riyad as-Salihin {hadith_id}",
            "url": f"https://sunnah.com/riyadussalihin/{hadith_id}"
        }
        
        processed_hadith.append(processed_entry)
    
    print(f"Processed {len(processed_hadith)} hadith successfully")
    
    # Save the processed data
    with open('data/riyadussalihin.json', 'w', encoding='utf-8') as f:
        json.dump(processed_hadith, f, ensure_ascii=False, indent=2)
    
    print("Complete authentic dataset saved to: data/riyadussalihin.json")
    
    # Show sample of the processed data
    if processed_hadith:
        print(f"\n=== Sample Hadith (ID: {processed_hadith[0]['id']}) ===")
        print(f"Chapter: {processed_hadith[0]['chapter']}")
        print(f"Arabic: {processed_hadith[0]['arabicText'][:100]}...")
        print(f"English: {processed_hadith[0]['englishText'][:100]}...")
    
    return processed_hadith

if __name__ == "__main__":
    processed_data = process_authentic_riyadussalihin()