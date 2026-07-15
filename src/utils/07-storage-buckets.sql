-- Creates storage buckets and RLS policies for file uploads.
-- Safe to run multiple times (idempotent via IF NOT EXISTS).

-- ===== BUCKETS =====

INSERT INTO storage.buckets (id, name, public, avif_autodetection)
SELECT 'resumes', 'resumes', TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'resumes');

INSERT INTO storage.buckets (id, name, public, avif_autodetection)
SELECT 'company-logo', 'company-logo', TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'company-logo');

-- ===== STORAGE POLICIES =====

-- Resumes: allow authenticated users to upload
DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;
CREATE POLICY "Authenticated users can upload resumes"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- Resumes: allow public to view/download
DROP POLICY IF EXISTS "Anyone can view resumes" ON storage.objects;
CREATE POLICY "Anyone can view resumes"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resumes');

-- Company logos: allow authenticated users to upload
DROP POLICY IF EXISTS "Authenticated users can upload company logos" ON storage.objects;
CREATE POLICY "Authenticated users can upload company logos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'company-logo' AND auth.role() = 'authenticated');

-- Company logos: allow public to view/download
DROP POLICY IF EXISTS "Anyone can view company logos" ON storage.objects;
CREATE POLICY "Anyone can view company logos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'company-logo');
