from supabase import create_client
import sys

supabase_url = "https://pmgxaqpxlahnqwxrweyn.supabase.co"
supabase_key = "sb_publishable_KZOAFH_vABRgia_v2OBeWQ_uYurB14k"

supabase = create_client(supabase_url, supabase_key)

print("=" * 80)
print("SETTING UP SUPABASE FOR ZOUQLY")
print("=" * 80)

# Step 1: Create categories
print("\n[1/4] Creating categories...")
categories_data = [
    {"name": "Cashews", "description": "Premium cashews"},
    {"name": "Almonds", "description": "Organic almonds"},
    {"name": "Raisins", "description": "Golden raisins"},
    {"name": "Mix", "description": "Mixed dry fruits"}
]

try:
    categories_response = supabase.table("categories").insert(categories_data).execute()
    categories = categories_response.data
    print(f"✓ Created {len(categories)} categories")
except Exception as e:
    print(f"✗ Error creating categories: {str(e)}")
    if "relation" in str(e).lower() or "does not exist" in str(e).lower():
        print("\n⚠️  Tables don't exist yet!")
        print("\nOption 1: I need the SERVICE ROLE KEY (not publishable key) to create tables")
        print("  - Go to: https://supabase.com/dashboard/project/pmgxaqpxlahnqwxrweyn/settings/api")
        print("  - Copy the 'service_role' key (NOT the publishable key)")
        print("  - Provide it to me")
        print("\nOption 2: You can manually run the SQL in Supabase SQL Editor")
        print("  - Go to: https://supabase.com/dashboard/project/pmgxaqpxlahnqwxrweyn/sql")
        print("  - Run the SQL from /app/SUPABASE_SETUP_GUIDE.md")
        sys.exit(1)
    sys.exit(1)

# Step 2: Create products
print("\n[2/4] Creating products...")
products_data = [
    {
        "name": "Premium Cashews",
        "weight": "250g",
        "price": 299.00,
        "description": "Handpicked premium quality cashews, perfectly roasted for maximum flavor.",
        "features": ["100% Natural", "Rich in Protein", "Heart Healthy", "Premium Quality"],
        "category_id": categories[0]["id"],
        "tags": ["bestseller"],
        "image_url": "https://images.pexels.com/photos/7292895/pexels-photo-7292895.jpeg",
        "stock": 100
    },
    {
        "name": "Organic Almonds",
        "weight": "500g",
        "price": 449.00,
        "description": "Organic almonds sourced from the finest farms.",
        "features": ["Organic", "Rich in Vitamin E", "High Fiber", "Antioxidant Rich"],
        "category_id": categories[1]["id"],
        "tags": ["trending", "bestseller"],
        "image_url": "https://images.pexels.com/photos/5002442/pexels-photo-5002442.jpeg",
        "stock": 80
    },
    {
        "name": "Golden Raisins",
        "weight": "200g",
        "price": 149.00,
        "description": "Sweet and juicy golden raisins perfect for snacking.",
        "features": ["Natural Sweetness", "Energy Boost", "Rich in Iron", "No Added Sugar"],
        "category_id": categories[2]["id"],
        "tags": [],
        "image_url": "https://images.pexels.com/photos/6085951/pexels-photo-6085951.jpeg",
        "stock": 120
    },
    {
        "name": "Premium Mix",
        "weight": "300g",
        "price": 399.00,
        "description": "A perfect blend of almonds, cashews, and raisins.",
        "features": ["Variety Pack", "Balanced Nutrition", "Perfect for Gifting", "Premium Selection"],
        "category_id": categories[3]["id"],
        "tags": ["bestseller"],
        "image_url": "https://images.pexels.com/photos/5505471/pexels-photo-5505471.jpeg",
        "stock": 50
    }
]

try:
    products_response = supabase.table("products").insert(products_data).execute()
    print(f"✓ Created {len(products_response.data)} products")
except Exception as e:
    print(f"✗ Error creating products: {str(e)}")
    sys.exit(1)

# Step 3: Create testimonials
print("\n[3/4] Creating testimonials...")
testimonials_data = [
    {
        "name": "Priya Sharma",
        "rating": 5,
        "comment": "The quality of dry fruits is exceptional! Fresh and perfectly packed."
    },
    {
        "name": "Rajesh Kumar",
        "rating": 5,
        "comment": "Best dry fruits I've ever bought. Will definitely order again!"
    },
    {
        "name": "Anjali Mehta",
        "rating": 4,
        "comment": "Great taste and quality. Delivery was quick too."
    }
]

try:
    testimonials_response = supabase.table("testimonials").insert(testimonials_data).execute()
    print(f"✓ Created {len(testimonials_response.data)} testimonials")
except Exception as e:
    print(f"✗ Error creating testimonials: {str(e)}")
    sys.exit(1)

# Step 4: Check if we can access storage
print("\n[4/4] Checking storage bucket...")
try:
    buckets = supabase.storage.list_buckets()
    bucket_names = [b.name for b in buckets]
    if "product-images" in bucket_names:
        print("✓ Storage bucket 'product-images' exists")
    else:
        print("⚠️  Storage bucket 'product-images' doesn't exist")
        print("   Creating it requires service role key or manual creation")
except Exception as e:
    print(f"⚠️  Could not check storage: {str(e)}")

print("\n" + "=" * 80)
print("✅ SUPABASE SETUP COMPLETE!")
print("=" * 80)
print("\nData created:")
print(f"  • {len(categories)} categories")
print(f"  • {len(products_data)} products")
print(f"  • {len(testimonials_data)} testimonials")
print("\nNext steps:")
print("1. Test the website: https://premium-dry.preview.emergentagent.com")
print("2. Sign up to create users")
print("3. Add role='admin' in Supabase Auth user metadata for admin access")
print("\nEnjoy your Zouqly e-commerce site! 🎉")

