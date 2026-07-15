-- ==========================================================
-- PROFILES TABLE
-- Stores user roles (candidate / recruiter).
-- Each user gets one row, created during onboarding.
-- Clerk user ID is the primary key.
-- RLS: users can only read/update their own row.
-- ==========================================================

DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('candidate', 'recruiter')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.jwt() ->> 'sub' = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.jwt() ->> 'sub' = id);
