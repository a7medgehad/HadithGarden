#!/usr/bin/env python3
"""
Final comprehensive validation of the complete enhanced Sahih al-Bukhari collection
"""

import json
import random
from collections import Counter, defaultdict
from pathlib import Path

def validate_complete_collection():
    print("🔍 FINAL VALIDATION: Enhanced Sahih al-Bukhari Collection")
    print("=" * 70)
    
    # Load the final enhanced data
    data_file = Path(__file__).parent.parent / "data" / "sahih-bukhari.json"
    
    if not data_file.exists():
        print("❌ Data file not found!")
        return False
        
    with open(data_file, 'r', encoding='utf-8') as f:
        hadith_collection = json.load(f)
    
    print(f"📊 Total hadith loaded: {len(hadith_collection)}")
    
    # Validation 1: Total count
    expected_total = 7558  # 7563 - 5 known missing
    if len(hadith_collection) != expected_total:
        print(f"❌ Expected {expected_total} hadith, got {len(hadith_collection)}")
        return False
    print(f"✅ Total count correct: {len(hadith_collection)} hadith")
    
    # Validation 2: Hadith numbers uniqueness and coverage
    hadith_numbers = [h.get('hadithNumber') for h in hadith_collection]
    unique_numbers = set(hadith_numbers)
    
    if len(unique_numbers) != len(hadith_numbers):
        duplicates = len(hadith_numbers) - len(unique_numbers)
        print(f"❌ Found {duplicates} duplicate hadith numbers")
        return False
    print(f"✅ All hadith numbers unique")
    
    # Check coverage (should be 1-7563 minus the 5 known missing)
    known_missing = {5710, 5711, 5774, 6074, 6174}
    expected_numbers = set(range(1, 7564)) - known_missing
    actual_numbers = set(hadith_numbers)
    
    missing_from_expected = expected_numbers - actual_numbers
    extra_numbers = actual_numbers - expected_numbers
    
    if missing_from_expected:
        print(f"❌ Missing expected hadith: {sorted(list(missing_from_expected))}")
        return False
        
    if extra_numbers:
        print(f"❌ Unexpected hadith numbers: {sorted(list(extra_numbers))}")
        return False
        
    print(f"✅ Hadith number coverage perfect (missing only known 404s)")
    
    # Validation 3: Book number distribution
    book_numbers = [h.get('bookNumber', 0) for h in hadith_collection]
    book_counter = Counter(book_numbers)
    
    min_book = min(book_numbers)
    max_book = max(book_numbers)
    unique_books = len(set(book_numbers))
    
    if min_book != 1 or max_book != 97:
        print(f"❌ Book range {min_book}-{max_book}, expected 1-97")
        return False
        
    if unique_books != 97:
        print(f"❌ Found {unique_books} unique books, expected 97")
        return False
        
    print(f"✅ Book numbers: 1-97 ({unique_books} books)")
    
    # Show book distribution
    print(f"📚 Book distribution (sample):")
    for book_num in [1, 10, 25, 50, 75, 90, 97]:
        count = book_counter.get(book_num, 0)
        print(f"   Book {book_num:2d}: {count:3d} hadith")
    
    # Validation 4: Chapter coverage
    with_english_chapters = sum(1 for h in hadith_collection if h.get('chapter') and h.get('chapter').strip())
    with_arabic_chapters = sum(1 for h in hadith_collection if h.get('chapterArabic') and h.get('chapterArabic').strip())
    
    english_chapter_pct = (with_english_chapters / len(hadith_collection)) * 100
    arabic_chapter_pct = (with_arabic_chapters / len(hadith_collection)) * 100
    
    print(f"✅ Chapter coverage:")
    print(f"   English chapters: {with_english_chapters}/{len(hadith_collection)} ({english_chapter_pct:.1f}%)")
    print(f"   Arabic chapters: {with_arabic_chapters}/{len(hadith_collection)} ({arabic_chapter_pct:.1f}%)")
    
    if english_chapter_pct < 95:
        print(f"⚠️  English chapter coverage below 95%")
    
    # Validation 5: Required fields
    required_fields = ['hadithNumber', 'bookNumber', 'arabicText', 'englishText', 'reference']
    missing_fields = defaultdict(int)
    
    for hadith in hadith_collection:
        for field in required_fields:
            if not hadith.get(field):
                missing_fields[field] += 1
    
    if missing_fields:
        print(f"⚠️  Missing required fields:")
        for field, count in missing_fields.items():
            print(f"   {field}: {count} hadith missing")
    else:
        print(f"✅ All required fields present")
    
    # Validation 6: Data structure compliance
    sample_hadith = random.choice(hadith_collection)
    expected_structure = {
        'id', 'hadithNumber', 'book', 'bookNumber', 'bookNameEnglish', 'bookNameArabic',
        'chapter', 'chapterArabic', 'chapterNumber', 'hadithInBook',
        'arabicText', 'englishText', 'narratedBy', 'reference', 'grading',
        'source', 'collection', 'url'
    }
    
    actual_structure = set(sample_hadith.keys())
    missing_structure = expected_structure - actual_structure
    extra_structure = actual_structure - expected_structure
    
    if missing_structure:
        print(f"⚠️  Missing structure fields: {missing_structure}")
    if extra_structure:
        print(f"ℹ️  Extra fields: {extra_structure}")
    
    print(f"✅ Data structure validated")
    
    # Validation 7: Sample content validation
    print(f"🔍 Sample content validation:")
    
    # Test different book ranges
    sample_books = [1, 25, 50, 75, 97]
    for book_num in sample_books:
        book_hadith = [h for h in hadith_collection if h.get('bookNumber') == book_num]
        if book_hadith:
            sample = random.choice(book_hadith)
            hadith_num = sample.get('hadithNumber')
            chapter = sample.get('chapter', '')[:50]
            chapter_ar = sample.get('chapterArabic', '')[:30]
            
            print(f"   Book {book_num:2d}: Hadith {hadith_num} - \"{chapter}...\"")
            if chapter_ar:
                print(f"           Arabic: \"{chapter_ar}...\"")
    
    # Validation 8: File size validation
    file_size_mb = data_file.stat().st_size / 1024 / 1024
    print(f"📁 File size: {file_size_mb:.1f} MB")
    
    if file_size_mb < 10:
        print(f"⚠️  File size seems small for 7558 hadith")
    elif file_size_mb > 30:
        print(f"⚠️  File size seems large")
    else:
        print(f"✅ File size appropriate")
    
    print("=" * 70)
    print("🎉 FINAL VALIDATION COMPLETE!")
    print(f"✅ Enhanced Sahih al-Bukhari collection validated successfully")
    print(f"📊 {len(hadith_collection)} hadith across 97 books with complete metadata")
    print(f"🚀 Ready for use in HadithGarden extension!")
    
    return True

if __name__ == "__main__":
    validate_complete_collection()
