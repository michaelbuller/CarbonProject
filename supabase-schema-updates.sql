-- Add user types to the users table
ALTER TABLE public.users 
ADD COLUMN user_type TEXT DEFAULT 'project_developer' 
CHECK (user_type IN ('project_developer', 'verifier', 'buyer', 'regulator', 'admin'));

ALTER TABLE public.users
ADD COLUMN organization TEXT;

ALTER TABLE public.users
ADD COLUMN commission_id TEXT;

-- Add API Number and commission tracking to projects table
ALTER TABLE public.projects
ADD COLUMN api_number TEXT;

ALTER TABLE public.projects
ADD COLUMN commission_name TEXT;

ALTER TABLE public.projects
ADD COLUMN commission_state TEXT;

ALTER TABLE public.projects
ADD COLUMN well_count INTEGER DEFAULT 0;

-- Create index for API number searches
CREATE INDEX idx_projects_api_number ON public.projects(api_number);

-- Create commissions table for tracking regulatory bodies
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create api_numbers table for tracking valid API numbers
CREATE TABLE IF NOT EXISTS public.api_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_number TEXT NOT NULL UNIQUE,
  commission_id UUID REFERENCES public.commissions(id),
  operator_name TEXT,
  field_name TEXT,
  well_name TEXT,
  well_status TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for API number lookups
CREATE INDEX idx_api_numbers_api_number ON public.api_numbers(api_number);

-- Update RLS policies for new tables
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_numbers ENABLE ROW LEVEL SECURITY;

-- Commissions are viewable by all authenticated users
CREATE POLICY "Authenticated users can view commissions" ON public.commissions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins and regulators can manage commissions
CREATE POLICY "Admins and regulators can manage commissions" ON public.commissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.user_type IN ('admin', 'regulator')
    )
  );

-- API numbers are viewable by all authenticated users
CREATE POLICY "Authenticated users can view API numbers" ON public.api_numbers
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins and regulators can manage API numbers
CREATE POLICY "Admins and regulators can manage API numbers" ON public.api_numbers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.user_type IN ('admin', 'regulator')
    )
  );

-- Add trigger for commissions updated_at
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for api_numbers updated_at
CREATE TRIGGER update_api_numbers_updated_at BEFORE UPDATE ON public.api_numbers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some example commissions (US state oil & gas commissions)
INSERT INTO public.commissions (name, state, contact_email, website) VALUES
  ('Texas Railroad Commission', 'TX', 'contact@rrc.texas.gov', 'https://www.rrc.texas.gov'),
  ('Colorado Oil and Gas Conservation Commission', 'CO', 'info@cogcc.state.co.us', 'https://cogcc.state.co.us'),
  ('North Dakota Industrial Commission', 'ND', 'info@nd.gov', 'https://www.dmr.nd.gov/oilgas'),
  ('Oklahoma Corporation Commission', 'OK', 'contact@occ.ok.gov', 'https://oklahoma.gov/occ'),
  ('Louisiana Department of Natural Resources', 'LA', 'info@la.gov', 'https://www.dnr.louisiana.gov'),
  ('New Mexico Oil Conservation Division', 'NM', 'info@emnrd.nm.gov', 'https://www.emnrd.nm.gov/ocd'),
  ('Wyoming Oil and Gas Conservation Commission', 'WY', 'info@wyo.gov', 'https://wogcc.wyo.gov'),
  ('Alaska Oil and Gas Conservation Commission', 'AK', 'info@aogcc.alaska.gov', 'http://aogcc.alaska.gov')
ON CONFLICT (name) DO NOTHING;