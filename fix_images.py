#!/usr/bin/env python3
"""
Fix Product Image Assignments
This script corrects the image mismatch issue where musical instruments
show food/herbal product images instead of instrument images.
"""

import requests
import json
from collections import defaultdict

# Configuration
API_BASE = "http://localhost:2004/api/v1"

def get_categories():
    """Get all categories"""
    response = requests.get(f"{API_BASE}/category/get-category-list")
    return response.json().get('category', [])

def get_products_by_category(category_id):
    """Get products for a specific category"""
    response = requests.get(f"{API_BASE}/product/search?category={category_id}&take=100&page=1")
    return response.json().get('products', [])

def analyze_current_assignments():
    """Analyze current image assignments"""
    response = requests.get(f"{API_BASE}/product/search?take=200&page=1")
    products = response.json().get('products', [])

    # Group by image
    image_usage = defaultdict(list)
    category_images = {}

    # Get category images
    categories = get_categories()
    for cat in categories:
        if 'avatar' in cat:
            category_images[cat['_id']] = cat['avatar']

    # Analyze products
    for product in products:
        media = product.get('media', {})
        if isinstance(media, dict) and 'name' in media:
            image_name = media['name']
            category_id = product.get('category')
            category_name = 'Unknown'
            for cat in categories:
                if cat['_id'] == category_id:
                    category_name = cat['name']
                    break

            image_usage[image_name].append({
                'title': product['title'],
                'category': category_name,
                'category_id': category_id
            })

    return image_usage, category_images, categories

def generate_fix_report():
    """Generate a report of what needs to be fixed"""
    image_usage, category_images, categories = analyze_current_assignments()

    print("📊 CURRENT IMAGE ASSIGNMENT ANALYSIS")
    print("=" * 50)

    # Find problematic assignments
    issues_found = []

    for image_name, products in image_usage.items():
        if len(products) > 1:
            categories_for_image = set(p['category'] for p in products)
            if len(categories_for_image) > 1:
                print(f"\n🚨 ISSUE: Image '{image_name}' used across multiple categories:")
                for p in products:
                    print(f"   • {p['title']} (Category: {p['category']})")
                issues_found.append((image_name, products))

    print(f"\n📈 SUMMARY:")
    print(f"   • Total unique images: {len(image_usage)}")
    print(f"   • Images with cross-category usage: {len(issues_found)}")
    print(f"   • Available category avatars: {len([img for img in category_images.values() if img != 'no-avatar'])}")

    # Suggest fixes
    print(f"\n💡 RECOMMENDED FIXES:")
    print(f"1. Assign category-specific images to products")
    print(f"2. Use category avatar images for products in that category")
    print(f"3. Upload proper images for each product category")
    print(f"4. Update database to correct image assignments")

    return issues_found, category_images

def create_fix_commands(issues_found, category_images):
    """Create commands to fix the issues"""
    print(f"\n🔧 FIX COMMANDS GENERATED:")
    print("=" * 30)

    # Example fix commands
    print("# Example MongoDB commands to fix image assignments:")
    print("# Run these in mongo shell or create a script")

    for image_name, products in issues_found[:3]:  # Show first 3 examples
        print(f"\n# Fix for image: {image_name}")
        for product in products:
            category_id = product['category_id']
            if category_id in category_images:
                correct_image = category_images[category_id]
                print(f"# Update {product['title']}:")
                print(f"db.products.updateOne(")
                print(f"  {{title: '{product['title']}'}},")
                print(f"  {{$set: {{'media.0.name': '{correct_image}'}}}}")
                print(f")")
        print()

if __name__ == "__main__":
    issues, category_images = generate_fix_report()
    create_fix_commands(issues, category_images)
