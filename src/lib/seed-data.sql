-- Seed data for Oil & Gas Well Environmental Platform
-- This replaces the hardcoded data throughout the application

-- Insert Project Types (updated for oil & gas wells)
INSERT INTO public.project_types (name, display_name, description, icon, color) VALUES
  ('methane-prevention', 'Methane Prevention', 'Prevent methane leaks from active oil and gas wells', 'Shield', 'blue'),
  ('well-plugging', 'Well Plugging & Abandonment', 'Properly plug and abandon orphaned or end-of-life wells', 'X', 'red'),
  ('energy-efficiency', 'Energy Efficiency', 'Reduce energy consumption and emissions from operations', 'Zap', 'yellow'),
  ('flare-reduction', 'Flare Reduction', 'Minimize or eliminate routine flaring', 'Flame', 'orange'),
  ('water-treatment', 'Produced Water Treatment', 'Treat and recycle produced water from wells', 'Droplets', 'cyan')
ON CONFLICT (name) DO NOTHING;

-- Insert Project Templates (focused on oil & gas wells)
INSERT INTO public.project_templates (project_type_id, name, description, methodology, estimated_credits, duration_months, investment_required, location, required_documents)
SELECT 
  pt.id,
  template.name,
  template.description,
  template.methodology,
  template.estimated_credits,
  template.duration_months,
  template.investment_required,
  template.location,
  template.required_documents
FROM (VALUES
  -- Methane Prevention Templates
  ('methane-prevention', 'LDAR Program Implementation', 'Implement comprehensive Leak Detection and Repair program for well sites', 'EPA Method 21 / OGI', 15000, 12, 250000, 'Permian Basin, TX', '["EPA compliance records", "Baseline emissions data", "Equipment inventory"]'::jsonb),
  ('methane-prevention', 'Vapor Recovery Unit Installation', 'Install VRU systems on storage tanks and separators', 'EPA Subpart OOOO', 8000, 6, 150000, 'Bakken Formation, ND', '["P&ID diagrams", "Air permits", "Equipment specifications"]'::jsonb),
  ('methane-prevention', 'Green Completions', 'Implement reduced emission completions for new wells', 'EPA NSPS Subpart OOOO', 5000, 3, 100000, 'Denver Basin, CO', '["Well completion reports", "Gas capture data", "Equipment certifications"]'::jsonb),
  
  -- Well Plugging Templates
  ('well-plugging', 'Orphaned Well P&A - Shallow', 'Plug and abandon orphaned wells < 5,000 ft depth', 'State regulatory standards', 2000, 2, 75000, 'Appalachian Basin, PA', '["Well records", "Ownership documentation", "State permits"]'::jsonb),
  ('well-plugging', 'Orphaned Well P&A - Deep', 'Plug and abandon orphaned wells > 5,000 ft depth', 'State regulatory standards', 3500, 3, 150000, 'Permian Basin, TX', '["Well logs", "Casing diagrams", "Abandonment procedures"]'::jsonb),
  ('well-plugging', 'Offshore Well Decommissioning', 'Properly abandon offshore wells', 'BSEE regulations', 10000, 6, 500000, 'Gulf of Mexico', '["BSEE permits", "Environmental assessments", "Decommissioning plan"]'::jsonb),
  
  -- Flare Reduction Templates
  ('flare-reduction', 'Zero Routine Flaring', 'Eliminate routine flaring through gas capture infrastructure', 'World Bank Zero Routine Flaring', 20000, 18, 1000000, 'Eagle Ford, TX', '["Flaring volumes", "Gas analysis", "Infrastructure plans"]'::jsonb),
  ('flare-reduction', 'Flare Gas Recovery', 'Capture and utilize flare gas for power generation', 'CDM methodology', 12000, 12, 750000, 'Bakken Formation, ND', '["Gas composition", "Power purchase agreements", "Equipment specs"]'::jsonb),
  
  -- Energy Efficiency Templates
  ('energy-efficiency', 'Electrification of Drilling Rigs', 'Replace diesel rigs with electric alternatives', 'ISO 50001', 8000, 9, 2000000, 'Permian Basin, TX', '["Energy audits", "Grid connection plans", "Equipment specifications"]'::jsonb),
  ('energy-efficiency', 'Pump Jack Optimization', 'Install VFDs and optimize pump jack operations', 'API RP 11L', 3000, 6, 200000, 'Conventional Fields, OK', '["Production data", "Energy consumption records", "Equipment inventory"]'::jsonb)
) AS template(type_name, name, description, methodology, estimated_credits, duration_months, investment_required, location, required_documents)
JOIN public.project_types pt ON pt.name = template.type_name;

-- Insert Compliance Templates for Oil & Gas
INSERT INTO public.compliance_templates (name, phase, description, required_documents, regulatory_body, applies_to_project_types, order_index) VALUES
  -- Regulatory Phase
  ('State Oil & Gas Permit', 'Regulatory', 'Obtain necessary permits from state oil & gas commission', ARRAY['Drilling permit', 'APD', 'Surface use agreement'], 'State Commission', ARRAY['methane-prevention', 'well-plugging', 'flare-reduction'], 1),
  ('EPA Air Permits', 'Regulatory', 'Secure EPA air quality permits for emissions', ARRAY['Air permit application', 'Emissions inventory', 'Modeling results'], 'EPA', ARRAY['methane-prevention', 'flare-reduction'], 2),
  ('Environmental Impact Assessment', 'Environmental', 'Complete environmental impact assessment', ARRAY['EIA report', 'Baseline studies', 'Mitigation plans'], 'State/Federal', ARRAY['all'], 3),
  
  -- Technical Phase
  ('API Well Number Verification', 'Technical', 'Verify and document all API well numbers', ARRAY['Well records', 'API documentation', 'Commission records'], 'State Commission', ARRAY['methane-prevention', 'well-plugging'], 4),
  ('Baseline Emissions Measurement', 'Technical', 'Establish baseline methane emissions', ARRAY['OGI survey', 'Measurement data', 'Third-party verification'], 'EPA', ARRAY['methane-prevention', 'flare-reduction'], 5),
  ('Well Integrity Assessment', 'Technical', 'Assess mechanical integrity of wells', ARRAY['MIT results', 'Casing logs', 'Pressure tests'], 'State Commission', ARRAY['well-plugging'], 6),
  
  -- Financial Phase
  ('Project Financing', 'Financial', 'Secure project financing and insurance', ARRAY['Financial statements', 'Insurance policies', 'Funding agreements'], 'Internal', ARRAY['all'], 7),
  ('Cost-Benefit Analysis', 'Financial', 'Complete economic analysis of project', ARRAY['CBA report', 'ROI calculations', 'Market analysis'], 'Internal', ARRAY['all'], 8),
  
  -- Operational Phase
  ('Standard Operating Procedures', 'Operational', 'Develop SOPs for project operations', ARRAY['SOP documents', 'Training materials', 'Safety protocols'], 'OSHA/State', ARRAY['all'], 9),
  ('Monitoring Plan', 'Operational', 'Establish continuous monitoring protocols', ARRAY['Monitoring plan', 'QA/QC procedures', 'Reporting templates'], 'EPA/State', ARRAY['methane-prevention', 'flare-reduction'], 10),
  
  -- Verification Phase
  ('Third-Party Verification', 'Verification', 'Independent verification of emissions reductions', ARRAY['Verification report', 'Site visit records', 'Data validation'], 'Voluntary/Regulatory', ARRAY['all'], 11),
  ('Credit Issuance', 'Verification', 'Apply for environmental credit issuance', ARRAY['Credit application', 'Supporting documentation', 'Registry account'], 'Registry', ARRAY['all'], 12);

-- Insert sample notifications
INSERT INTO public.notifications (user_id, type, title, message, action_url) 
SELECT 
  u.id,
  'system',
  'Welcome to the Oil & Gas Well Environmental Platform',
  'Complete your profile to start creating projects for methane mitigation and well remediation.',
  '/settings'
FROM public.users u
LIMIT 1;

-- Insert sample user preferences
INSERT INTO public.user_preferences (user_id)
SELECT id FROM public.users
ON CONFLICT (user_id) DO NOTHING;

-- Create RPC functions for analytics
CREATE OR REPLACE FUNCTION get_user_analytics(p_user_id UUID)
RETURNS TABLE(
  total_credits BIGINT,
  active_projects BIGINT,
  total_revenue NUMERIC,
  methane_prevented NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(p.total_credits), 0) as total_credits,
    COUNT(CASE WHEN p.status = 'Active' THEN 1 END) as active_projects,
    COALESCE(SUM(t.amount), 0) as total_revenue,
    COALESCE(SUM(p.total_credits * 0.5), 0) as methane_prevented -- Placeholder calculation
  FROM public.projects p
  LEFT JOIN public.transactions t ON t.project_id = p.id AND t.status = 'Completed'
  WHERE p.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log activities
CREATE OR REPLACE FUNCTION log_activity(
  p_project_id UUID,
  p_user_id UUID,
  p_action_type TEXT,
  p_action_description TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO public.activity_logs (
    project_id, user_id, action_type, action_description, 
    entity_type, entity_id, metadata
  ) VALUES (
    p_project_id, p_user_id, p_action_type, p_action_description,
    p_entity_type, p_entity_id, p_metadata
  ) RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;