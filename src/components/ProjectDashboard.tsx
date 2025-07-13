import React from 'react';
import { 
  Leaf, Shield, Wallet, Upload, MessageCircle, CheckCircle, 
  Clock, TrendingUp, DollarSign, Users, Settings, FileText,
  ExternalLink, Calendar, BarChart3, Crown, Flame
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface ProjectDashboardProps {
  userData: any;
  onNavigate: (screen: string) => void;
}

const getProjectDetails = (projectType: string) => {
  switch (projectType) {
    case 'carbon-avoidance':
      return {
        title: 'Carbon Avoidance Project',
        subtitle: 'Methane Prevention',
        icon: Flame,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        isPremier: true,
        stats: {
          estimatedCredits: '12,450',
          potentialRevenue: '$124,500',
          timeToMarket: '8 weeks',
          multiplier: '80x Impact'
        }
      };
    case 'carbon-sequestration':
      return {
        title: 'Carbon Sequestration Project',
        subtitle: 'Carbon Storage',
        icon: Leaf,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        isPremier: false,
        stats: {
          estimatedCredits: '2,450',
          potentialRevenue: '$24,500',
          timeToMarket: '12 weeks',
          multiplier: 'Standard'
        }
      };
    default:
      return {
        title: 'Energy Efficiency Project',
        subtitle: 'Energy Optimization',
        icon: Leaf,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        isPremier: false,
        stats: {
          estimatedCredits: '1,200',
          potentialRevenue: '$12,000',
          timeToMarket: '10 weeks',
          multiplier: 'Standard'
        }
      };
  }
};

const milestones = [
  { id: 1, title: 'Project Selection', completed: true, date: 'Dec 20, 2024' },
  { id: 2, title: 'KYC Verification', completed: true, date: 'Dec 21, 2024' },
  { id: 3, title: 'Wallet Connection', completed: true, date: 'Dec 21, 2024' },
  { id: 4, title: 'Document Upload', completed: true, date: 'Dec 22, 2024' },
  { id: 5, title: 'AI Consultation', completed: true, date: 'Dec 22, 2024' },
  { id: 6, title: 'Methodology Approval', completed: false, date: 'Est. Jan 5, 2025' },
  { id: 7, title: 'Third-party Validation', completed: false, date: 'Est. Jan 20, 2025' },
  { id: 8, title: 'Project Registration', completed: false, date: 'Est. Feb 10, 2025' }
];

const quickActions = [
  { icon: FileText, label: 'View Documents', action: 'documents' },
  { icon: MessageCircle, label: 'AI Assistant', action: 'ai-assistant' },
  { icon: Settings, label: 'Project Settings', action: 'settings' },
  { icon: BarChart3, label: 'Analytics', action: 'analytics' }
];

export function ProjectDashboard({ userData, onNavigate }: ProjectDashboardProps) {
  const completedMilestones = milestones.filter(m => m.completed).length;
  const progressPercentage = (completedMilestones / milestones.length) * 100;
  const projectDetails = getProjectDetails(userData.projectType);
  const ProjectIcon = projectDetails.icon;

  return (
    <div className="p-4 pb-20 bg-background min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-xl mb-2">Project Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Track your carbon credit project progress
          </p>
        </div>

        {/* Project Overview */}
        <Card className={projectDetails.isPremier ? 'border-orange-200 dark:border-orange-800' : ''}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${projectDetails.bgColor} flex items-center justify-center relative`}>
                <ProjectIcon className={`h-4 w-4 ${projectDetails.color}`} />
                {projectDetails.isPremier && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="h-2.5 w-2.5 text-yellow-800" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span>{projectDetails.title}</span>
                  {projectDetails.isPremier && (
                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      Premier
                    </Badge>
                  )}
                </div>
              </div>
            </CardTitle>
            <CardDescription>
              {projectDetails.subtitle} • {projectDetails.stats.multiplier}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectDetails.isPremier && (
              <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  Premier methane prevention project with 80x climate impact
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className={`text-lg font-medium ${projectDetails.isPremier ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                  {projectDetails.stats.estimatedCredits}
                </div>
                <div className="text-xs text-muted-foreground">Est. Credits/Year</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  {projectDetails.stats.potentialRevenue}
                </div>
                <div className="text-xs text-muted-foreground">Potential Revenue</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-sm">
              <span>Project Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Time to Market: {projectDetails.stats.timeToMarket}</span>
              </div>
              <Badge variant="secondary">In Progress</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                    onClick={() => onNavigate(action.action)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="flex-1">AI analysis completed</span>
              <span className="text-muted-foreground text-xs">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="flex-1">Documents uploaded</span>
              <span className="text-muted-foreground text-xs">1 day ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="flex-1">Wallet connected</span>
              <span className="text-muted-foreground text-xs">1 day ago</span>
            </div>
          </CardContent>
        </Card>

        {/* Project Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestones.slice(0, 6).map((milestone, index) => (
                <div key={milestone.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    milestone.completed 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {milestone.completed ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {milestone.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4" size="sm">
              View All Milestones
            </Button>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Submit Methodology Application</p>
                  <p className="text-xs text-muted-foreground">
                    {projectDetails.isPremier 
                      ? 'Submit premium methane methodology for faster approval'
                      : 'Based on AI analysis, submit methodology application'
                    }
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Start
                </Button>
              </div>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Connect with Validator</p>
                  <p className="text-xs text-muted-foreground">
                    {projectDetails.isPremier
                      ? 'Priority validation for premier methane projects'
                      : 'Schedule third-party validation appointment'
                    }
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Connect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('ai-assistant')}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with AI Assistant
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}