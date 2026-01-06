-- Add is_featured column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Set first 4 products as featured
UPDATE products SET is_featured = true WHERE id IN (
  SELECT id FROM products ORDER BY created_at ASC LIMIT 4
);
