import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime, timezone

async def setup_data():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["zouqly_db"]
    
    # Clear existing data
    await db.categories.delete_many({})
    await db.products.delete_many({})
    await db.testimonials.delete_many({})
    
    # Create categories
    categories = [
        {"id": str(uuid.uuid4()), "name": "Cashews", "description": "Premium cashews", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Almonds", "description": "Organic almonds", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Raisins", "description": "Golden raisins", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Mix", "description": "Mixed dry fruits", "created_at": datetime.now(timezone.utc).isoformat()}
    ]
    await db.categories.insert_many(categories)
    print(f"Created {len(categories)} categories")
    
    # Create products
    products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Premium Cashews",
            "weight": "250g",
            "price": 299.00,
            "description": "Handpicked premium quality cashews, perfectly roasted for maximum flavor.",
            "features": ["100% Natural", "Rich in Protein", "Heart Healthy", "Premium Quality"],
            "category_id": categories[0]["id"],
            "tags": ["bestseller"],
            "image_url": "https://images.pexels.com/photos/7292895/pexels-photo-7292895.jpeg",
            "stock": 100,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Organic Almonds",
            "weight": "500g",
            "price": 449.00,
            "description": "Organic almonds sourced from the finest farms.",
            "features": ["Organic", "Rich in Vitamin E", "High Fiber", "Antioxidant Rich"],
            "category_id": categories[1]["id"],
            "tags": ["trending", "bestseller"],
            "image_url": "https://images.pexels.com/photos/5002442/pexels-photo-5002442.jpeg",
            "stock": 80,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Golden Raisins",
            "weight": "200g",
            "price": 149.00,
            "description": "Sweet and juicy golden raisins perfect for snacking.",
            "features": ["Natural Sweetness", "Energy Boost", "Rich in Iron", "No Added Sugar"],
            "category_id": categories[2]["id"],
            "tags": [],
            "image_url": "https://images.pexels.com/photos/6085951/pexels-photo-6085951.jpeg",
            "stock": 120,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Premium Mix",
            "weight": "300g",
            "price": 399.00,
            "description": "A perfect blend of almonds, cashews, and raisins.",
            "features": ["Variety Pack", "Balanced Nutrition", "Perfect for Gifting", "Premium Selection"],
            "category_id": categories[3]["id"],
            "tags": ["bestseller"],
            "image_url": "https://images.pexels.com/photos/5505471/pexels-photo-5505471.jpeg",
            "stock": 50,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.products.insert_many(products)
    print(f"Created {len(products)} products")
    
    # Create testimonials
    testimonials = [
        {
            "id": str(uuid.uuid4()),
            "name": "Priya Sharma",
            "rating": 5,
            "comment": "The quality of dry fruits is exceptional! Fresh and perfectly packed.",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Rajesh Kumar",
            "rating": 5,
            "comment": "Best dry fruits I've ever bought. Will definitely order again!",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Anjali Mehta",
            "rating": 4,
            "comment": "Great taste and quality. Delivery was quick too.",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.testimonials.insert_many(testimonials)
    print(f"Created {len(testimonials)} testimonials")
    
    client.close()
    print("Initial data setup complete!")

if __name__ == "__main__":
    asyncio.run(setup_data())
