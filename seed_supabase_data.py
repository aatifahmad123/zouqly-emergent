from supabase import create_client

supabase_url = "https://pmgxaqpxlahnqwxrweyn.supabase.co"
supabase_key = "sb_publishable_KZOAFH_vABRgia_v2OBeWQ_uYurB14k"

supabase = create_client(supabase_url, supabase_key)

print("Seeding Supabase with initial data...")

# Create categories
categories_data = [
    {"name": "Cashews", "description": "Premium cashews"},
    {"name": "Almonds", "description": "Organic almonds"},
    {"name": "Raisins", "description": "Golden raisins"},
    {"name": "Mix", "description": "Mixed dry fruits"}
]

try:
    print("\n1. Creating categories...")
    categories_response = supabase.table("categories").insert(categories_data).execute()
    print(f"✓ Created {len(categories_response.data)} categories")
    categories = categories_response.data
    
    # Create products
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
    
    print("\n2. Creating products...")
    products_response = supabase.table("products").insert(products_data).execute()
    print(f"✓ Created {len(products_response.data)} products")
    
    # Create testimonials
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
    
    print("\n3. Creating testimonials...")
    testimonials_response = supabase.table("testimonials").insert(testimonials_data).execute()
    print(f"✓ Created {len(testimonials_response.data)} testimonials")
    
    print("\n✅ Initial data seeding complete!")
    print("\nNext steps:")
    print("1. Create admin user: Sign up at /signup with email and set role='admin' in Supabase Auth user metadata")
    print("2. Create regular user: Sign up at /signup (role defaults to 'user')")
    print("3. Test the application!")
    
except Exception as e:
    print(f"\n❌ Error seeding data: {str(e)}")
    print("\nMake sure you've run the SQL schema in Supabase SQL Editor first!")
    print("Go to: https://supabase.com/dashboard/project/pmgxaqpxlahnqwxrweyn/sql")

