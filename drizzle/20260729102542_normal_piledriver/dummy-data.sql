-- ================================================================
-- DUMMY DATA SEED SCRIPT FOR POSTGRESQL / SUPABASE
-- Based on Drizzle Schema Architecture
-- ================================================================

BEGIN;

-- 1. USER
INSERT INTO "user" (id, name, email, email_verified, image, created_at, updated_at)
VALUES
  ('usr_seller_01', 'Budi Santoso', 'budi.design@example.com', true, 'https://picsum.photos/seed/budi/200', NOW(), NOW()),
  ('usr_seller_02', 'Siti Rahma', 'siti.dev@example.com', true, 'https://picsum.photos/seed/siti/200', NOW(), NOW()),
  ('usr_buyer_01', 'Andi Pratama', 'andi.buyer@example.com', true, 'https://picsum.photos/seed/andi/200', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. CATEGORIES (Parent Categories & Subcategories)
INSERT INTO "categories" (id, parent_id, name, slug)
VALUES
  -- Parent Categories
  ('10000000-0000-0000-0000-000000000001', NULL, 'Graphics & Design', 'graphics-design'),
  ('10000000-0000-0000-0000-000000000002', NULL, 'Programming & Tech', 'programming-tech'),

  -- Subcategories
  ('10000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001', 'Logo & Brand Identity', 'logo-brand-identity'),
  ('10000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002', 'Web Development', 'web-development')
ON CONFLICT (id) DO NOTHING;

-- 3. ATTRIBUTES
INSERT INTO "attributes" (id, category_id, name, slug)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000011', 'Logo Style', 'logo-style'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000012', 'Tech Stack', 'tech-stack')
ON CONFLICT (id) DO NOTHING;

-- 4. ATTRIBUTE OPTIONS
INSERT INTO "attribute_options" (id, attribute_id, label, value)
VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Minimalist', 'minimalist'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '3D / Modern', '3d-modern'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'React & Next.js', 'react-nextjs'),
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'Vue & Nuxt', 'vue-nuxt')
ON CONFLICT (id) DO NOTHING;

-- 5. PACKAGE FEATURES (Master checklist item per category)
INSERT INTO "package_features" (id, category_id, name, type)
VALUES
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000011', 'Vector / Source File', 'boolean'),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000011', '3D Mockup', 'boolean'),
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000011', 'Number of Initial Concepts', 'number'),
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000012', 'Responsive Design', 'boolean'),
  ('40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000012', 'Number of Pages', 'number')
ON CONFLICT (id) DO NOTHING;

-- 6. GIGS
INSERT INTO "gigs" (id, seller_id, category_id, title, slug, about, cover_image, created_at)
VALUES
  (
    '50000000-0000-0000-0000-000000000001',
    'usr_seller_01',
    '10000000-0000-0000-0000-000000000011',
    'Desain Logo Minimalis Modern untuk Business Anda',
    'desain-logo-minimalis-modern',
    'Saya akan membuatkan logo minimalis modern yang sangat cocok untuk brand, startup, atau usaha Anda.',
    'https://picsum.photos/seed/gig1/800/600',
    NOW()
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'usr_seller_02',
    '10000000-0000-0000-0000-000000000012',
    'Jasa Pembuatan Website Modern Next.js & Supabase',
    'jasa-pembuatan-website-modern-nextjs-supabase',
    'Membangun web aplikasi fullstack performa tinggi menggunakan Next.js App Router, Drizzle ORM, dan Supabase.',
    'https://picsum.photos/seed/gig2/800/600',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- 7. GIG ATTRIBUTE OPTIONS (Junction table)
INSERT INTO "gig_attribute_options" (gig_id, attribute_option_id)
VALUES
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003')
ON CONFLICT (gig_id, attribute_option_id) DO NOTHING;

-- 8. GIG PACKAGES
INSERT INTO "gig_packages" (id, gig_id, package_type, title, description, price, delivery_time_days, revisions)
VALUES
  -- Packages for Gig 1 (Logo Design)
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'basic', 'BASIC LOGO', '1 Konsep logo standar JPG & PNG highres', 150000, 2, 2),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 'standard', 'STANDARD BRANDING', '2 Konsep logo, file vektor (AI/EPS) & mockup 3D', 350000, 3, 5),
  ('60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', 'premium', 'PREMIUM IDENTITY', '3 Konsep logo, full master file, mockup, & social media kit', 750000, 5, 99),

  -- Packages for Gig 2 (Web Dev)
  ('60000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000002', 'basic', 'LANDING PAGE', '1 Halaman landing page responsif Next.js', 1500000, 4, 3),
  ('60000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000002', 'standard', 'FULL WEB APP', 'Hingga 5 halaman web interaktif + integrasi Supabase DB', 4000000, 7, 5)
ON CONFLICT (id) DO NOTHING;

-- 9. GIG PACKAGE FEATURE VALUES (Junction Table Feature Values)
INSERT INTO "gig_package_feature_values" (gig_package_id, package_feature_id, is_included, value)
VALUES
  -- Gig 1 Basic Package
  ('60000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', false, NULL),
  ('60000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', false, NULL),
  ('60000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', true, '1'),

  -- Gig 1 Standard Package
  ('60000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', true, NULL),
  ('60000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', true, NULL),
  ('60000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', true, '2'),

  -- Gig 2 Basic Package
  ('60000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000004', true, NULL),
  ('60000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000005', true, '1')
ON CONFLICT (gig_package_id, package_feature_id) DO NOTHING;

-- 10. AUTH TABLES (Session, Account, Verification)
INSERT INTO "session" (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id)
VALUES
  ('sess_001', NOW() + INTERVAL '7 days', 'tok_sample_12345', NOW(), NOW(), '127.0.0.1', 'Mozilla/5.0 Chrome/120.0', 'usr_buyer_01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "account" (id, account_id, provider_id, user_id, password, created_at, updated_at)
VALUES
  ('acc_001', 'acc_google_123', 'google', 'usr_buyer_01', NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "verification" (id, identifier, value, expires_at, created_at, updated_at)
VALUES
  ('verif_001', 'andi.buyer@example.com', '123456', NOW() + INTERVAL '15 minutes', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
