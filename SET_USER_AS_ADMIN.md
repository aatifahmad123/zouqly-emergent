# How to Set Your User as Admin

## Method 1: Via Supabase Dashboard (Recommended)

1. **Go to Supabase Authentication:**
   https://supabase.com/dashboard/project/pmgxaqpxlahnqwxrweyn/auth/users

2. **Find Your User:**
   - You'll see a list of all users
   - Find the user with your email address
   - Click on the user row to open details

3. **Edit User Metadata:**
   - Scroll down to "User Metadata" section
   - Click "Edit" button
   - Add this JSON:
   ```json
   {
     "role": "admin"
   }
   ```
   - Click "Save"

4. **Logout and Login Again:**
   - Go to your website and logout
   - Login again with your credentials
   - You should now be redirected to `/admin/dashboard`
   - You'll see "Admin" link in the navbar

## Method 2: Using Python Script (Automated)

If you provide me your email, I can run a script to set you as admin immediately.

Just tell me your email address and I'll update it!

## Verify Admin Access

After setting admin role:
- ✅ Login redirects to `/admin/dashboard` (not `/shop`)
- ✅ "Admin" link visible in navbar
- ✅ Can access all admin pages
- ✅ Can manage products, categories, orders, testimonials

## Notes

- The role is stored in `user_metadata` in Supabase Auth
- Changes take effect immediately after logout/login
- You can have multiple admin users
