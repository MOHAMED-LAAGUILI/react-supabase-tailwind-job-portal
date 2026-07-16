-- ==========================================================
-- COMPANIES TABLE
-- Stores company names and logo URLs.
-- Anyone can view the list. Any authenticated user can insert.
-- ==========================================================

DROP TABLE IF EXISTS companies CASCADE;

CREATE TABLE companies (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view companies"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Recruiters can insert companies"
  ON companies FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' IS NOT NULL);
