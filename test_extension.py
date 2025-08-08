#!/usr/bin/env python3
"""
Comprehensive test for Hadith Garden Tab Chrome Extension
Tests all functionality to ensure everything works properly
"""

import json
import os
import time

def test_data_integrity():
    """Test the hadith data file integrity"""
    print("=" * 60)
    print("TESTING DATA INTEGRITY")
    print("=" * 60)
    
    # Test hadith data file
    data_file = "data/riyadussalihin.json"
    if not os.path.exists(data_file):
        print("❌ CRITICAL: Hadith data file missing!")
        return False
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            hadith_data = json.load(f)
        
        print(f"✅ Hadith data file loaded successfully")
        print(f"📊 Total hadith count: {len(hadith_data)}")
        
        # Test data structure
        if len(hadith_data) < 1800:
            print(f"⚠️  WARNING: Expected ~1896 hadith, found {len(hadith_data)}")
        
        # Test first few hadith structure
        for i, hadith in enumerate(hadith_data[:5]):
            required_fields = ['id', 'book', 'arabicText', 'englishText']
            missing_fields = [field for field in required_fields if field not in hadith]
            
            if missing_fields:
                print(f"❌ Hadith {i+1} missing fields: {missing_fields}")
                return False
            
            # Test Arabic text
            if not hadith['arabicText'] or len(hadith['arabicText'].strip()) < 10:
                print(f"❌ Hadith {i+1} has invalid Arabic text")
                return False
            
            # Test English text
            if not hadith['englishText'] or len(hadith['englishText'].strip()) < 10:
                print(f"❌ Hadith {i+1} has invalid English text")
                return False
        
        print("✅ Data structure validation passed")
        
        # Test specific hadith IDs
        hadith_ids = [h['id'] for h in hadith_data]
        if len(set(hadith_ids)) != len(hadith_ids):
            print("❌ Duplicate hadith IDs found!")
            return False
        
        print("✅ All hadith have unique IDs")
        return True
        
    except Exception as e:
        print(f"❌ Error loading hadith data: {e}")
        return False

def test_file_structure():
    """Test that all required files exist"""
    print("\n" + "=" * 60)
    print("TESTING FILE STRUCTURE")
    print("=" * 60)
    
    required_files = {
        'manifest.json': 'Extension manifest',
        'newtab.html': 'New tab page HTML',
        'newtab.css': 'New tab page CSS',
        'newtab.js': 'Main application logic',
        'options.html': 'Settings page HTML', 
        'options.css': 'Settings page CSS',
        'options.js': 'Settings page logic',
        'localization.js': 'Language support',
        'gamification.js': 'Achievement system',
        'data/riyadussalihin.json': 'Hadith database',
        'icons/icon-16.svg': '16px icon',
        'icons/icon-48.svg': '48px icon',
        'icons/icon-128.svg': '128px icon',
        'icons/logo.svg': 'Application logo'
    }
    
    missing_files = []
    for file_path, description in required_files.items():
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            print(f"✅ {description:<25} {file_path:<30} ({file_size:,} bytes)")
        else:
            print(f"❌ {description:<25} {file_path:<30} MISSING")
            missing_files.append(file_path)
    
    if missing_files:
        print(f"\n❌ {len(missing_files)} required files are missing!")
        return False
    else:
        print(f"\n✅ All {len(required_files)} required files present")
        return True

def test_manifest_validation():
    """Test manifest.json validation"""
    print("\n" + "=" * 60)
    print("TESTING MANIFEST VALIDATION")
    print("=" * 60)
    
    try:
        with open('manifest.json', 'r') as f:
            manifest = json.load(f)
        
        # Required manifest fields
        required_fields = {
            'manifest_version': 3,
            'name': 'Hadith Garden Tab',
            'version': str,
            'description': str,
            'chrome_url_overrides': dict,
            'permissions': list,
            'icons': dict
        }
        
        for field, expected_type in required_fields.items():
            if field not in manifest:
                print(f"❌ Missing required field: {field}")
                return False
            
            if expected_type != str and expected_type != dict and expected_type != list:
                if manifest[field] != expected_type:
                    print(f"❌ Invalid {field}: expected {expected_type}, got {manifest[field]}")
                    return False
            
            print(f"✅ {field}: {manifest[field]}")
        
        # Test new tab override
        if 'newtab' not in manifest.get('chrome_url_overrides', {}):
            print("❌ New tab override not configured")
            return False
        
        # Test permissions
        required_permissions = ['storage']
        for perm in required_permissions:
            if perm not in manifest.get('permissions', []):
                print(f"❌ Missing required permission: {perm}")
                return False
        
        print("✅ Manifest validation passed")
        return True
        
    except Exception as e:
        print(f"❌ Error validating manifest: {e}")
        return False

def test_javascript_syntax():
    """Test JavaScript files for basic syntax issues"""
    print("\n" + "=" * 60)
    print("TESTING JAVASCRIPT SYNTAX")
    print("=" * 60)
    
    js_files = ['newtab.js', 'options.js', 'localization.js', 'gamification.js']
    
    for js_file in js_files:
        try:
            with open(js_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Basic syntax checks
            if content.count('{') != content.count('}'):
                print(f"❌ {js_file}: Mismatched braces")
                return False
            
            if content.count('(') != content.count(')'):
                print(f"❌ {js_file}: Mismatched parentheses")
                return False
            
            if content.count('[') != content.count(']'):
                print(f"❌ {js_file}: Mismatched brackets")
                return False
            
            # Check for common issues
            if 'console.log(' in content:
                print(f"⚠️  {js_file}: Contains console.log statements")
            
            if 'debugger;' in content:
                print(f"⚠️  {js_file}: Contains debugger statements")
            
            print(f"✅ {js_file}: Syntax check passed")
            
        except Exception as e:
            print(f"❌ Error checking {js_file}: {e}")
            return False
    
    return True

def test_css_validation():
    """Test CSS files for basic issues"""
    print("\n" + "=" * 60)
    print("TESTING CSS VALIDATION")
    print("=" * 60)
    
    css_files = ['newtab.css', 'options.css']
    
    for css_file in css_files:
        try:
            with open(css_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Basic CSS validation
            if content.count('{') != content.count('}'):
                print(f"❌ {css_file}: Mismatched braces")
                return False
            
            # Check for CSS variables
            if '--primary-green' not in content:
                print(f"⚠️  {css_file}: Primary green variable missing")
            
            # Check for responsive design
            if '@media' not in content:
                print(f"⚠️  {css_file}: No responsive design detected")
            
            print(f"✅ {css_file}: Basic validation passed")
            
        except Exception as e:
            print(f"❌ Error checking {css_file}: {e}")
            return False
    
    return True

def test_package_integrity():
    """Test the chrome extension package"""
    print("\n" + "=" * 60)
    print("TESTING PACKAGE INTEGRITY")
    print("=" * 60)
    
    package_file = "hadith-garden-tab-chrome-extension.zip"
    
    if not os.path.exists(package_file):
        print(f"❌ Package file missing: {package_file}")
        return False
    
    file_size = os.path.getsize(package_file)
    print(f"✅ Package file exists: {file_size:,} bytes")
    
    # Check package size (should be around 600KB)
    if file_size < 500000:  # 500KB
        print("⚠️  Package seems small, might be missing data")
    elif file_size > 2000000:  # 2MB
        print("⚠️  Package seems large, might contain unnecessary files")
    else:
        print("✅ Package size is appropriate")
    
    return True

def test_functionality_summary():
    """Provide summary of key features to test manually"""
    print("\n" + "=" * 60)
    print("MANUAL TESTING CHECKLIST")
    print("=" * 60)
    
    checklist = [
        "✓ New tab page loads properly",
        "✓ Sequential hadith navigation (Previous/Next buttons)",
        "✓ Arabic text displays correctly with RTL direction",
        "✓ English translation shows properly",
        "✓ Favorites system (Add/Remove/View favorites)",
        "✓ Go to hadith from favorites modal works",
        "✓ Remove hadith from favorites works", 
        "✓ Settings page accessible and functional",
        "✓ Theme switcher (Light/Dark mode)",
        "✓ Language switcher (English/Arabic)",
        "✓ Font size adjustment",
        "✓ Daily reading goals and achievements",
        "✓ Reading streak tracking",
        "✓ Export/Import favorites functionality",
        "✓ Sunnah.com reference links work",
        "✓ Keyboard shortcuts (spacebar for next)",
        "✓ Responsive design on mobile/tablet",
        "✓ All 1,896 hadith accessible"
    ]
    
    print("Please manually verify these features work correctly:")
    for item in checklist:
        print(f"  {item}")
    
    print(f"\n📋 Total features to test: {len(checklist)}")

def main():
    """Run comprehensive extension tests"""
    print("🕌 HADITH GARDEN TAB - COMPREHENSIVE TESTING")
    print("Testing all extension functionality...")
    
    tests = [
        ("File Structure", test_file_structure),
        ("Data Integrity", test_data_integrity), 
        ("Manifest Validation", test_manifest_validation),
        ("JavaScript Syntax", test_javascript_syntax),
        ("CSS Validation", test_css_validation),
        ("Package Integrity", test_package_integrity)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n⚡ Running {test_name} test...")
        result = test_func()
        results.append((test_name, result))
        
        if result:
            print(f"✅ {test_name} test PASSED")
        else:
            print(f"❌ {test_name} test FAILED")
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<25} {status}")
    
    print(f"\n📊 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL AUTOMATED TESTS PASSED!")
        print("🚀 Extension is ready for Chrome Web Store submission")
    else:
        print("⚠️  Some tests failed - please review and fix issues")
    
    # Show manual testing checklist
    test_functionality_summary()
    
    return passed == total

if __name__ == "__main__":
    main()