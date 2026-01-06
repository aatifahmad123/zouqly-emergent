# IMPORTANT: Disable Email Confirmation in Supabase

To make signup/login work immediately, you need to disable email confirmation:

1. Go to: https://supabase.com/dashboard/project/pmgxaqpxlahnqwxrweyn/auth/providers
2. Scroll down to "Email" section
3. Find "Enable email confirmations" toggle
4. Turn it OFF
5. Click "Save"

This allows users to sign up and login immediately without email verification.

Alternatively, for testing:
- You can manually confirm users in Supabase Dashboard > Authentication > Users
- Click on a user and mark as "Email Confirmed"
