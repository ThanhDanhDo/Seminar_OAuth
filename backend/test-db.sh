#!/bin/bash

# Test Neon PostgreSQL Connection
echo "🔍 Testing Neon PostgreSQL connection..."

# Run psql command
psql 'postgresql://neondb_owner:npg_1HpXZgi7tVLh@ep-damp-dust-a1zwfcow-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' << EOF

-- Check if users table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
);

-- If table exists, show all users
SELECT * FROM users;

EOF

echo "✅ Database connection test completed!"
