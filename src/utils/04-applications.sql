DROP TABLE IF EXISTS applications CASCADE;

CREATE TABLE applications (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL,
  job_id BIGINT REFERENCES jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  experience TEXT NOT NULL,
  education TEXT NOT NULL,
  skills TEXT NOT NULL,
  resume TEXT NOT NULL,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'interviewing', 'hired', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Recruiters can view applications for their jobs"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can insert their own applications"
  ON applications FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Recruiters can update application status"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.jwt() ->> 'sub'
    )
  );
