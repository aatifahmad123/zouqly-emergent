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
  user_id TEXT NOT NULL,
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

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can read categories" ON categories;
DROP POLICY IF EXISTS "Public can read products" ON products;
DROP POLICY IF EXISTS "Public can read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public can read content" ON content;
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON orders;
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Admins full access categories" ON categories;
DROP POLICY IF EXISTS "Admins full access products" ON products;
DROP POLICY IF EXISTS "Admins full access orders" ON orders;
DROP POLICY IF EXISTS "Admins full access testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins full access content" ON content;

-- RLS Policies for public read access
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public can read content" ON content FOR SELECT USING (true);

-- RLS Policies for authenticated users
CREATE POLICY "Authenticated users can insert orders" ON orders FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid()::text = user_id);

-- Admin policies
CREATE POLICY "Admins full access categories" ON categories FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');
CREATE POLICY "Admins full access products" ON products FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');
CREATE POLICY "Admins full access orders" ON orders FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');
CREATE POLICY "Admins full access testimonials" ON testimonials FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');
CREATE POLICY "Admins full access content" ON content FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');
