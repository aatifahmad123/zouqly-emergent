from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT settings
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Create the main app
app = FastAPI(title="Zouqly API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: str = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    email: str
    role: str
    created_at: str

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class Category(CategoryBase):
    id: str
    created_at: str

class ProductBase(BaseModel):
    name: str
    weight: str
    price: float
    description: str
    features: List[str]
    category_id: str
    tags: List[str] = []
    image_url: Optional[str] = None
    stock: int = 0

class Product(ProductBase):
    id: str
    created_at: str

class OrderItemBase(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float

class OrderBase(BaseModel):
    items: List[OrderItemBase]
    total_amount: float
    payment_status: str = "Pending"
    delivery_status: str = "Order Placed"

class Order(OrderBase):
    id: str
    user_id: str
    user_email: str
    created_at: str

class TestimonialBase(BaseModel):
    name: str
    rating: int = Field(ge=1, le=5)
    comment: str

class Testimonial(TestimonialBase):
    id: str
    created_at: str

class ContentBase(BaseModel):
    page: str
    content: str

class Content(ContentBase):
    id: str
    updated_at: str

# Auth dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    token = credentials.credentials
    try:
        # Verify token with Supabase
        user = supabase.auth.get_user(token)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return {
            "id": user.user.id,
            "email": user.user.email,
            "role": user.user.user_metadata.get("role", "user")
        }
    except Exception as e:
        logger.error(f"Auth error: {str(e)}")
        raise HTTPException(status_code=401, detail="Authentication failed")

async def require_admin(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# Category routes
@api_router.get("/categories", response_model=List[Category])
async def list_categories():
    try:
        categories = await db.categories.find({}, {"_id": 0}).to_list(1000)
        return categories
    except Exception as e:
        logger.error(f"Error fetching categories: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch categories")

@api_router.post("/categories", response_model=Category)
async def create_category(category: CategoryBase, user: Dict = Depends(require_admin)):
    try:
        cat_dict = {
            "id": str(uuid.uuid4()),
            "name": category.name,
            "description": category.description,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.categories.insert_one(cat_dict)
        return cat_dict
    except Exception as e:
        logger.error(f"Error creating category: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create category")

@api_router.put("/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, category: CategoryBase, user: Dict = Depends(require_admin)):
    try:
        result = await db.categories.find_one_and_update(
            {"id": category_id},
            {"$set": category.model_dump()},
            return_document=True
        )
        if not result:
            raise HTTPException(status_code=404, detail="Category not found")
        result.pop("_id", None)
        return result
    except Exception as e:
        logger.error(f"Error updating category: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update category")

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, user: Dict = Depends(require_admin)):
    try:
        result = await db.categories.delete_one({"id": category_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Category not found")
        return {"message": "Category deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting category: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete category")

# Product routes
@api_router.get("/products", response_model=List[Product])
async def list_products(category_id: Optional[str] = None):
    try:
        query = {"category_id": category_id} if category_id else {}
        products = await db.products.find(query, {"_id": 0}).to_list(1000)
        return products
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch products")

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    try:
        product = await db.products.find_one({"id": product_id}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except Exception as e:
        logger.error(f"Error fetching product: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch product")

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductBase, user: Dict = Depends(require_admin)):
    try:
        prod_dict = {
            "id": str(uuid.uuid4()),
            **product.model_dump(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.products.insert_one(prod_dict)
        return prod_dict
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create product")

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductBase, user: Dict = Depends(require_admin)):
    try:
        result = await db.products.find_one_and_update(
            {"id": product_id},
            {"$set": product.model_dump()},
            return_document=True
        )
        if not result:
            raise HTTPException(status_code=404, detail="Product not found")
        result.pop("_id", None)
        return result
    except Exception as e:
        logger.error(f"Error updating product: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update product")

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, user: Dict = Depends(require_admin)):
    try:
        result = await db.products.delete_one({"id": product_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"message": "Product deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting product: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete product")

# Order routes
@api_router.get("/orders", response_model=List[Order])
async def list_orders(user: Dict = Depends(get_current_user)):
    try:
        if user["role"] == "admin":
            orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
        else:
            orders = await db.orders.find({"user_id": user["id"]}, {"_id": 0}).to_list(1000)
        return orders
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch orders")

@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderBase, user: Dict = Depends(get_current_user)):
    try:
        order_dict = {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "user_email": user["email"],
            **order.model_dump(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.orders.insert_one(order_dict)
        return order_dict
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create order")

@api_router.put("/orders/{order_id}")
async def update_order_status(
    order_id: str,
    payment_status: Optional[str] = None,
    delivery_status: Optional[str] = None,
    user: Dict = Depends(require_admin)
):
    try:
        update_fields = {}
        if payment_status:
            update_fields["payment_status"] = payment_status
        if delivery_status:
            update_fields["delivery_status"] = delivery_status
        
        result = await db.orders.find_one_and_update(
            {"id": order_id},
            {"$set": update_fields},
            return_document=True
        )
        if not result:
            raise HTTPException(status_code=404, detail="Order not found")
        result.pop("_id", None)
        return result
    except Exception as e:
        logger.error(f"Error updating order: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update order")

# Testimonials routes
@api_router.get("/testimonials", response_model=List[Testimonial])
async def list_testimonials():
    try:
        testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(1000)
        return testimonials
    except Exception as e:
        logger.error(f"Error fetching testimonials: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch testimonials")

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialBase, user: Dict = Depends(require_admin)):
    try:
        test_dict = {
            "id": str(uuid.uuid4()),
            **testimonial.model_dump(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.testimonials.insert_one(test_dict)
        return test_dict
    except Exception as e:
        logger.error(f"Error creating testimonial: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create testimonial")

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, user: Dict = Depends(require_admin)):
    try:
        result = await db.testimonials.delete_one({"id": testimonial_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        return {"message": "Testimonial deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting testimonial: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete testimonial")

# Content routes
@api_router.get("/content/{page}")
async def get_content(page: str):
    try:
        content = await db.content.find_one({"page": page}, {"_id": 0})
        if not content:
            return {"page": page, "content": ""}
        return content
    except Exception as e:
        logger.error(f"Error fetching content: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch content")

@api_router.put("/content/{page}")
async def update_content(page: str, content: ContentBase, user: Dict = Depends(require_admin)):
    try:
        content_dict = {
            "id": str(uuid.uuid4()),
            "page": page,
            "content": content.content,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.content.update_one(
            {"page": page},
            {"$set": content_dict},
            upsert=True
        )
        return content_dict
    except Exception as e:
        logger.error(f"Error updating content: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update content")

@api_router.get("/")
async def root():
    return {"message": "Zouqly API"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()