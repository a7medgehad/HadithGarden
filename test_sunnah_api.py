#!/usr/bin/env python3
"""
Test the Sunnah.com API to understand the structure and endpoints
"""

import requests
import json

def test_sunnah_api():
    """Test various Sunnah.com API endpoints"""
    
    print("Testing Sunnah.com API endpoints...")
    
    # Test base API endpoint
    base_url = "https://api.sunnah.com/v1"
    
    # Try to get collections
    try:
        print("\n=== Testing Collections Endpoint ===")
        response = requests.get(f"{base_url}/collections")
        if response.status_code == 200:
            data = response.json()
            print(f"Collections response: {json.dumps(data, indent=2)[:500]}...")
        else:
            print(f"Collections failed: {response.status_code}")
            print(response.text[:200])
    except Exception as e:
        print(f"Collections error: {e}")
    
    # Try to get books
    try:
        print("\n=== Testing Books Endpoint ===")
        response = requests.get(f"{base_url}/books")
        if response.status_code == 200:
            data = response.json()
            print(f"Books response: {json.dumps(data, indent=2)[:500]}...")
        else:
            print(f"Books failed: {response.status_code}")
            print(response.text[:200])
    except Exception as e:
        print(f"Books error: {e}")
    
    # Try to get Riyad as-Salihin specifically
    try:
        print("\n=== Testing Riyad as-Salihin Endpoint ===")
        # Common possible endpoints for Riyad as-Salihin
        endpoints = [
            f"{base_url}/books/riyadussalihin",
            f"{base_url}/books/riyad-as-salihin",
            f"{base_url}/collections/riyadussalihin",
            f"{base_url}/hadiths/riyadussalihin",
            "https://api.sunnah.com/collections/riyadussalihin/hadiths"
        ]
        
        for endpoint in endpoints:
            try:
                response = requests.get(endpoint)
                print(f"{endpoint}: {response.status_code}")
                if response.status_code == 200:
                    data = response.json()
                    print(f"Success! First 300 chars: {json.dumps(data, indent=2)[:300]}...")
                    break
                elif response.status_code != 404:
                    print(f"Response: {response.text[:100]}")
            except Exception as e:
                print(f"{endpoint}: Error - {e}")
                
    except Exception as e:
        print(f"Riyad as-Salihin error: {e}")
    
    # Try alternative API patterns
    try:
        print("\n=== Testing Alternative Patterns ===")
        alt_endpoints = [
            "https://sunnah.com/api/v1/collections",
            "https://sunnah.com/api/collections",
            "https://api.hadithapi.com/books/riyadus-saliheen",
        ]
        
        for endpoint in alt_endpoints:
            try:
                response = requests.get(endpoint)
                print(f"{endpoint}: {response.status_code}")
                if response.status_code == 200:
                    data = response.json()
                    print(f"Success! First 300 chars: {json.dumps(data, indent=2)[:300]}...")
            except Exception as e:
                print(f"{endpoint}: Error - {e}")
                
    except Exception as e:
        print(f"Alternative patterns error: {e}")

if __name__ == "__main__":
    test_sunnah_api()