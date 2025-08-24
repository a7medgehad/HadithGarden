#!/usr/bin/env python3
"""
Analyze missing hadith to understand which ones are truly missing vs. just 404 errors
"""

import httpx
import json
import asyncio
from pathlib import Path

async def check_hadith_exists(client: httpx.AsyncClient, hadith_num: int) -> bool:
    """Check if a hadith number exists by trying to fetch it"""
    url = f"https://sunnah.com/bukhari:{hadith_num}"
    try:
        response = await client.get(url)
        return response.status_code == 200
    except Exception:
        return False

async def main():
    # Load current data
    data_file = Path(__file__).parent.parent / "data" / "sahih-bukhari.json"
    
    if data_file.exists():
        with open(data_file, 'r', encoding='utf-8') as f:
            current_data = json.load(f)
        
        # Get existing hadith numbers
        existing = set(h.get('hadithNumber') for h in current_data if h.get('hadithNumber'))
        print(f"Current data has {len(existing)} hadith")
        
        # Check what numbers are missing from 1-7563
        all_possible = set(range(1, 7564))
        missing = all_possible - existing
        
        print(f"Missing hadith numbers: {len(missing)}")
        if missing:
            print(f"Missing numbers: {sorted(list(missing))[:20]}...")  # Show first 20
        
        # Test known problematic numbers
        known_missing = {5710, 5774, 5711, 6174, 6074}
        
        print(f"\nTesting known problematic hadith:")
        async with httpx.AsyncClient(timeout=30.0) as client:
            for num in sorted(known_missing):
                exists = await check_hadith_exists(client, num)
                status = "EXISTS" if exists else "404/MISSING"
                print(f"  Hadith {num}: {status}")
                
                if exists and num in missing:
                    print(f"    ⚠️  Actually exists but missing from our data!")
        
        # Sample test some random missing numbers if any
        if missing:
            sample_missing = sorted(list(missing))[:5]  # Test first 5 missing
            print(f"\nTesting sample missing hadith:")
            async with httpx.AsyncClient(timeout=30.0) as client:
                for num in sample_missing:
                    exists = await check_hadith_exists(client, num)
                    status = "EXISTS" if exists else "404/MISSING"
                    print(f"  Hadith {num}: {status}")
                    
                    if exists:
                        print(f"    ⚠️  Hadith {num} exists but was missing from our data!")
    
    else:
        print("No data file found")

if __name__ == "__main__":
    asyncio.run(main())
