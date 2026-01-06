# How to Test Admin User

## Admin Account Credentials

**Email:** admin@zouqly.com  
**Password:** admin123

This account is already created and email-confirmed, ready to use immediately.

## Testing Steps

### 1. Login as Admin

1. Go to: https://premium-dry.preview.emergentagent.com/login
2. Enter email: `admin@zouqly.com`
3. Enter password: `admin123`
4. Click "Sign In"
5. **You will be automatically redirected to:** `/admin/dashboard`

### 2. Test Admin Dashboard Features

Once logged in, you'll see the admin dashboard with cards for:

#### A. Products Management
- Click on "Products" card
- **Test Create:** Click "Add Product" button
  - Fill in all fields (name, weight, price, description, features, category, tags, image URL, stock)
  - Click "Create Product"
- **Test Edit:** Click "Edit" button on any product
  - Modify any field
  - Click "Update Product"
- **Test Delete:** Click trash icon on any product
  - Confirm deletion

#### B. Categories Management
- Click on "Categories" card
- **Test Create:** Click "Add Category"
  - Enter name and description
  - Click "Create Category"
- **Test Edit:** Click "Edit" on any category
  - Modify name or description
  - Click "Update Category"
- **Test Delete:** Click trash icon
  - Confirm deletion

#### C. Orders Management
- Click on "Orders" card
- View all customer orders
- **Test Status Update:**
  - Change "Payment Status" dropdown (Pending → Paid)
  - Change "Delivery Status" dropdown (Order Placed → Packed → Shipped → Delivered)
  - Status updates save automatically

#### D. Testimonials Management
- Click on "Testimonials" card
- **Test Create:** Click "Add Testimonial"
  - Enter customer name
  - Set rating (1-5 stars)
  - Write comment
  - Click "Add Testimonial"
- **Test Delete:** Click trash icon on any testimonial
  - Confirm deletion

#### E. Content Management
- Click on "Content" card
- **Test Update:**
  - Edit "About Us" content in textarea
  - Click "Update About Us"
  - Edit "Privacy Policy" content
  - Click "Update Privacy Policy"

### 3. Test Admin Navigation

- Click "Admin" link in navbar → goes to admin dashboard
- Click "Home" → goes to public homepage
- Click "Logout" → logs out and redirects to login

### 4. Verify Admin-Only Access

Try these as a regular user (user@zouqly.com / user123):
- Try to access `/admin/dashboard` → Should redirect to `/shop`
- Admin link should NOT appear in navbar for regular users

## Expected Behavior

✅ **Admin user:**
- Redirects to `/admin/dashboard` after login
- Sees "Admin" link in navbar
- Can access all admin pages
- Can perform all CRUD operations

❌ **Regular user:**
- Redirects to `/shop` after login
- Does NOT see "Admin" link in navbar
- Cannot access admin pages (gets redirected)

## Notes

- All changes are saved to Supabase database
- Products remain editable at all times (as per requirement)
- Order statuses can be updated multiple times
- Image URLs should be from Pexels or Supabase Storage
