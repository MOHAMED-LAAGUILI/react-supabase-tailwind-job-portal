-- ==========================================================
-- JOBS TABLE
-- Stores job postings: title, description, location (region),
-- country_code (for flag display), requirements, company, and
-- hiring status (isOpen).
-- RLS: open jobs are public; recruiters manage their own posts.
-- ==========================================================

DROP TABLE IF EXISTS jobs CASCADE;

CREATE TABLE jobs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  country_code TEXT,
  requirements TEXT,
  company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,
  recruiter_id TEXT NOT NULL,
  "isOpen" BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open jobs"
  ON jobs FOR SELECT
  USING ("isOpen" = TRUE OR auth.jwt() ->> 'sub' = recruiter_id);

CREATE POLICY "Recruiters can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = recruiter_id);

CREATE POLICY "Recruiters can update their own jobs"
  ON jobs FOR UPDATE
  USING (auth.jwt() ->> 'sub' = recruiter_id);

CREATE POLICY "Recruiters can delete their own jobs"
  ON jobs FOR DELETE
  USING (auth.jwt() ->> 'sub' = recruiter_id);
