-- 1. Enable RLS on the table (ensure it is on)
ALTER TABLE public.paper_specs ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts (optional, but safer for a clean slate)
DROP POLICY IF EXISTS "Authenticated users can insert specs" ON public.paper_specs;
DROP POLICY IF EXISTS "Authenticated users can view all specs" ON public.paper_specs;
DROP POLICY IF EXISTS "Authenticated users can update specs" ON public.paper_specs;
DROP POLICY IF EXISTS "Authenticated users can view approved specs" ON public.paper_specs;

-- 3. Create Policy: Allow authenticated users to INSERT
CREATE POLICY "Authenticated users can insert specs"
ON public.paper_specs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. Create Policy: Allow authenticated users to SELECT (View) ALL data
-- (Required for the Admin Dashboard to list items)
CREATE POLICY "Authenticated users can view all specs"
ON public.paper_specs
FOR SELECT
TO authenticated
USING (true);

-- 5. Create Policy: Allow authenticated users to UPDATE
CREATE POLICY "Authenticated users can update specs"
ON public.paper_specs
FOR UPDATE
TO authenticated
USING (true);

-- 6. Storage Policies (Ensure these exist too)
-- Note: You might need to create the bucket 'tds-files' manually if it doesn't exist.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('tds-files', 'tds-files', true) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "Authenticated users can upload TDS files" ON storage.objects;
CREATE POLICY "Authenticated users can upload TDS files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tds-files');

DROP POLICY IF EXISTS "Public can view TDS files" ON storage.objects;
CREATE POLICY "Public can view TDS files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'tds-files');
