-- ==========================================================
-- SEED DATA
-- Run AFTER all 5 schema files (01 → 05).
-- Replace placeholder Clerk user IDs with your real IDs.
-- ==========================================================

-- === PROFILES ===
-- Use your actual Clerk user IDs from https://dashboard.clerk.com → Users
-- You can see your ID in the browser console: (await Clerk.user?.id)
INSERT INTO profiles (id, role) VALUES
  ('user_xxxxxxxxxxxxxxxxx', 'recruiter'),   -- ← REPLACE with your Clerk user ID
  ('user_yyyyyyyyyyyyyyyyy', 'candidate');   -- ← REPLACE with a candidate's Clerk user ID

-- === COMPANIES ===
INSERT INTO companies (name, logo_url) VALUES
  ('Acme Corp', 'https://placehold.co/200x200/2563eb/ffffff?text=ACME'),
  ('TechMorocco', 'https://placehold.co/200x200/059669/ffffff?text=TM'),
  ('DataFlow Solutions', 'https://placehold.co/200x200/dc2626/ffffff?text=DFS'),
  ('GreenEnergy MA', 'https://placehold.co/200x200/65a30d/ffffff?text=GEMA'),
  ('MediSecure', 'https://placehold.co/200x200/7c3aed/ffffff?text=MED');

