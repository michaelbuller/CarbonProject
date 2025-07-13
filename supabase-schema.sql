-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  wallet_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('Renewable Energy', 'Reforestation', 'Carbon Capture', 'Energy Efficiency', 'Waste Management')),
  location TEXT NOT NULL,
  status TEXT DEFAULT 'Planning' CHECK (status IN ('Planning', 'Active', 'Completed', 'Suspended')),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  total_credits INTEGER DEFAULT 0,
  available_credits INTEGER DEFAULT 0,
  price_per_credit DECIMAL(10, 2) DEFAULT 0,
  vintage_year INTEGER NOT NULL,
  certification_standard TEXT,
  verification_status TEXT DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'Verified', 'Rejected')),
  metadata JSONB
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'Member' CHECK (role IN ('Admin', 'Member', 'Viewer')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT NOT NULL,
  url TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES public.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  category TEXT NOT NULL CHECK (category IN ('Legal', 'Technical', 'Financial', 'Certification', 'Other'))
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id),
  type TEXT NOT NULL CHECK (type IN ('Purchase', 'Retirement', 'Transfer')),
  amount DECIMAL(10, 2) NOT NULL,
  credits INTEGER NOT NULL,
  from_user_id UUID REFERENCES public.users(id),
  to_user_id UUID REFERENCES public.users(id),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed')),
  transaction_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create compliance_checks table
CREATE TABLE IF NOT EXISTS public.compliance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Pass', 'Fail', 'Pending')),
  details JSONB,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  checked_by UUID REFERENCES public.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_type ON public.projects(type);
CREATE INDEX idx_team_members_project_id ON public.team_members(project_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_documents_project_id ON public.documents(project_id);
CREATE INDEX idx_transactions_project_id ON public.transactions(project_id);
CREATE INDEX idx_transactions_from_user_id ON public.transactions(from_user_id);
CREATE INDEX idx_transactions_to_user_id ON public.transactions(to_user_id);
CREATE INDEX idx_compliance_checks_project_id ON public.compliance_checks(project_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for projects table
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view projects they are members of" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.project_id = projects.id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Project owners can update their projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Project admins can update projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.project_id = projects.id
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'Admin'
    )
  );

CREATE POLICY "Project owners can delete their projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for team_members table
CREATE POLICY "Team members can view project members" ON public.team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.project_id = team_members.project_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage team members" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = team_members.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project admins can manage team members" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.project_id = team_members.project_id
      AND tm.user_id = auth.uid()
      AND tm.role = 'Admin'
    )
  );

-- RLS Policies for documents table
CREATE POLICY "Team members can view project documents" ON public.documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.project_id = documents.project_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can upload documents" ON public.documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.project_id = documents.project_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('Admin', 'Member')
    )
  );

-- RLS Policies for transactions table
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (
    auth.uid() = from_user_id OR auth.uid() = to_user_id
  );

CREATE POLICY "Users can view transactions for their projects" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = transactions.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for compliance_checks table
CREATE POLICY "Team members can view compliance checks" ON public.compliance_checks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.project_id = compliance_checks.project_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Project admins can manage compliance checks" ON public.compliance_checks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.project_id = compliance_checks.project_id
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'Admin'
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();