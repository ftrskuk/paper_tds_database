-- Create paper_specs table
create table public.paper_specs (
  id uuid default gen_random_uuid() primary key,
  manufacturer text not null,
  product_name text not null,
  basis_weight int, -- g/m2
  thickness int, -- um
  whiteness float, -- CIE
  smoothness float, -- Bekk
  cobb_value float,
-- Create policy for authenticated users to view approved specs
create policy "Authenticated users can view approved specs"
  on public.paper_specs for select
  to authenticated
  using (status = 'approved');

-- Create policy for admins to view all specs (assuming admin role or specific email for now, 
-- but for simplicity allowing authenticated users to view drafts if they are the creator? 
-- No, PRD says "Admin reviews". Let's assume a simple "admin" claim or just allow all authenticated for now for MVP/Dev)
-- For now, allow all authenticated users to view all specs for development purposes.
-- create policy "Authenticated users can view all specs"
--   on public.paper_specs for select
--   to authenticated
--   using (true);

-- Allow insert/update for authenticated users (for now, to allow upload)
create policy "Authenticated users can insert specs"
  on public.paper_specs for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update specs"
  on public.paper_specs for update
  to authenticated
  using (true);

-- Storage bucket for TDS files
insert into storage.buckets (id, name, public) values ('tds-files', 'tds-files', true);

-- Storage policies
create policy "Authenticated users can upload TDS files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'tds-files');

create policy "Public can view TDS files"
  on storage.objects for select
  to public
  using (bucket_id = 'tds-files');
