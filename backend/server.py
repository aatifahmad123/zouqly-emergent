from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from supabase import create_client, Client
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase client
supabase_url = os.getenv("SUPABASE_URL", "https://pmgxaqpxlahnqwxrweyn.supabase.co")
supabase_key = os.getenv("SUPABASE_KEY", "sb_publishable_KZOAFH_vABRgia_v2OBeWQ_uYurB14k")
supabase: Client = create_client(supabase_url, supabase_key)

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

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

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
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_address: Optional[str] = None
    delivery_charge: Optional[float] = 0
    delivery_type: Optional[str] = None

class TestimonialBase(BaseModel):
    name: str
    rating: int
    comment: str

class ContentBase(BaseModel):
    page: str
    content: str

# Auth dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    token = credentials.credentials
    try:
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return {
            "id": user.user.id,
            "email": user.user.email,
            "role": user.user.user_metadata.get("role", "user")
        }
    except Exception as e:
        logger.error(f"Auth error: {str(e)}")
        raise HTTPException(status_code=401, detail="Authentication failed")

async def require_admin(user: Dict = Depends(get_current_user)) -> Dict:
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# Auth routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    try:
        response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {"role": user_data.role},
                "email_redirect_to": None
            }
        })
        
        if response.user:
            return {
                "message": "User registered successfully", 
                "user": response.user,
                "note": "If email confirmation is enabled, please check your email"
            }
        else:
            raise HTTPException(status_code=400, detail="Registration failed")
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Registration error: {error_msg}")
        if "already registered" in error_msg.lower():
            raise HTTPException(status_code=400, detail="Email already registered")
        raise HTTPException(status_code=400, detail=error_msg)

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        return {
            "access_token": response.session.access_token,
            "user": response.user,
            "role": response.user.user_metadata.get("role", "user")
        }
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Login error: {error_msg}")
        if "Invalid login credentials" in error_msg or "invalid" in error_msg.lower():
            raise HTTPException(status_code=401, detail="Invalid email or password")
        if "Email not confirmed" in error_msg or "not confirmed" in error_msg.lower():
            raise HTTPException(status_code=401, detail="Please confirm your email or contact admin")
        raise HTTPException(status_code=401, detail="Login failed")

# Category routes
@api_router.get("/categories")
async def list_categories():
    try:
        response = supabase.table("categories").select("*").execute()
        return response.data
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/categories")
async def create_category(category: CategoryBase, user: Dict = Depends(require_admin)):
    try:
        data = {
            **category.model_dump(),
            "created_at": datetime.utcnow().isoformat()
        }
        response = supabase.table("categories").insert(data).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/categories/{category_id}")
async def update_category(category_id: str, category: CategoryBase, user: Dict = Depends(require_admin)):
    try:
        response = supabase.table("categories").update(category.model_dump()).eq("id", category_id).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, user: Dict = Depends(require_admin)):
    try:
        supabase.table("categories").delete().eq("id", category_id).execute()
        return {"message": "Category deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Product routes  
@api_router.get("/products")
async def list_products(category_id: Optional[str] = None):
    try:
        query = supabase.table("products").select("*")
        if category_id:
            query = query.eq("category_id", category_id)
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    try:
        response = supabase.table("products").select("*").eq("id", product_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/products")
async def create_product(product: ProductBase, user: Dict = Depends(require_admin)):
    try:
        data = {
            **product.model_dump(),
            "created_at": datetime.utcnow().isoformat()
        }
        response = supabase.table("products").insert(data).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, product: ProductBase, user: Dict = Depends(require_admin)):
    try:
        response = supabase.table("products").update(product.model_dump()).eq("id", product_id).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, user: Dict = Depends(require_admin)):
    try:
        supabase.table("products").delete().eq("id", product_id).execute()
        return {"message": "Product deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Image upload
@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...), user: Dict = Depends(require_admin)):
    try:
        # Generate unique filename
        file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        file_name = f"products/{uuid.uuid4().hex}_{int(datetime.utcnow().timestamp())}.{file_ext}"
        
        # Read file content
        content = await file.read()
        
        # Upload to Supabase storage
        response = supabase.storage.from_('product-images').upload(
            file_name,
            content,
            file_options={"content-type": file.content_type}
        )
        
        # Get public URL
        public_url = supabase.storage.from_('product-images').get_public_url(file_name)
        
        return {"success": True, "url": public_url}
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Order routes
@api_router.get("/orders")
async def list_orders(user: Dict = Depends(get_current_user)):
    try:
        query = supabase.table("orders").select("*")
        if user["role"] != "admin":
            query = query.eq("user_id", user["id"])
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/orders")
async def create_order(order: OrderBase, user: Dict = Depends(get_current_user)):
    try:
        # Build order data - only include fields that exist in the database
        data = {
            "user_id": user["id"],
            "user_email": user["email"],
            "items": [item.model_dump() for item in order.items],
            "total_amount": order.total_amount,
            "payment_status": order.payment_status,
            "delivery_status": order.delivery_status,
            "created_at": datetime.utcnow().isoformat()
        }
            
        logger.info(f"Creating order with data: {data}")
        response = supabase.table("orders").insert(data).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        logger.error(f"Order creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/orders/{order_id}")
async def update_order_status(
    order_id: str,
    payment_status: Optional[str] = None,
    delivery_status: Optional[str] = None,
    user: Dict = Depends(require_admin)
):
    try:
        update_data = {}
        if payment_status:
            update_data["payment_status"] = payment_status
        if delivery_status:
            update_data["delivery_status"] = delivery_status
        
        response = supabase.table("orders").update(update_data).eq("id", order_id).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/orders/{order_id}")
async def delete_order(order_id: str, user: Dict = Depends(require_admin)):
    try:
        response = supabase.table("orders").delete().eq("id", order_id).execute()
        return {"message": "Order deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Testimonials
@api_router.get("/testimonials")
async def list_testimonials():
    try:
        response = supabase.table("testimonials").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/testimonials")
async def create_testimonial(testimonial: TestimonialBase, user: Dict = Depends(require_admin)):
    try:
        data = {
            **testimonial.model_dump(),
            "created_at": datetime.utcnow().isoformat()
        }
        response = supabase.table("testimonials").insert(data).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, user: Dict = Depends(require_admin)):
    try:
        supabase.table("testimonials").delete().eq("id", testimonial_id).execute()
        return {"message": "Testimonial deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Content
@api_router.get("/content/{page}")
async def get_content(page: str):
    try:
        response = supabase.table("content").select("*").eq("page", page).execute()
        if not response.data:
            return {"page": page, "content": ""}
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/content/{page}")
async def update_content(page: str, content: ContentBase, user: Dict = Depends(require_admin)):
    try:
        data = {
            "page": page,
            "content": content.content,
            "updated_at": datetime.utcnow().isoformat()
        }
        response = supabase.table("content").upsert(data).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/")
async def root():
    return {"message": "Zouqly API with Supabase"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
