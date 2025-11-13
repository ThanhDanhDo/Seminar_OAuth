-- Test Neon DB Connection and Schema
-- Run this to check if tables are created correctly

-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check users table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users';

-- Count users
SELECT COUNT(*) as total_users FROM users;

-- View all users (if any)
SELECT id, firebase_uid, email, display_name, provider, created_at, last_login 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
