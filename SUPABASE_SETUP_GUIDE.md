# Zouqly E-Commerce - Supabase Setup Guide

## Quick Setup Steps

### Step 1: Create Database Tables

Go to your Supabase SQL Editor:
**https://supabase.com/dashboard/project/pmgxaqpxlahnqwxrweyn/sql**

Copy and paste this entire SQL script and click "Run":

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table  
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  weight TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  features TEXT[],
  category_id UUID REFERENCES categories(id),
  tags TEXT[],
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'Pending',
  delivery_status TEXT DEFAULT 'Order Placed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content table
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT UNIQUE NOT NULL,
  content TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public can read content" ON content FOR SELECT USING (true);

-- RLS Policies for authenticated users
CREATE POLICY "Authenticated users can insert orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id::text);
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id::text);

-- Admin policies
CREATE POLICY "Admins full access categories" ON categories FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');
CREATE POLICY "Admins full access products" ON products FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');
CREATE POLICY "Admins full access orders" ON orders FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');
CREATE POLICY "Admins full access testimonials" ON testimonials FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');
CREATE POLICY "Admins full access content" ON content FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');
```

### Step 2: Configure Supabase Authentication

1. Go to Authentication settings:
   **https://supabase.com/dashboard/project/pmgxaqpxlahnqwxrweyn/auth/users**

2. Disable email confirmation (for testing):
   - Go to Authentication > Settings
   - Under "Email Auth", disable "Enable email confirmations"
   - Click Save

### Step 3: Create Storage Bucket for Product Images

1. Go to Storage:
   **https://supabase.com/dashboard/project/pmgxaqpxlahnqwxrweyn/storage/buckets**

2. Create new bucket:
   - Name: `product-images`
   - Public: Yes
   - Click "Create bucket"

3. Set bucket policy:
   - Select the bucket
   - Go to Policies
   - Add policy: Allow public read access

### Step 4: Seed Initial Data

After tables are created, run this command in the terminal:

```bash
python /app/seed_supabase_data.py
```

This will create:
- 4 categories (Cashews, Almonds, Raisins, Mix)
- 4 sample products with images
- 3 testimonials

### Step 5: Create Admin User

1. Go to your app: https://zouqly-market.preview.emergentagent.com/signup
2. Sign up with an email and password
3. Go to Supabase Authentication > Users
4. Find your user and click on it
5. In "User Metadata", add:
   ```json
   {
     "role": "admin"
   }
   ```
6. Click Save
7. Log out and log back in

### Step 6: Test the Application

**As Admin:**
- Login → Should redirect to /admin/dashboard
- Create/Edit/Delete products, categories, orders, testimonials

**As Regular User:**
- Login → Should redirect to /shop
- Browse products, add to cart, checkout
- View order history

## Troubleshooting

### Authentication Issues
- Make sure email confirmation is disabled in Supabase Auth settings
- Check that RLS policies are properly set up
- Verify user metadata has correct "role" field

### Database Issues
- Verify all tables were created successfully
- Check RLS policies are enabled
- Make sure UUID extension is enabled

### Image Upload Issues
- Verify `product-images` bucket exists and is public
- Check storage policies allow authenticated uploads

## Application URLs

- **Live App**: https://zouqly-market.preview.emergentagent.com
- **API Health**: https://zouqly-market.preview.emergentagent.com/api/health
- **Supabase Dashboard**: https://supabase.com/dashboard/project/pmgxaqpxlahnqwxrweyn

## Support

If you encounter any issues, check:
1. Backend logs: `tail -f /var/log/supervisor/backend.*.log`
2. Frontend console in browser DevTools
3. Supabase dashboard logs
