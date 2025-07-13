# Database Migration Tracker

This document tracks all static/hardcoded data that needs to be migrated to database-driven implementations.

## Priority 1: Core Data Models

### 1. Project Types & Templates
**File:** `src/components/ProjectsManager.tsx`
- [ ] Lines 26-48: Migrate `projectTypeConfig` to `project_types` table
- [ ] Lines 60-352: Migrate `projectTemplates` to `project_templates` table
- [ ] Update terminology: "carbon-avoidance" → "methane-prevention"
- [ ] Update terminology: "carbon-sequestration" → "well-plugging"

**Database Tables Needed:**
```sql
CREATE TABLE project_types (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT
);

CREATE TABLE project_templates (
  id UUID PRIMARY KEY,
  project_type_id UUID REFERENCES project_types(id),
  name TEXT NOT NULL,
  description TEXT,
  methodology TEXT,
  estimated_credits INTEGER,
  duration_months INTEGER,
  required_documents JSONB
);
```

### 2. User & Team Management
**File:** `src/components/TeamCollaboration.tsx`
- [ ] Lines 24-77: Replace hardcoded team members with database queries
- [ ] Lines 79-115: Move `roleConfig` to `roles` table
- [ ] Lines 117-146: Implement real activity tracking

**Implementation:**
```typescript
// Replace with:
const { data: teamMembers } = await supabase
  .from('team_members')
  .select('*, users(*)')
  .eq('project_id', projectId)
```

### 3. Notifications System
**File:** `src/components/NotificationsCenter.tsx`
- [ ] Lines 23-132: Create `notifications` table and real-time subscriptions
- [ ] Lines 134-177: Move notification types to database

**Database Table:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Priority 2: Financial & Analytics

### 4. Analytics Dashboard
**File:** `src/components/AnalyticsDashboard.tsx`
- [ ] Lines 15-40: Replace mock analytics with aggregated database queries
- [ ] Lines 42-49: Implement real-time chart data

**Implementation:**
```typescript
// Aggregate from transactions table
const { data: analytics } = await supabase
  .rpc('get_user_analytics', { user_id: userId })
```

### 5. Marketplace
**File:** `src/components/Marketplace.tsx`
- [ ] Lines 17-82: Create `marketplace_listings` table
- [ ] Lines 84-107: Create `buyer_requests` table

### 6. Environmental Impact Dashboard
**File:** `src/components/CarbonBalanceSheet.tsx`
- [ ] Rename component to `EnvironmentalImpactDashboard`
- [ ] Lines 58-71: Replace with real metrics from projects
- [ ] Lines 74-111: Move offtake agreements to database
- [ ] Update all "carbon" references to "methane mitigation"

## Priority 3: External Integrations

### 7. Wallet Connection
**File:** `src/components/WalletConnection.tsx`
- [ ] Lines 54-63: Implement real Web3 wallet connection
- [ ] Remove mock simulation
- [ ] Integrate with MetaMask, WalletConnect, etc.

**Libraries Needed:**
```json
{
  "dependencies": {
    "@web3-react/core": "^8.x.x",
    "@web3-react/metamask": "^8.x.x",
    "ethers": "^5.7.x"
  }
}
```

### 8. AI Assistant
**File:** `src/components/AIAssistant.tsx`
- [ ] Lines 72-105: Replace mock responses with real AI integration
- [ ] Implement OpenAI or Claude API integration
- [ ] Add context-aware responses based on project data

## Priority 4: Compliance & Documentation

### 9. Compliance Workflow
**File:** `src/components/ComplianceWorkflowSidebar.tsx`
- [ ] Lines 34-203: Move compliance steps to `compliance_templates` table
- [ ] Track actual compliance progress per project
- [ ] Add oil & gas specific compliance requirements

### 10. Document Management
**File:** `src/components/DocumentUpload.tsx`
- [ ] Implement real file upload to Supabase Storage
- [ ] Add document categorization for oil & gas wells
- [ ] Include API documentation requirements

## Priority 5: Settings & Configuration

### 11. Settings Management
**File:** `src/components/SettingsManagement.tsx`
- [ ] Lines 27-65: Replace all hardcoded settings with user preferences table
- [ ] Implement real export functionality
- [ ] Add oil & gas specific settings

## Global Updates Required

### Terminology Changes
- [ ] "Carbon Credit Platform" → "Oil & Gas Well Environmental Platform"
- [ ] "carbon credits" → "environmental credits" or "methane mitigation credits"
- [ ] "Carbon Balance Sheet" → "Environmental Impact Dashboard"
- [ ] "carbon avoidance" → "methane prevention"
- [ ] "carbon sequestration" → "well plugging & abandonment"

### Authentication & Session Management
- [ ] Implement Supabase Auth throughout application
- [ ] Replace localStorage with database persistence
- [ ] Add role-based access control (RBAC)

### Real-time Features
- [ ] Implement Supabase real-time subscriptions for:
  - [ ] Team collaboration
  - [ ] Notifications
  - [ ] Project updates
  - [ ] Marketplace listings

## Implementation Order

1. **Phase 1:** Core Authentication & User Management
   - Implement Supabase Auth
   - Migrate user data
   - Set up RBAC

2. **Phase 2:** Project & Data Management
   - Migrate project types and templates
   - Implement project CRUD with database
   - Update ProjectContext to use Supabase

3. **Phase 3:** Team & Collaboration
   - Implement real team management
   - Add real-time collaboration
   - Create notification system

4. **Phase 4:** Financial & Analytics
   - Build analytics aggregation
   - Implement marketplace
   - Create transaction tracking

5. **Phase 5:** External Services
   - Integrate real wallet connection
   - Implement AI assistant
   - Add document storage

6. **Phase 6:** Compliance & Reporting
   - Build compliance tracking
   - Add reporting features
   - Implement export functionality

## Notes

- All mock data should be preserved as seed data for development/testing
- Consider creating a `seed.sql` file with sample data
- Implement proper error handling for all database operations
- Add loading states for all async operations
- Consider implementing offline support with service workers