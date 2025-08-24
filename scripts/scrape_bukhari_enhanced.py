#!/usr/bin/env python3
"""
Enhanced Sahih al-Bukhari Hadith Scraper
Fixes all data extraction issues:
- Proper book numbers (1-97)
- English and Arabic chapter names
- Correct chapter numbering within books
- Complete hadith coverage including missed ones
"""

import asyncio
import json
import random
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Set

import httpx
from bs4 import BeautifulSoup
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
    before_sleep_log
)
from tqdm.asyncio import tqdm
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scrape_bukhari_enhanced.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class EnhancedHadithParser:
    """Enhanced parser for hadith HTML pages from sunnah.com with complete metadata extraction"""
    
    @staticmethod
    def parse(html: str, url: str) -> Optional[Dict]:
        """Parse a single hadith page HTML into structured data with complete metadata"""
        try:
            soup = BeautifulSoup(html, 'lxml')
            
            # Extract hadith number from URL
            match = re.search(r'bukhari:(\d+)', url)
            if not match:
                logger.error(f"Could not extract hadith number from URL: {url}")
                return None
            hadith_number = int(match.group(1))
            
            # Get the main hadith container
            hadith_content = soup.find('div', class_='actualHadithContainer')
            if not hadith_content:
                logger.error(f"No hadith container found for {url}")
                return None
            
            # Extract Arabic text
            arabic_div = hadith_content.find('div', class_='arabic_hadith_full')
            arabic_text = ""
            if arabic_div:
                arabic_text = ' '.join(arabic_div.get_text(strip=True).split())
            
            # Extract English text  
            english_div = hadith_content.find('div', class_='text_details')
            english_text = ""
            if english_div:
                english_text = ' '.join(english_div.get_text(strip=True).split())
            
            # Extract book and chapter information from page title
            title_elem = soup.find('title')
            book_name_en = "Sahih al-Bukhari"
            book_name_ar = "صحيح البخاري"
            
            if title_elem:
                title_text = title_elem.get_text(strip=True)
                # Title format: "Sahih al-Bukhari 1 - Revelation - كتاب بدء الوحى - Sunnah.com..."
                title_parts = title_text.split(' - ')
                if len(title_parts) >= 3:
                    book_name_en = title_parts[1].strip()
                    book_name_ar = title_parts[2].strip()
            
            # Extract book number from reference information
            book_number = 1
            hadith_in_book = 1
            
            # Look for table-based reference (this is the correct structure)
            ref_table = soup.find('table', class_='hadith_reference')
            if ref_table:
                rows = ref_table.find_all('tr')
                for row in rows:
                    cells = row.find_all('td')
                    if len(cells) >= 2:
                        label = cells[0].get_text().strip()
                        value = cells[1].get_text().strip()
                        
                        if label == "In-book reference":
                            # Look for "Book X, Hadith Y" pattern
                            book_match = re.search(r'Book (\d+), Hadith (\d+)', value)
                            if book_match:
                                book_number = int(book_match.group(1))
                                hadith_in_book = int(book_match.group(2))
                                break
            
            # Extract chapter information
            chapter_title_en = ""
            chapter_title_ar = ""
            chapter_number = 0
            
            # English chapter
            english_chapter = soup.find('div', class_='englishchapter')
            if english_chapter:
                chapter_text = english_chapter.get_text(strip=True)
                # Remove "Chapter:" prefix if present
                chapter_title_en = re.sub(r'^Chapter:\s*', '', chapter_text)
            
            # Arabic chapter
            arabic_chapter = soup.find('div', class_='arabicchapter')
            if arabic_chapter:
                arabic_elem = arabic_chapter.find(class_='arabic')
                if arabic_elem:
                    chapter_title_ar = arabic_elem.get_text(strip=True)
            
            # Extract chapter number from combined chapter element
            combined_chapter = soup.find('div', class_='chapter')
            if combined_chapter:
                chapter_text = combined_chapter.get_text()
                # Look for pattern like "(1)Chapter:" or "(6)باب"
                chapter_num_match = re.search(r'\((\d+)\)', chapter_text)
                if chapter_num_match:
                    chapter_number = int(chapter_num_match.group(1))
            
            # Extract narrator information
            narrated_by = ""
            narrator_info = soup.find('div', class_='hadith_narrator')
            if narrator_info:
                narrated_by = narrator_info.get_text(strip=True)
            
            # Extract reference information
            reference = f"Sahih al-Bukhari {hadith_number}"
            if ref_table:
                # Find the main reference line from table
                rows = ref_table.find_all('tr')
                for row in rows:
                    cells = row.find_all('td')
                    if len(cells) >= 2:
                        label = cells[0].get_text().strip()
                        value = cells[1].get_text().strip()
                        
                        if label == "Reference":
                            reference = value.replace(': ', '').strip()
                            break
            
            # Construct the enhanced hadith object
            hadith_obj = {
                "id": hadith_number,
                "hadithNumber": hadith_number,
                "book": "Sahih al-Bukhari",
                "bookNumber": book_number,
                "bookNameEnglish": book_name_en,
                "bookNameArabic": book_name_ar,
                "chapter": chapter_title_en,
                "chapterArabic": chapter_title_ar,
                "chapterNumber": chapter_number,
                "hadithInBook": hadith_in_book,
                "arabicText": arabic_text,
                "englishText": english_text,
                "narratedBy": narrated_by,
                "reference": reference,
                "grading": "Sahih",
                "source": "sunnah.com",
                "collection": "sahih-bukhari",
                "url": url
            }
            
            # Validate required fields
            if not arabic_text and not english_text:
                logger.warning(f"No text content found for hadith {hadith_number}")
                return None
                
            return hadith_obj
            
        except Exception as e:
            logger.error(f"Error parsing hadith from {url}: {str(e)}")
            return None


class AsyncFetcher:
    """Async HTTP client with rate limiting and connection pooling"""
    
    def __init__(self, max_concurrent: int = 5, delay_range: tuple = (0.3, 0.6)):
        self.max_concurrent = max_concurrent
        self.delay_range = delay_range
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.client: Optional[httpx.AsyncClient] = None
        
    async def __aenter__(self):
        limits = httpx.Limits(
            max_keepalive_connections=10,
            max_connections=20,
            keepalive_expiry=30
        )
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        self.client = httpx.AsyncClient(
            limits=limits,
            headers=headers,
            timeout=httpx.Timeout(30.0, read=60.0),
            http2=True,
            follow_redirects=True
        )
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.client:
            await self.client.aclose()
    
    @retry(
        stop=stop_after_attempt(5),
        wait=wait_exponential(multiplier=1, min=1, max=32),
        retry=retry_if_exception_type((httpx.RequestError, httpx.HTTPStatusError)),
        before_sleep=before_sleep_log(logger, logging.WARNING)
    )
    async def fetch(self, url: str) -> Optional[str]:
        """Fetch a single URL with retries and rate limiting"""
        async with self.semaphore:
            try:
                delay = random.uniform(*self.delay_range)
                await asyncio.sleep(delay)
                
                response = await self.client.get(url)
                response.raise_for_status()
                
                return response.text
                
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    # Don't retry 404s, they're expected for missing hadith
                    raise
                logger.error(f"HTTP {e.response.status_code} for {url}")
                raise
            except httpx.RequestError as e:
                logger.error(f"Request error for {url}: {str(e)}")
                raise
            except Exception as e:
                logger.error(f"Unexpected error for {url}: {str(e)}")
                return None


class EnhancedBukhariScraper:
    """Enhanced scraper with complete data extraction and missing hadith recovery"""
    
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.data_dir = self.base_dir / "data"
        self.scripts_dir = self.base_dir / "scripts"
        self.data_dir.mkdir(exist_ok=True)
        
        self.output_file = self.data_dir / "sahih-bukhari.json"
        self.checkpoint_dir = self.scripts_dir / "checkpoints"
        self.checkpoint_dir.mkdir(exist_ok=True)
        self.failed_urls_file = self.scripts_dir / "failed_urls.json"
        
        self.run_timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.checkpoint_file = self.checkpoint_dir / f"enhanced_checkpoint_{self.run_timestamp}.jsonl"
        
        self.results: List[Dict] = []
        self.failed_urls: List[str] = []
        self.processed_count = 0
        
        # Load existing data to determine what needs re-scraping
        self.existing_data = self.load_existing_data()
        
    def load_existing_data(self) -> Dict[int, Dict]:
        """Load existing hadith data to identify what needs re-scraping"""
        existing = {}
        if self.output_file.exists():
            try:
                with open(self.output_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for hadith in data:
                        hadith_num = hadith.get('hadithNumber')
                        if hadith_num:
                            existing[hadith_num] = hadith
                logger.info(f"Loaded {len(existing)} existing hadith")
            except Exception as e:
                logger.error(f"Error loading existing data: {e}")
        return existing
    
    def identify_problematic_hadith(self) -> List[int]:
        """Identify hadith that need re-scraping due to missing/incorrect data"""
        problematic = []
        
        for hadith_num, hadith in self.existing_data.items():
            # Check for missing book number variety (all should not be book 1)
            if hadith.get('bookNumber') == 1 and hadith_num > 100:
                problematic.append(hadith_num)
            # Check for missing chapter names
            elif not hadith.get('chapter') or hadith.get('chapter') == "":
                problematic.append(hadith_num)
            # Check for missing chapter numbers
            elif hadith.get('chapterNumber', 0) == 0:
                problematic.append(hadith_num)
        
        return problematic
    
    def identify_missing_hadith(self) -> List[int]:
        """Identify hadith numbers that are completely missing"""
        existing_numbers = set(self.existing_data.keys())
        all_possible = set(range(1, 7564))  # 1 to 7563
        missing = all_possible - existing_numbers
        
        # Filter out known 404s that don't exist
        known_missing = {5710, 5774, 5711, 6174, 6074}
        missing = missing - known_missing
        
        return sorted(list(missing))
    
    def generate_urls_to_scrape(self) -> List[str]:
        """Generate URLs for hadith that need scraping/re-scraping"""
        # Get problematic hadith that need re-scraping
        problematic = self.identify_problematic_hadith()
        
        # Get missing hadith that need initial scraping
        missing = self.identify_missing_hadith()
        
        # Combine and sort
        to_scrape = sorted(set(problematic + missing))
        
        logger.info(f"Need to re-scrape {len(problematic)} problematic hadith")
        logger.info(f"Need to scrape {len(missing)} missing hadith")
        logger.info(f"Total URLs to process: {len(to_scrape)}")
        
        return [f"https://sunnah.com/bukhari:{i}" for i in to_scrape]
    
    def save_checkpoint(self, hadith_data: Dict):
        """Save incremental checkpoint"""
        with open(self.checkpoint_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(hadith_data, ensure_ascii=False) + '\n')
    
    async def process_url(self, url: str, fetcher: AsyncFetcher, pbar: tqdm) -> Optional[Dict]:
        """Process a single hadith URL with enhanced parsing"""
        try:
            html = await fetcher.fetch(url)
            if not html:
                self.failed_urls.append(url)
                pbar.update(1)
                return None
                
            hadith_data = EnhancedHadithParser.parse(html, url)
            if hadith_data:
                self.save_checkpoint(hadith_data)
                self.processed_count += 1
                
                # Update progress bar with current hadith number
                pbar.set_description(f"Scraping hadith {hadith_data.get('hadithNumber')} (Book {hadith_data.get('bookNumber')})")
                
            pbar.update(1)
            return hadith_data
            
        except Exception as e:
            logger.error(f"Error processing {url}: {str(e)}")
            self.failed_urls.append(url)
            pbar.update(1)
            return None
    
    def merge_results(self, new_results: List[Dict]) -> List[Dict]:
        """Merge new results with existing data"""
        # Create a map of new results by hadith number
        new_by_number = {h['hadithNumber']: h for h in new_results}
        
        # Update existing data with new results
        merged = dict(self.existing_data)
        merged.update(new_by_number)
        
        # Convert back to sorted list
        return sorted(merged.values(), key=lambda x: x.get('hadithNumber', 0))
    
    def validate_results(self, results: List[Dict]) -> bool:
        """Validate the enhanced results"""
        logger.info("Validating enhanced scraping results...")
        
        # Check book number distribution
        book_numbers = [h.get('bookNumber', 0) for h in results]
        unique_books = len(set(book_numbers))
        max_book = max(book_numbers) if book_numbers else 0
        
        logger.info(f"Book number range: 1 to {max_book}")
        logger.info(f"Unique books found: {unique_books}")
        
        if max_book < 50:  # Should have books up to 90+
            logger.warning(f"Expected more books, only found up to book {max_book}")
        
        # Check chapter completeness
        with_chapters = sum(1 for h in results if h.get('chapter') and h.get('chapter').strip())
        chapter_percentage = (with_chapters / len(results)) * 100 if results else 0
        
        logger.info(f"Hadith with chapter names: {with_chapters}/{len(results)} ({chapter_percentage:.1f}%)")
        
        if chapter_percentage < 80:
            logger.warning(f"Low chapter name coverage: {chapter_percentage:.1f}%")
        
        # Check for duplicates
        hadith_numbers = [h.get('hadithNumber', 0) for h in results]
        duplicates = len(hadith_numbers) - len(set(hadith_numbers))
        
        if duplicates > 0:
            logger.error(f"Found {duplicates} duplicate hadith numbers")
            return False
        
        # Sample validation
        sample_indices = random.sample(range(len(results)), min(5, len(results)))
        for idx in sample_indices:
            hadith = results[idx]
            hadith_num = hadith.get('hadithNumber')
            book_num = hadith.get('bookNumber')
            chapter = hadith.get('chapter', '')
            
            logger.info(f"Sample {hadith_num}: Book {book_num}, Chapter: '{chapter[:50]}...'")
            
            if not hadith.get('arabicText') and not hadith.get('englishText'):
                logger.error(f"Sample hadith {hadith_num} has no text content")
                return False
                
        logger.info(f"✅ Enhanced validation passed! {len(results)} hadith with improved metadata")
        return True
    
    async def run(self):
        """Main enhanced scraping orchestrator"""
        logger.info(f"🚀 Starting enhanced Sahih al-Bukhari scraper - Run ID: {self.run_timestamp}")
        start_time = datetime.now()
        
        # Generate URLs that need scraping/re-scraping
        urls_to_scrape = self.generate_urls_to_scrape()
        
        if not urls_to_scrape:
            logger.info("✅ All hadith are already properly scraped!")
            return
            
        logger.info(f"🔄 Starting enhanced parallel scraping of {len(urls_to_scrape)} URLs...")
        
        new_results = []
        async with AsyncFetcher(max_concurrent=5) as fetcher:
            with tqdm(total=len(urls_to_scrape), desc="Enhanced scraping", unit="hadith") as pbar:
                tasks = [
                    asyncio.create_task(self.process_url(url, fetcher, pbar))
                    for url in urls_to_scrape
                ]
                
                for coro in asyncio.as_completed(tasks):
                    result = await coro
                    if result:
                        new_results.append(result)
        
        # Handle failed URLs
        if self.failed_urls:
            logger.warning(f"⚠️ {len(self.failed_urls)} URLs failed (likely 404s for non-existent hadith)")
            with open(self.failed_urls_file, 'w') as f:
                json.dump(self.failed_urls, f, indent=2)
        
        # Merge with existing data
        final_results = self.merge_results(new_results)
        
        # Final processing
        elapsed = datetime.now() - start_time
        logger.info(f"⏱️ Enhanced scraping completed in {elapsed.total_seconds():.1f} seconds")
        logger.info(f"📊 Processed {len(new_results)} hadith (new/updated)")
        logger.info(f"📈 Final collection: {len(final_results)} total hadith")
        
        # Validate and save
        if self.validate_results(final_results):
            self.save_final_results(final_results)
            self.cleanup_checkpoints()
        else:
            logger.error("❌ Enhanced validation failed - check logs for issues")
            sys.exit(1)
    
    def save_final_results(self, results: List[Dict]):
        """Save final enhanced results to JSON"""
        logger.info("💾 Saving enhanced results...")
        
        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        file_size = self.output_file.stat().st_size / 1024 / 1024
        logger.info(f"✅ Enhanced results saved to {self.output_file} ({file_size:.1f} MB)")
    
    def cleanup_checkpoints(self):
        """Clean up checkpoint files after successful completion"""
        try:
            if self.checkpoint_file.exists():
                self.checkpoint_file.unlink()
            if self.failed_urls_file.exists():
                self.failed_urls_file.unlink()
            logger.info("🧹 Cleaned up temporary files")
        except Exception as e:
            logger.warning(f"Could not clean up checkpoint files: {str(e)}")


async def main():
    """Main entry point"""
    scraper = EnhancedBukhariScraper()
    await scraper.run()


if __name__ == "__main__":
    if sys.platform.startswith('win'):
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("\n⏹️ Enhanced scraping interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"💥 Fatal error: {str(e)}")
        sys.exit(1)
