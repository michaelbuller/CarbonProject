import React, { useState } from 'react';
import { 
  Leaf, Shield, Wallet, Upload, MessageCircle, BarChart3, Settings, 
  User, FileText, CheckCircle, Clock, Crown, Flame, Home, 
  BookOpen, Users, TrendingUp, Calendar, Bell, HelpCircle,
  FolderOpen, Plus, ChevronDown, Switch, Building2, ChevronLeft,
  ClipboardList
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ThemeToggle } from './theme-toggle';
import { useProject } from './ProjectContext';
import { ComplianceWorkflowSidebar } from './ComplianceWorkflowSidebar';

interface ResponsiveSidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  getProgress: () => number;
}

const navigationItems = [
  { id: 'projects', label: 'All Projects', icon: FolderOpen, category: 'main' },
  { id: 'dashboard', label: 'Dashboard', icon: Home, category: 'main' },
  { id: 'project-selection', label: 'Project Type', icon: Leaf, category: 'setup' },
  { id: 'kyc', label: 'KYC Verification', icon: Shield, category: 'setup' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, category: 'setup' },
  { id: 'documents', label: 'Documents', icon: Upload, category: 'setup' },
  { id: 'ai-assistant', label: 'AI Assistant', icon: MessageCircle, category: 'main' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, category: 'advanced' },
  { id: 'marketplace', label: 'Marketplace', icon: TrendingUp, category: 'advanced' },
  { id: 'carbon-balance', label: 'Carbon Balance', icon: Building2, category: 'buyer' },
  { id: 'collaboration', label: 'Team', icon: Users, category: 'advanced' },
  { id: 'calendar', label: 'Schedule', icon: Calendar, category: 'advanced' },
  { id: 'notifications', label: 'Notifications', icon: Bell, category: 'advanced' },
  { id: 'settings', label: 'Settings', icon: Settings, category: 'main' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, category: 'main' },
];

const getProjectIcon = (projectType: string) => {
  switch (projectType) {
    case 'carbon-avoidance':
      return { icon: Flame, color: 'text-orange-600 dark:text-orange-400', isPremier: true };
    case 'carbon-sequestration':
      return { icon: Leaf, color: 'text-blue-600 dark:text-blue-400', isPremier: false };
    default:
      return { icon: Leaf, color: 'text-green-600 dark:text-green-400', isPremier: false };
  }
};

export function ResponsiveSidebar({ currentScreen, onNavigate, getProgress }: ResponsiveSidebarProps) {
  const { projects, currentProject, currentProjectId, switchProject } = useProject();
  const [showComplianceWorkflow, setShowComplianceWorkflow] = useState(false);
  const [currentComplianceStep, setCurrentComplianceStep] = useState('monitoring-plan');
  
  const projectDetails = currentProject ? getProjectIcon(currentProject.type) : null;
  const ProjectIcon = projectDetails?.icon || Leaf;
  const progress = getProgress();

  // Determine if current project is compliance-grade (for this demo, all Premier projects are compliance-grade)
  const isComplianceProject = currentProject && projectDetails?.isPremier;

  const getItemStatus = (itemId: string) => {
    if (!currentProject) {
      return itemId === 'projects' ? 'available' : 'locked';
    }

    switch (itemId) {
      case 'projects':
        return 'available';
      case 'project-selection':
        return currentProject.setupProgress.projectTypeSelected ? 'completed' : 'pending';
      case 'kyc':
        return currentProject.setupProgress.kycCompleted ? 'completed' : 
               currentProject.setupProgress.projectTypeSelected ? 'current' : 'locked';
      case 'wallet':
        return currentProject.setupProgress.walletConnected ? 'completed' : 
               currentProject.setupProgress.kycCompleted ? 'current' : 'locked';
      case 'documents':
        return currentProject.setupProgress.documentsUploaded ? 'completed' : 
               currentProject.setupProgress.walletConnected ? 'current' : 'locked';
      case 'ai-assistant':
        return currentProject.setupProgress.aiAssistantUsed ? 'completed' : 
               currentProject.setupProgress.documentsUploaded ? 'current' : 'locked';
      case 'dashboard':
        return currentProject.setupProgress.projectTypeSelected ? 'available' : 'locked';
      case 'carbon-balance':
        return 'available';
      default:
        return progress >= 40 ? 'available' : 'locked';
    }
  };

  const renderNavigationItem = (item: any) => {
    const Icon = item.icon;
    const status = getItemStatus(item.id);
    const isActive = currentScreen === item.id;
    const isLocked = status === 'locked';
    const isCompleted = status === 'completed';
    const isCurrent = status === 'current';

    return (
      <Button
        key={item.id}
        variant={isActive ? 'default' : 'ghost'}
        className={`w-full justify-start h-10 px-3 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !isLocked && onNavigate(item.id)}
        disabled={isLocked}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <Icon className="h-4 w-4" />
            {isCompleted && (
              <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400 absolute -top-1 -right-1" />
            )}
            {isCurrent && (
              <div className="h-2 w-2 bg-blue-500 rounded-full absolute -top-1 -right-1" />
            )}
          </div>
          <span className="text-sm truncate">{item.label}</span>
        </div>
        {item.category === 'advanced' && progress < 40 && (
          <Badge variant="secondary" className="text-xs ml-auto">Pro</Badge>
        )}
      </Button>
    );
  };

  const handleComplianceStepSelect = (stepId: string) => {
    setCurrentComplianceStep(stepId);
    // Here you could also navigate to a specific compliance step screen
    // onNavigate(`compliance-${stepId}`);
  };

  if (showComplianceWorkflow && isComplianceProject) {
    return (
      <div className="flex h-full">
        {/* Main Sidebar */}
        <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-sm truncate">Carbon Credit Agent</h2>
                <p className="text-xs text-muted-foreground">AI-Powered Platform</p>
              </div>
              <ThemeToggle />
            </div>
            
            {/* Project Selector */}
            {projects.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Current Project</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs"
                    onClick={() => onNavigate('projects')}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    New
                  </Button>
                </div>
                
                <Select value={currentProjectId || ''} onValueChange={switchProject}>
                  <SelectTrigger className="h-auto p-3">
                    <SelectValue>
                      {currentProject ? (
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <ProjectIcon className={`h-4 w-4 ${projectDetails?.color}`} />
                            {projectDetails?.isPremier && (
                              <Crown className="h-2.5 w-2.5 text-yellow-600 absolute -top-0.5 -right-0.5" />
                            )}
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{currentProject.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {currentProject.details.location || 'No location set'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Select project</span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => {
                      const projDetails = getProjectIcon(project.type);
                      const ProjIcon = projDetails.icon;
                      
                      return (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-2 py-1">
                            <div className="relative">
                              <ProjIcon className={`h-4 w-4 ${projDetails.color}`} />
                              {projDetails.isPremier && (
                                <Crown className="h-2.5 w-2.5 text-yellow-600 absolute -top-0.5 -right-0.5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{project.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <Badge variant="outline" className="text-xs px-1">
                                  {project.status}
                                </Badge>
                                {projDetails.isPremier && (
                                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 text-xs px-1">
                                    Premier
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                
                {currentProject && (
                  <Card className="bg-sidebar-accent/50 border-sidebar-border">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Setup Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                        {projectDetails?.isPremier && (
                          <div className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            Premier methane project
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              {/* Compliance Workflow Toggle */}
              {isComplianceProject && (
                <div className="mb-4">
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 px-3"
                    onClick={() => setShowComplianceWorkflow(false)}
                  >
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      <span className="text-sm">Hide Compliance</span>
                    </div>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Main Navigation */}
              <div className="space-y-1">
                {navigationItems
                  .filter(item => item.category === 'main')
                  .map(renderNavigationItem)}
              </div>

              {currentProject && (
                <>
                  <Separator className="my-3" />

                  {/* Setup Process */}
                  <div className="space-y-1">
                    <p className="px-3 text-xs font-medium text-muted-foreground mb-2">Setup Process</p>
                    {navigationItems
                      .filter(item => item.category === 'setup')
                      .map(renderNavigationItem)}
                  </div>

                  {/* Buyer Features */}
                  <Separator className="my-3" />
                  <div className="space-y-1">
                    <p className="px-3 text-xs font-medium text-muted-foreground mb-2">ESG & Carbon Tracking</p>
                    {navigationItems
                      .filter(item => item.category === 'buyer')
                      .map(renderNavigationItem)}
                  </div>

                  {/* Advanced Features */}
                  {progress >= 20 && (
                    <>
                      <Separator className="my-3" />
                      <div className="space-y-1">
                        <p className="px-3 text-xs font-medium text-muted-foreground mb-2">Advanced Features</p>
                        {navigationItems
                          .filter(item => item.category === 'advanced')
                          .map(renderNavigationItem)}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-sidebar-border">
            {currentProject ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Project Owner</span>
                {currentProject.setupProgress.kycCompleted && (
                  <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground text-center">
                Select or create a project to get started
              </div>
            )}
          </div>
        </div>

        {/* Compliance Workflow Sidebar */}
        <ComplianceWorkflowSidebar
          currentStep={currentComplianceStep}
          onStepSelect={handleComplianceStepSelect}
          onClose={() => setShowComplianceWorkflow(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-sm truncate">Carbon Credit Agent</h2>
            <p className="text-xs text-muted-foreground">AI-Powered Platform</p>
          </div>
          <ThemeToggle />
        </div>
        
        {/* Project Selector */}
        {projects.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Current Project</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => onNavigate('projects')}
              >
                <Plus className="h-3 w-3 mr-1" />
                New
              </Button>
            </div>
            
            <Select value={currentProjectId || ''} onValueChange={switchProject}>
              <SelectTrigger className="h-auto p-3">
                <SelectValue>
                  {currentProject ? (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <ProjectIcon className={`h-4 w-4 ${projectDetails?.color}`} />
                        {projectDetails?.isPremier && (
                          <Crown className="h-2.5 w-2.5 text-yellow-600 absolute -top-0.5 -right-0.5" />
                        )}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{currentProject.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {currentProject.details.location || 'No location set'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select project</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => {
                  const projDetails = getProjectIcon(project.type);
                  const ProjIcon = projDetails.icon;
                  
                  return (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2 py-1">
                        <div className="relative">
                          <ProjIcon className={`h-4 w-4 ${projDetails.color}`} />
                          {projDetails.isPremier && (
                            <Crown className="h-2.5 w-2.5 text-yellow-600 absolute -top-0.5 -right-0.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{project.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Badge variant="outline" className="text-xs px-1">
                              {project.status}
                            </Badge>
                            {projDetails.isPremier && (
                              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 text-xs px-1">
                                Premier
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            {currentProject && (
              <Card className="bg-sidebar-accent/50 border-sidebar-border">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Setup Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                    {projectDetails?.isPremier && (
                      <div className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        Premier methane project
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {projects.length === 0 && (
          <Card className="bg-sidebar-accent/50 border-sidebar-border">
            <CardContent className="p-3 text-center">
              <FolderOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-2">No projects yet</p>
              <Button 
                size="sm" 
                className="w-full h-7 text-xs"
                onClick={() => onNavigate('projects')}
              >
                <Plus className="h-3 w-3 mr-1" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {/* Compliance Workflow Toggle */}
          {isComplianceProject && (
            <div className="mb-4">
              <Button
                variant="outline"
                className="w-full justify-between h-10 px-3"
                onClick={() => setShowComplianceWorkflow(true)}
              >
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  <span className="text-sm">Compliance Workflow</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 text-xs">
                  Premier
                </Badge>
              </Button>
            </div>
          )}

          {/* Main Navigation */}
          <div className="space-y-1">
            {navigationItems
              .filter(item => item.category === 'main')
              .map(renderNavigationItem)}
          </div>

          {currentProject && (
            <>
              <Separator className="my-3" />

              {/* Setup Process */}
              <div className="space-y-1">
                <p className="px-3 text-xs font-medium text-muted-foreground mb-2">Setup Process</p>
                {navigationItems
                  .filter(item => item.category === 'setup')
                  .map(renderNavigationItem)}
              </div>

              {/* Buyer Features */}
              <Separator className="my-3" />
              <div className="space-y-1">
                <p className="px-3 text-xs font-medium text-muted-foreground mb-2">ESG & Carbon Tracking</p>
                {navigationItems
                  .filter(item => item.category === 'buyer')
                  .map(renderNavigationItem)}
              </div>

              {/* Advanced Features */}
              {progress >= 20 && (
                <>
                  <Separator className="my-3" />
                  <div className="space-y-1">
                    <p className="px-3 text-xs font-medium text-muted-foreground mb-2">Advanced Features</p>
                    {navigationItems
                      .filter(item => item.category === 'advanced')
                      .map(renderNavigationItem)}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        {currentProject ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>Project Owner</span>
            {currentProject.setupProgress.kycCompleted && (
              <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center">
            Select or create a project to get started
          </div>
        )}
      </div>
    </div>
  );
}