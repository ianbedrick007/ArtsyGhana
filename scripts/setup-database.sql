-- ArtsyGhana Database Setup Script
-- This script will be executed to initialize the database schema

-- Note: Prisma will handle the actual schema creation
-- This file serves as documentation and a backup reference

-- The schema includes:
-- 1. Users table (with admin role support)
-- 2. Artists table (with application workflow)
-- 3. Artworks table (with types: ORIGINAL/PRINT)
-- 4. Exhibitions table (with timed drops)
-- 5. ExhibitionRooms table (for organizing artworks)
-- 6. ExhibitionArtworks junction table (with 3D positions)
-- 7. Orders table (with Paystack integration)
-- 8. OrderItems table (line items for orders)

-- To set up the database:
-- 1. Ensure DATABASE_URL is set in environment variables
-- 2. Run: npx prisma generate
-- 3. Run: npx prisma db push
-- 4. Run: npx prisma db seed

SELECT 'Database schema will be created by Prisma migrations' as status;
