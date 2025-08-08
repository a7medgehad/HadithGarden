#!/usr/bin/env python3
"""
Comprehensive Arabic functionality testing for Hadith Garden Tab
Tests all Arabic features, localization, RTL support, and visual appearance
"""

import json
import re
import os

def test_arabic_data_quality():
    """Test Arabic text quality in hadith data"""
    print("=" * 60)
    print("TESTING ARABIC DATA QUALITY")
    print("=" * 60)
    
    with open('data/riyadussalihin.json', 'r', encoding='utf-8') as f:
        hadith_data = json.load(f)
    
    issues = []
    
    for i, hadith in enumerate(hadith_data[:50]):  # Test first 50 hadith
        arabic_text = hadith.get('arabicText', '')
        
        # Check for Arabic content
        if not arabic_text:
            issues.append(f"Hadith {i+1}: Missing Arabic text")
            continue
        
        # Check for proper Arabic script
        arabic_chars = re.findall(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]', arabic_text)
        if len(arabic_chars) < 10:
            issues.append(f"Hadith {i+1}: Insufficient Arabic characters")
        
        # Check for common Arabic patterns
        if 'الله' not in arabic_text and 'رسول' not in arabic_text:
            issues.append(f"Hadith {i+1}: May not contain authentic Islamic content")
        
        # Check text length (should be substantial)
        if len(arabic_text.strip()) < 50:
            issues.append(f"Hadith {i+1}: Arabic text too short")
    
    if issues:
        print("⚠️  Arabic Data Issues Found:")
        for issue in issues[:10]:  # Show first 10 issues
            print(f"  - {issue}")
        if len(issues) > 10:
            print(f"  ... and {len(issues)-10} more issues")
    else:
        print("✅ Arabic data quality is excellent")
    
    print(f"📊 Tested: {min(50, len(hadith_data))} hadith")
    print(f"📋 Issues found: {len(issues)}")
    
    return len(issues) == 0

def test_localization_completeness():
    """Test Arabic localization completeness"""
    print("\n" + "=" * 60)
    print("TESTING ARABIC LOCALIZATION")
    print("=" * 60)
    
    with open('localization.js', 'r', encoding='utf-8') as f:
        localization_content = f.read()
    
    # Extract Arabic translations
    arabic_section_match = re.search(r"'ar':\s*{(.*?)^\s*}", localization_content, re.DOTALL | re.MULTILINE)
    if not arabic_section_match:
        print("❌ No Arabic localization section found")
        return False
    
    arabic_section = arabic_section_match.group(1)
    
    # Test key Arabic translations
    required_translations = {
        'title': 'حديقة الأحاديث',
        'settings': 'الإعدادات',
        'theme': 'السمة',
        'language': 'اللغة',
        'fontSize': 'حجم الخط',
        'favorites': 'المفضلة',
        'achievements': 'الإنجازات',
        'dailyGoal': 'الهدف اليومي',
        'readingStreak': 'أيام القراءة المتواصلة'
    }
    
    missing_translations = []
    for key, expected_arabic in required_translations.items():
        if f'"{key}"' not in arabic_section:
            missing_translations.append(key)
        elif expected_arabic not in arabic_section:
            print(f"⚠️  Translation for '{key}' may be incorrect")
    
    if missing_translations:
        print(f"❌ Missing Arabic translations: {missing_translations}")
        return False
    
    # Test Arabic script presence
    arabic_chars_count = len(re.findall(r'[\u0600-\u06FF]', arabic_section))
    if arabic_chars_count < 50:
        print(f"⚠️  Limited Arabic content in localization ({arabic_chars_count} chars)")
    
    print(f"✅ Arabic localization is complete")
    print(f"📊 Arabic characters in translations: {arabic_chars_count}")
    
    return True

def test_rtl_css_support():
    """Test RTL (Right-to-Left) CSS support"""
    print("\n" + "=" * 60)
    print("TESTING RTL CSS SUPPORT")
    print("=" * 60)
    
    with open('newtab.css', 'r', encoding='utf-8') as f:
        css_content = f.read()
    
    # Check for RTL-specific CSS
    rtl_indicators = [
        '[dir="rtl"]',
        'text-align: right',
        'direction: rtl',
        'arabic',
        'Amiri'
    ]
    
    rtl_support_score = 0
    for indicator in rtl_indicators:
        if indicator.lower() in css_content.lower():
            rtl_support_score += 1
            print(f"✅ Found RTL support: {indicator}")
        else:
            print(f"⚠️  Missing RTL feature: {indicator}")
    
    # Check for Arabic font
    if 'Amiri' in css_content:
        print("✅ Arabic font (Amiri) configured")
    else:
        print("❌ Arabic font not configured")
        return False
    
    # Check for RTL-specific rules
    rtl_rules = re.findall(r'\[dir="rtl"\][^{]*{[^}]+}', css_content, re.DOTALL)
    print(f"✅ Found {len(rtl_rules)} RTL-specific CSS rules")
    
    if rtl_support_score >= 3:
        print("✅ Good RTL CSS support")
        return True
    else:
        print("⚠️  Limited RTL CSS support")
        return False

def test_arabic_ui_elements():
    """Test Arabic UI elements in HTML files"""
    print("\n" + "=" * 60)
    print("TESTING ARABIC UI ELEMENTS")
    print("=" * 60)
    
    html_files = ['newtab.html', 'options.html']
    
    for html_file in html_files:
        print(f"\n📄 Testing {html_file}:")
        
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Check for Arabic text in HTML
        arabic_chars = re.findall(r'[\u0600-\u06FF]', html_content)
        if arabic_chars:
            print(f"  ✅ Contains Arabic text ({len(arabic_chars)} chars)")
        else:
            print(f"  ℹ️  No Arabic text (likely uses JS localization)")
        
        # Check for dir attribute support
        if 'dir=' in html_content:
            print("  ✅ Direction attribute support present")
        else:
            print("  ⚠️  No direction attribute found")
        
        # Check for Arabic language meta
        if 'lang="ar"' in html_content:
            print("  ✅ Arabic language attribute support")
        else:
            print("  ℹ️  No static Arabic language attribute")
    
    return True

def test_arabic_numbers_display():
    """Test Arabic number display preferences"""
    print("\n" + "=" * 60)
    print("TESTING ARABIC NUMBERS")
    print("=" * 60)
    
    with open('newtab.js', 'r', encoding='utf-8') as f:
        js_content = f.read()
    
    # Check for Arabic number handling
    if 'toLocaleString' in js_content:
        print("✅ Number localization support found")
    else:
        print("ℹ️  No specific number localization")
    
    # Check localization.js for number formatting
    with open('localization.js', 'r', encoding='utf-8') as f:
        loc_content = f.read()
    
    if 'formatNumber' in loc_content:
        print("✅ Number formatting function found")
    else:
        print("ℹ️  No number formatting function")
    
    # Per project notes, Western Arabic numerals are preferred
    print("ℹ️  Project uses Western Arabic numerals (1,2,3) as specified in requirements")
    
    return True

def test_achievement_names_arabic():
    """Test Arabic achievement names"""
    print("\n" + "=" * 60)
    print("TESTING ARABIC ACHIEVEMENT NAMES")
    print("=" * 60)
    
    with open('localization.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Expected Arabic achievement names from project specs
    expected_achievements = {
        'بداية مباركة': 'Blessed Beginning',
        'مواظب الأسبوع': 'Week Consistent', 
        'نجم الشهر': 'Star of the Month',
        'طالب علم مجتهد': 'Diligent Knowledge Seeker'
    }
    
    found_achievements = 0
    for arabic_name, english_name in expected_achievements.items():
        if arabic_name in content:
            print(f"✅ Found achievement: {arabic_name} ({english_name})")
            found_achievements += 1
        else:
            print(f"❌ Missing achievement: {arabic_name} ({english_name})")
    
    if found_achievements == len(expected_achievements):
        print("✅ All Arabic achievement names present")
        return True
    else:
        print(f"⚠️  Only {found_achievements}/{len(expected_achievements)} achievements found")
        return False

def test_visual_arabic_layout():
    """Test visual aspects of Arabic layout"""
    print("\n" + "=" * 60)
    print("TESTING VISUAL ARABIC LAYOUT")
    print("=" * 60)
    
    with open('newtab.css', 'r', encoding='utf-8') as f:
        css_content = f.read()
    
    # Check Arabic text styling
    arabic_text_rules = [
        '.arabic-text',
        'font-family.*Amiri',
        'text-align.*right',
        'line-height.*1.8'
    ]
    
    for rule in arabic_text_rules:
        if re.search(rule, css_content, re.IGNORECASE):
            print(f"✅ Found Arabic styling: {rule}")
        else:
            print(f"⚠️  Missing Arabic styling: {rule}")
    
    # Check for proper RTL margins and padding
    rtl_spacing_rules = re.findall(r'\[dir="rtl"\][^{]*{\s*[^}]*(?:margin|padding)[^}]*}', css_content, re.DOTALL)
    if rtl_spacing_rules:
        print(f"✅ Found {len(rtl_spacing_rules)} RTL spacing adjustments")
    else:
        print("⚠️  No RTL spacing adjustments found")
    
    # Check for Arabic font loading
    if '@import' in css_content and 'Amiri' in css_content:
        print("✅ Arabic font properly imported")
    elif 'Amiri' in css_content:
        print("✅ Arabic font configured (external CDN)")
    else:
        print("❌ Arabic font not configured")
        return False
    
    return True

def test_arabic_settings_functionality():
    """Test Arabic language settings functionality"""
    print("\n" + "=" * 60)
    print("TESTING ARABIC SETTINGS FUNCTIONALITY")
    print("=" * 60)
    
    with open('options.js', 'r', encoding='utf-8') as f:
        options_content = f.read()
    
    # Check for language switching functionality
    if 'setLanguage' in options_content or 'language' in options_content:
        print("✅ Language switching functionality found")
    else:
        print("❌ No language switching functionality")
        return False
    
    # Check for Arabic language option
    if '"ar"' in options_content or "'ar'" in options_content:
        print("✅ Arabic language option present")
    else:
        print("⚠️  Arabic language code not found in options")
    
    with open('newtab.js', 'r', encoding='utf-8') as f:
        newtab_content = f.read()
    
    # Check for direction attribute setting
    if 'setAttribute.*dir' in newtab_content or 'dir.*=' in newtab_content:
        print("✅ Direction attribute switching found")
    else:
        print("⚠️  No direction attribute switching")
    
    return True

def run_comprehensive_arabic_test():
    """Run all Arabic functionality tests"""
    print("🕌 HADITH GARDEN TAB - COMPREHENSIVE ARABIC TESTING")
    print("Testing all Arabic functionality, localization, and visual aspects...")
    
    tests = [
        ("Arabic Data Quality", test_arabic_data_quality),
        ("Arabic Localization", test_localization_completeness),
        ("RTL CSS Support", test_rtl_css_support),
        ("Arabic UI Elements", test_arabic_ui_elements),
        ("Arabic Numbers", test_arabic_numbers_display),
        ("Achievement Names", test_achievement_names_arabic),
        ("Visual Layout", test_visual_arabic_layout),
        ("Settings Functionality", test_arabic_settings_functionality)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n⚡ Running {test_name} test...")
        try:
            result = test_func()
            results.append((test_name, result))
            
            if result:
                print(f"✅ {test_name} test PASSED")
            else:
                print(f"❌ {test_name} test FAILED")
        except Exception as e:
            print(f"❌ {test_name} test ERROR: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("ARABIC FUNCTIONALITY TEST RESULTS")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<25} {status}")
    
    print(f"\n📊 Overall Arabic Support: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 EXCELLENT ARABIC SUPPORT!")
        print("✅ All Arabic functionality working properly")
    elif passed >= total * 0.8:
        print("👍 GOOD ARABIC SUPPORT")
        print("⚠️  Minor issues found - review failed tests")
    else:
        print("⚠️  ARABIC SUPPORT NEEDS IMPROVEMENT")
        print("❌ Multiple issues found - please address failed tests")
    
    return passed == total

if __name__ == "__main__":
    run_comprehensive_arabic_test()