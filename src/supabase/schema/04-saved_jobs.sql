-- ==========================================================
-- SAVED JOBS TABLE
-- Lets candidates bookmark jobs for later.
-- Enforces unique (user_id, job_id) to prevent duplicates.
-- RLS: users manage their own saved list.
-- ==========================================================

DROP TABLE IF EXISTS saved_jobs CASCADE;

CREATE TABLE saved_jobs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL,
  job_id BIGINT REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved jobs"
  ON saved_jobs FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can save jobs"
  ON saved_jobs FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can unsave jobs"
  ON saved_jobs FOR DELETE
  USING (auth.jwt() ->> 'sub' = user_id);
