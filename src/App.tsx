import React, { useState } from 'react';
import { Leaf, Shield, Zap, Upload, MessageCircle, Wallet, User, CheckCircle, ArrowLeft, Menu } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { ProjectSelection } from './components/ProjectSelection';
import { KYCProcess } from './components/KYCProcess';
import { WalletConnection } from './components/WalletConnection';
import { DocumentUpload } from './components/DocumentUpload';
import { AIAssistant } from './components/AIAssistant';
import { ProjectDashboard } from './components/ProjectDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Marketplace } from './components/Marketplace';
import { TeamCollaboration } from './components/TeamCollaboration';
import { CalendarScheduling } from './components/CalendarScheduling';
import { NotificationsCenter } from './components/NotificationsCenter';
import { SettingsManagement } from './components/SettingsManagement';
import { ProjectsManager } from './components/ProjectsManager';
import { CarbonBalanceSheet } from './components/CarbonBalanceSheet';
import { ComplianceStepScreen } from './components/ComplianceStepScreen';
import { ResponsiveSidebar } from './components/ResponsiveSidebar';
import { ThemeProvider } from './components/theme-provider';
import { ThemeToggle } from './components/theme-toggle';
import { ProjectProvider, useProject } from './components/ProjectContext';
import { useResponsive } from './components/ui/use-responsive';

type Screen = 'welcome' | 'projects' | 'project-selection' | 'kyc' | 'wallet' | 'documents' | 'ai-assistant' | 'dashboard' | 
              'analytics' | 'marketplace' | 'collaboration' | 'calendar' | 'notifications' | 'settings' | 'carbon-balance' | 
              'help' | 'compliance-step';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [currentComplianceStep, setCurrentComplianceStep] = useState('monitoring-plan');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile, isTabletOrLarger } = useResponsive();
  const { projects, currentProject, updateProject, getProjectProgress, getPortfolioStats } = useProject();

  const updateProjectData = (updates: any) => {
    if (!currentProject) return;
    
    const updatedProject = {
      ...currentProject,
      setupProgress: {
        ...currentProject.setupProgress,
        ...updates,
      },
    };
    
    updateProject(currentProject.id, updatedProject);
  };

  const getProgress = () => {
    if (!currentProject) return 0;
    return getProjectProgress(currentProject.id);
  };

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen as Screen);
    setSidebarOpen(false); // Close mobile sidebar on navigation
  };

  const handleComplianceStepChange = (stepId: string) => {
    setCurrentComplianceStep(stepId);
    setCurrentScreen('compliance-step');
  };

  const renderMobileHeader = () => {
    if (currentScreen === 'welcome') return null;
    
    return (
      <div className="bg-card border-b border-border p-4 lg:hidden">
        <div className="flex items-center gap-3 mb-3">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <ResponsiveSidebar 
                currentScreen={currentScreen}
                onNavigate={handleNavigation}
                getProgress={getProgress}
              />
            </SheetContent>
          </Sheet>
          
          {currentScreen !== 'dashboard' && currentScreen !== 'welcome' && currentScreen !== 'projects' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                if (projects.length === 0) {
                  setCurrentScreen('welcome');
                } else {
                  setCurrentScreen(currentProject ? 'dashboard' : 'projects');
                }
              }}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex-1">
            <h1 className="text-lg">Carbon Credit Policy Agent</h1>
            <p className="text-sm text-muted-foreground">
              {currentProject ? currentProject.name : 'AI-Powered Project Management'}
            </p>
          </div>
          <ThemeToggle />
        </div>
        
        {currentProject && getProgress() > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Setup Progress</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        )}
      </div>
    );
  };

  const renderWelcomeScreen = () => {
    const portfolioStats = getPortfolioStats();
    const hasProjects = projects.length > 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20 dark:bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Carbon Credit Policy Agent</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                AI-powered platform for carbon avoidance, sequestration, and energy efficiency projects
              </p>
            </div>

            {/* Portfolio Stats for Existing Users */}
            {hasProjects && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{portfolioStats.totalProjects}</div>
                    <div className="text-sm text-muted-foreground">Total Projects</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{portfolioStats.activeProjects}</div>
                    <div className="text-sm text-muted-foreground">Active Projects</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">{portfolioStats.totalCredits.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Credits</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">${portfolioStats.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                    <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">Project Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Choose from premier methane projects or traditional carbon solutions with AI guidance
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Compliance & KYC</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Streamlined verification process with automated compliance checking
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
                    <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">AI Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Intelligent guidance for methodology selection and project optimization
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-4">
              {hasProjects ? (
                <>
                  <Button 
                    size="lg" 
                    className="h-14 px-8 text-lg"
                    onClick={() => setCurrentScreen('projects')}
                  >
                    Manage Your Projects
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="h-14 px-8 text-lg bg-card/50 backdrop-blur-sm"
                    onClick={() => setCurrentScreen('projects')}
                  >
                    Create New Project
                  </Button>
                </>
              ) : (
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg"
                  onClick={() => setCurrentScreen('projects')}
                >
                  Start Your First Project
                </Button>
              )}
            </div>

            {/* Additional Features for Desktop */}
            {isTabletOrLarger && (
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className="w-5 h-5" />
                      Advanced Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Track your carbon credit performance with real-time analytics and market insights
                    </p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Real-time credit generation tracking</li>
                      <li>• Market price analysis</li>
                      <li>• Environmental impact metrics</li>
                      <li>• Revenue projections</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Marketplace Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Access the global carbon credit marketplace directly from your dashboard
                    </p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Buy and sell verified credits</li>
                      <li>• Premier methane project listings</li>
                      <li>• Automated buyer matching</li>
                      <li>• Competitive price discovery</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="mt-12 text-center text-muted-foreground">
              <p>Powered by AI Policy Engine • Trusted by 500+ Projects Worldwide</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (currentScreen === 'welcome') {
      return renderWelcomeScreen();
    }

    const content = (() => {
      switch (currentScreen) {
        case 'projects':
          return <ProjectsManager onNavigate={handleNavigation} />;

        case 'project-selection':
          return (
            <ProjectSelection 
              onComplete={(projectType) => {
                updateProjectData({ projectTypeSelected: true });
                setCurrentScreen('kyc');
              }}
              selectedType={currentProject?.type}
            />
          );

        case 'kyc':
          return (
            <KYCProcess 
              onComplete={() => {
                updateProjectData({ kycCompleted: true });
                setCurrentScreen('wallet');
              }}
              completed={currentProject?.setupProgress.kycCompleted}
            />
          );

        case 'wallet':
          return (
            <WalletConnection 
              onComplete={() => {
                updateProjectData({ walletConnected: true });
                setCurrentScreen('documents');
              }}
              connected={currentProject?.setupProgress.walletConnected}
            />
          );

        case 'documents':
          return (
            <DocumentUpload 
              onComplete={() => {
                updateProjectData({ documentsUploaded: true });
                setCurrentScreen('ai-assistant');
              }}
              completed={currentProject?.setupProgress.documentsUploaded}
            />
          );

        case 'ai-assistant':
          return (
            <AIAssistant 
              userData={currentProject}
              onComplete={() => {
                updateProjectData({ aiAssistantUsed: true });
                setCurrentScreen('dashboard');
              }}
            />
          );

        case 'compliance-step':
          return (
            <ComplianceStepScreen
              stepId={currentComplianceStep}
              onNavigate={handleNavigation}
              onStepChange={handleComplianceStepChange}
            />
          );

        case 'dashboard':
          if (!currentProject) {
            return (
              <div className="p-6">
                <div className="max-w-2xl mx-auto text-center space-y-4">
                  <h1 className="text-2xl font-semibold">No Project Selected</h1>
                  <p className="text-muted-foreground">
                    Please select a project from your portfolio or create a new one to continue.
                  </p>
                  <Button onClick={() => setCurrentScreen('projects')}>
                    Go to Projects
                  </Button>
                </div>
              </div>
            );
          }
          return (
            <ProjectDashboard 
              userData={currentProject}
              onNavigate={handleNavigation}
            />
          );

        case 'analytics':
          return currentProject ? <AnalyticsDashboard userData={currentProject} /> : null;

        case 'marketplace':
          return <Marketplace userData={currentProject} />;

        case 'collaboration':
          return currentProject ? <TeamCollaboration userData={currentProject} /> : null;

        case 'calendar':
          return currentProject ? <CalendarScheduling userData={currentProject} /> : null;

        case 'notifications':
          return currentProject ? <NotificationsCenter userData={currentProject} /> : null;

        case 'settings':
          return currentProject ? <SettingsManagement userData={currentProject} /> : null;

        case 'carbon-balance':
          return <CarbonBalanceSheet />;

        case 'help':
          return (
            <div className="p-6">
              <div className="max-w-2xl mx-auto text-center space-y-4">
                <h1 className="text-2xl font-semibold">Help & Support</h1>
                <p className="text-muted-foreground">
                  This feature is coming soon! We're working hard to bring you the best experience.
                </p>
                <Button onClick={() => setCurrentScreen(currentProject ? 'dashboard' : 'projects')}>
                  {currentProject ? 'Back to Dashboard' : 'Back to Projects'}
                </Button>
              </div>
            </div>
          );

        default:
          return null;
      }
    })();

    // Desktop/Tablet Layout with Sidebar
    if (isTabletOrLarger) {
      return (
        <div className="flex h-screen bg-background">
          <ResponsiveSidebar 
            currentScreen={currentScreen}
            onNavigate={handleNavigation}
            getProgress={getProgress}
          />
          <div className="flex-1 overflow-auto">
            {content}
          </div>
        </div>
      );
    }

    // Mobile Layout
    return (
      <div className="min-h-screen bg-background">
        {content}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {renderMobileHeader()}
      {renderContent()}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </ThemeProvider>
  );
}