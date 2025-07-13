import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Edit, Trash2, Copy, Archive,
  Leaf, Flame, Zap, Crown, Calendar, Users, DollarSign, TrendingUp,
  CheckCircle, Clock, AlertTriangle, Star, Eye, FolderOpen, Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { useProject, Project } from './ProjectContext';
import { useResponsive } from './ui/use-responsive';

interface ProjectsManagerProps {
  onNavigate: (screen: string) => void;
}

const projectTypeConfig = {
  'carbon-avoidance': {
    label: 'Carbon Avoidance',
    icon: Flame,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    isPremier: true,
  },
  'carbon-sequestration': {
    label: 'Carbon Sequestration',
    icon: Leaf,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    isPremier: false,
  },
  'energy-efficiency': {
    label: 'Energy Efficiency',
    icon: Zap,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    isPremier: false,
  },
};

const statusConfig = {
  setup: { label: 'Setup', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
  validation: { label: 'Validation', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
  registered: { label: 'Registered', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  active: { label: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
  paused: { label: 'Paused', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
};

const projectTemplates = [
  // Premier Carbon Avoidance (Methane) Projects
  {
    id: 'cdm-acm0001-landfill',
    name: 'CDM ACM0001: Landfill Gas Capture & Flaring',
    description: 'Capture and flare or utilize landfill gas to prevent methane emissions',
    emoji: '🏭',
    type: 'carbon-avoidance' as const,
    estimatedCredits: 15000,
    estimatedRevenue: 225000,
    duration: '10 years',
    isPremier: true,
    standard: 'CDM',
    methodology: 'ACM0001',
  },
  {
    id: 'cdm-ams-iii-d-manure',
    name: 'CDM AMS-III.D: Animal Manure Methane Recovery',
    description: 'Methane recovery and utilization from animal manure management systems',
    emoji: '🏭',
    type: 'carbon-avoidance' as const,
    estimatedCredits: 8500,
    estimatedRevenue: 127500,
    duration: '7 years',
    isPremier: true,
    standard: 'CDM',
    methodology: 'AMS-III.D',
  },
  {
    id: 'cdm-ams-iii-h-wastewater',
    name: 'CDM AMS-III.H: Wastewater Methane Recovery',
    description: 'Methane recovery and utilization in wastewater treatment facilities',
    emoji: '🏦',
    type: 'carbon-avoidance' as const,
    estimatedCredits: 12000,
    estimatedRevenue: 180000,
    duration: '15 years',
    isPremier: true,
    standard: 'CDM',
    methodology: 'AMS-III.H',
  },
  {
    id: 'cdm-ams-iii-f-composting',
    name: 'CDM AMS-III.F: Methane Avoidance Through Composting',
    description: 'Prevent methane emissions through controlled composting of organic waste',
    emoji: '🏭',
    type: 'carbon-avoidance' as const,
    estimatedCredits: 6500,
    estimatedRevenue: 97500,
    duration: '5 years',
    isPremier: true,
    standard: 'CDM',
    methodology: 'AMS-III.F',
  },
  {
    id: 'vm0041-enteric-methane',
    name: 'VM0041: Enteric Methane Reduction in Ruminants',
    description: 'Reduce enteric methane emissions from livestock through feed additives and management',
    emoji: '🏭',
    type: 'carbon-avoidance' as const,
    estimatedCredits: 9200,
    estimatedRevenue: 138000,
    duration: '8 years',
    isPremier: true,
    standard: 'VCS',
    methodology: 'VM0041',
  },
  {
    id: 'rice-methane-reduction',
    name: 'Methane Reduction in Rice Cultivation',
    description: 'Adjusted water management practices to reduce methane emissions in rice fields',
    emoji: '🍚',
    type: 'carbon-avoidance' as const,
    estimatedCredits: 4800,
    estimatedRevenue: 72000,
    duration: '20 years',
    isPremier: true,
    standard: 'VCS',
    methodology: 'VM0016',
  },

  // Carbon Sequestration Projects
  {
    id: 'verra-redd-vm0007',
    name: 'Verra REDD+ VM0007: Forest Conservation',
    description: 'Reducing emissions from deforestation and forest degradation with sustainable management',
    emoji: '🌲',
    type: 'carbon-sequestration' as const,
    estimatedCredits: 25000,
    estimatedRevenue: 375000,
    duration: '30 years',
    isPremier: false,
    standard: 'VCS',
    methodology: 'VM0007',
  },
  {
    id: 'vm0047-arr',
    name: 'VM0047: Afforestation, Reforestation & Revegetation',
    description: 'Large-scale tree planting and forest restoration for carbon sequestration',
    emoji: '🌲',
    type: 'carbon-sequestration' as const,
    estimatedCredits: 18500,
    estimatedRevenue: 277500,
    duration: '25 years',
    isPremier: false,
    standard: 'VCS',
    methodology: 'VM0047',
  },
  {
    id: 'gold-standard-arr',
    name: 'Gold Standard Afforestation & Reforestation v2.0',
    description: 'Community-focused afforestation and reforestation with social co-benefits',
    emoji: '🌲',
    type: 'carbon-sequestration' as const,
    estimatedCredits: 15000,
    estimatedRevenue: 225000,
    duration: '20 years',
    isPremier: false,
    standard: 'Gold Standard',
    methodology: 'AR v2.0',
  },
  {
    id: 'vm0042-agricultural',
    name: 'VM0042: Improved Agricultural Land Management',
    description: 'Sustainable farming practices to increase soil carbon sequestration',
    emoji: '👩‍🌾',
    type: 'carbon-sequestration' as const,
    estimatedCredits: 12000,
    estimatedRevenue: 180000,
    duration: '15 years',
    isPremier: false,
    standard: 'VCS',
    methodology: 'VM0042',
  },
  {
    id: 'vm0017-sustainable-ag',
    name: 'VM0017: Sustainable Agricultural Land Management',
    description: 'Adoption of climate-smart agricultural practices for soil carbon enhancement',
    emoji: '👩‍🌾',
    type: 'carbon-sequestration' as const,
    estimatedCredits: 8800,
    estimatedRevenue: 132000,
    duration: '12 years',
    isPremier: false,
    standard: 'VCS',
    methodology: 'VM0017',
  },
  {
    id: 'vm0044-biochar',
    name: 'VM0044: Biochar Utilization in Soil Applications',
    description: 'Long-term carbon storage through biochar production and soil application',
    emoji: '🏭',
    type: 'carbon-sequestration' as const,
    estimatedCredits: 14500,
    estimatedRevenue: 217500,
    duration: '50 years',
    isPremier: false,
    standard: 'VCS',
    methodology: 'VM0044',
  },
  {
    id: 'concrete-carbonation',
    name: 'Accelerated Carbonation of Concrete Aggregate',
    description: 'Carbon sequestration through accelerated carbonation in concrete production',
    emoji: '🥇',
    type: 'carbon-sequestration' as const,
    estimatedCredits: 6200,
    estimatedRevenue: 93000,
    duration: '10 years',
    isPremier: false,
    standard: 'VCS',
    methodology: 'Carbon Cure',
  },

  // Energy Efficiency Projects
  {
    id: 'cdm-acm0002-renewable',
    name: 'CDM ACM0002: Grid-Connected Renewable Energy',
    description: 'Large-scale renewable electricity generation displacing fossil fuel power',
    emoji: '🏨',
    type: 'energy-efficiency' as const,
    estimatedCredits: 45000,
    estimatedRevenue: 675000,
    duration: '20 years',
    isPremier: false,
    standard: 'CDM',
    methodology: 'ACM0002',
  },
  {
    id: 'gccm001-renewable',
    name: 'GCCM001 v.4: Renewable Energy Generation',
    description: 'Renewable energy projects supplying clean electricity to the grid',
    emoji: '💡',
    type: 'energy-efficiency' as const,
    estimatedCredits: 38000,
    estimatedRevenue: 570000,
    duration: '25 years',
    isPremier: false,
    standard: 'Global Carbon Council',
    methodology: 'GCCM001',
  },
  {
    id: 'cdm-ams-ia-user-generation',
    name: 'CDM AMS-I.A: User Electricity Generation',
    description: 'Small-scale renewable electricity generation for on-site consumption',
    emoji: '🏨',
    type: 'energy-efficiency' as const,
    estimatedCredits: 8500,
    estimatedRevenue: 127500,
    duration: '15 years',
    isPremier: false,
    standard: 'CDM',
    methodology: 'AMS-I.A',
  },
  {
    id: 'cdm-ams-id-grid-renewable',
    name: 'CDM AMS-I.D: Grid Connected Renewable Generation',
    description: 'Small-scale renewable energy systems connected to the electricity grid',
    emoji: '🏭',
    type: 'energy-efficiency' as const,
    estimatedCredits: 12000,
    estimatedRevenue: 180000,
    duration: '20 years',
    isPremier: false,
    standard: 'CDM',
    methodology: 'AMS-I.D',
  },
  {
    id: 'improved-cookstoves',
    name: 'Improved Cookstove Programs',
    description: 'Distribution of efficient cookstoves to reduce biomass consumption and emissions',
    emoji: '♨️',
    type: 'energy-efficiency' as const,
    estimatedCredits: 15000,
    estimatedRevenue: 225000,
    duration: '10 years',
    isPremier: false,
    standard: 'Gold Standard',
    methodology: 'TPDDTEC',
  },
  {
    id: 'goldstandard-metered-cooking',
    name: 'Gold Standard: Metered Energy Cooking',
    description: 'Clean cooking solutions with metered energy distribution systems',
    emoji: '♨️',
    type: 'energy-efficiency' as const,
    estimatedCredits: 11500,
    estimatedRevenue: 172500,
    duration: '8 years',
    isPremier: false,
    standard: 'Gold Standard',
    methodology: 'TPDDTEC',
  },
  {
    id: 'cdm-ams-iiij-efficient-lighting',
    name: 'CDM AMS-II.J: Efficient Lighting Technologies',
    description: 'Demand-side programs for energy-efficient LED and CFL lighting systems',
    emoji: '🏛️',
    type: 'energy-efficiency' as const,
    estimatedCredits: 7800,
    estimatedRevenue: 117000,
    duration: '12 years',
    isPremier: false,
    standard: 'CDM',
    methodology: 'AMS-II.J',
  },
  {
    id: 'cdm-acm0006-biomass',
    name: 'CDM ACM0006: Electricity & Heat from Biomass',
    description: 'Combined heat and power generation from sustainable biomass sources',
    emoji: '🏭',
    type: 'energy-efficiency' as const,
    estimatedCredits: 22000,
    estimatedRevenue: 330000,
    duration: '15 years',
    isPremier: false,
    standard: 'CDM',
    methodology: 'ACM0006',
  },
  {
    id: 'verra-vmr0006-thermal',
    name: 'Verra VMR0006: Energy Efficiency in Thermal Applications',
    description: 'Energy efficiency improvements and fuel switching in industrial thermal processes',
    emoji: '⛽',
    type: 'energy-efficiency' as const,
    estimatedCredits: 16500,
    estimatedRevenue: 247500,
    duration: '12 years',
    isPremier: false,
    standard: 'VCS',
    methodology: 'VMR0006',
  },
];

export function ProjectsManager({ onNavigate }: ProjectsManagerProps) {
  const { isMobile } = useResponsive();
  const { 
    projects, 
    currentProjectId, 
    createProject, 
    updateProject, 
    deleteProject, 
    switchProject,
    archiveProject,
    duplicateProject,
    getProjectProgress,
    getPortfolioStats 
  } = useProject();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState('all');
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    type: 'carbon-avoidance' as const,
    location: '',
  });

  const portfolioStats = getPortfolioStats();

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesType = typeFilter === 'all' || project.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredTemplates = projectTemplates.filter(template => {
    return selectedTemplateType === 'all' || template.type === selectedTemplateType;
  });

  const handleCreateProject = async () => {
    if (!newProjectData.name.trim()) return;
    
    const projectId = await createProject({
      name: newProjectData.name,
      description: newProjectData.description,
      type: newProjectData.type,
      details: {
        location: newProjectData.location,
        startDate: new Date().toISOString().split('T')[0],
        estimatedDuration: '18 months',
        standard: 'VCS',
        estimatedCreditsPerYear: newProjectData.type === 'carbon-avoidance' ? 12450 : 2450,
        currency: 'USD',
        timezone: 'America/New_York',
      },
    });
    
    setIsCreateDialogOpen(false);
    setNewProjectData({
      name: '',
      description: '',
      type: 'carbon-avoidance',
      location: '',
    });
    
    // Navigate to the new project
    onNavigate('project-selection');
  };

  const handleCreateFromTemplate = async (template: typeof projectTemplates[0]) => {
    const projectId = await createProject({
      name: template.name,
      description: template.description,
      type: template.type,
      details: {
        location: '',
        startDate: new Date().toISOString().split('T')[0],
        estimatedDuration: template.duration,
        standard: template.standard as any,
        methodology: template.methodology,
        estimatedCreditsPerYear: template.estimatedCredits,
        currency: 'USD',
        timezone: 'America/New_York',
      },
    });
    
    setIsTemplateDialogOpen(false);
    onNavigate('project-selection');
  };

  const handleProjectAction = async (project: Project, action: string) => {
    switch (action) {
      case 'open':
        switchProject(project.id);
        onNavigate('dashboard');
        break;
      case 'edit':
        switchProject(project.id);
        onNavigate('settings');
        break;
      case 'duplicate':
        await duplicateProject(project.id);
        break;
      case 'archive':
        archiveProject(project.id);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
          deleteProject(project.id);
        }
        break;
    }
  };

  const renderProjectCard = (project: Project) => {
    const typeConfig = projectTypeConfig[project.type];
    const TypeIcon = typeConfig.icon;
    const progress = getProjectProgress(project.id);
    const isCurrentProject = project.id === currentProjectId;

    return (
      <Card 
        key={project.id} 
        className={`relative cursor-pointer transition-all hover:shadow-md ${
          isCurrentProject ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => {
          switchProject(project.id);
          onNavigate('dashboard');
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${typeConfig.bgColor} flex items-center justify-center relative`}>
                <TypeIcon className={`h-6 w-6 ${typeConfig.color}`} />
                {typeConfig.isPremier && (
                  <Crown className="h-4 w-4 text-yellow-600 absolute -top-1 -right-1" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-base flex items-center gap-2">
                  {project.name}
                  {isCurrentProject && (
                    <Badge variant="secondary" className="text-xs">Current</Badge>
                  )}
                  {typeConfig.isPremier && (
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 text-xs">
                      Premier
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm">
                  {project.description || typeConfig.label}
                </CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleProjectAction(project, 'open');
                }}>
                  <Eye className="h-4 w-4 mr-2" />
                  Open Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleProjectAction(project, 'edit');
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleProjectAction(project, 'duplicate');
                }}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleProjectAction(project, 'archive');
                }}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectAction(project, 'delete');
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <Badge className={statusConfig[project.status].color}>
              {statusConfig[project.status].label}
            </Badge>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              {project.team.members.length} members
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Credits/Year:</span>
              <div className="font-medium">{project.details.estimatedCreditsPerYear.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Location:</span>
              <div className="font-medium">{project.details.location || 'Not set'}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Revenue:</span>
              <div className="font-medium text-green-600">
                ${project.financial.actualRevenue.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Progress:</span>
              <div className="font-medium">{Math.round(progress)}%</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Setup Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {typeConfig.isPremier && (
            <div className="p-2 bg-orange-50 dark:bg-orange-900/10 rounded border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-orange-700 dark:text-orange-300 flex items-center gap-1">
                <Flame className="h-3 w-3" />
                Premier methane project with 80x climate impact
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold">Project Portfolio</h1>
          <p className="text-muted-foreground">Manage your carbon credit projects and track progress</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Star className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-[95vw] lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader className="pb-4">
                <DialogTitle>Project Methodology Templates</DialogTitle>
                <DialogDescription>
                  Choose from proven carbon credit methodologies to start your project
                </DialogDescription>
              </DialogHeader>
              
              {/* Template Type Filter */}
              <div className="flex gap-2 mb-4 border-b pb-4">
                <Button
                  variant={selectedTemplateType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTemplateType('all')}
                >
                  All Templates
                </Button>
                <Button
                  variant={selectedTemplateType === 'carbon-avoidance' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTemplateType('carbon-avoidance')}
                  className="flex items-center gap-2"
                >
                  <Flame className="h-4 w-4" />
                  Methane (Premier)
                </Button>
                <Button
                  variant={selectedTemplateType === 'carbon-sequestration' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTemplateType('carbon-sequestration')}
                  className="flex items-center gap-2"
                >
                  <Leaf className="h-4 w-4" />
                  Sequestration
                </Button>
                <Button
                  variant={selectedTemplateType === 'energy-efficiency' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTemplateType('energy-efficiency')}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Energy Efficiency
                </Button>
              </div>

              {/* Templates Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                  {filteredTemplates.map((template) => {
                    const typeConfig = projectTypeConfig[template.type];
                    
                    return (
                      <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Icon Section */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="text-2xl">{template.emoji}</div>
                              <div className={`w-12 h-12 rounded-lg ${typeConfig.bgColor} flex items-center justify-center relative`}>
                                <typeConfig.icon className={`h-6 w-6 ${typeConfig.color}`} />
                                {template.isPremier && (
                                  <Crown className="h-3 w-3 text-yellow-600 absolute -top-1 -right-1" />
                                )}
                              </div>
                            </div>
                            
                            {/* Content Section */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium leading-tight">{template.name}</h3>
                                    {template.isPremier && (
                                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 text-xs">
                                        Premier
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                    {template.description}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Stats Row */}
                              <div className="grid grid-cols-4 gap-3 mb-3 text-xs">
                                <div className="text-center">
                                  <div className="text-muted-foreground">Credits/Year</div>
                                  <div className="font-medium">{template.estimatedCredits.toLocaleString()}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-muted-foreground">Revenue</div>
                                  <div className="font-medium text-green-600">${template.estimatedRevenue.toLocaleString()}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-muted-foreground">Duration</div>
                                  <div className="font-medium">{template.duration}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-muted-foreground">Standard</div>
                                  <div className="font-medium">{template.standard}</div>
                                </div>
                              </div>
                              
                              {/* Premier Badge for Special Projects */}
                              {template.isPremier && (
                                <div className="mb-3 p-2 bg-orange-50 dark:bg-orange-900/10 rounded border border-orange-200 dark:border-orange-800">
                                  <p className="text-xs text-orange-700 dark:text-orange-300 flex items-center gap-1">
                                    <Flame className="h-3 w-3" />
                                    <strong>Premier methane project</strong> - 80x more climate impact than CO₂
                                  </p>
                                </div>
                              )}
                              
                              {/* Action Button */}
                              <Button 
                                size="sm"
                                className="w-full"
                                onClick={() => handleCreateFromTemplate(template)}
                              >
                                Use This Methodology
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Start a new carbon credit project from scratch
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    value={newProjectData.name}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Describe your project"
                    rows={3}
                    value={newProjectData.description}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="project-type">Project Type</Label>
                  <Select 
                    value={newProjectData.type} 
                    onValueChange={(value: any) => setNewProjectData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(projectTypeConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon className={`h-4 w-4 ${config.color}`} />
                            <span>{config.label}</span>
                            {config.isPremier && (
                              <Crown className="h-3 w-3 text-yellow-600" />
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="project-location">Location</Label>
                  <Input
                    id="project-location"
                    placeholder="Project location"
                    value={newProjectData.location}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} disabled={!newProjectData.name.trim()}>
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-blue-600" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{portfolioStats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">All projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{portfolioStats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-purple-600" />
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{portfolioStats.totalCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Credits issued</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${portfolioStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="setup">Setup Required</TabsTrigger>
          </TabsList>
          
          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(projectTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <config.icon className={`h-4 w-4 ${config.color}`} />
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map(renderProjectCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">
                  {projects.length === 0 
                    ? "Get started by creating your first carbon credit project"
                    : "Try adjusting your search or filter criteria"
                  }
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects
              .filter(p => p.status === 'active' || p.status === 'in-progress')
              .map(renderProjectCard)}
          </div>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects
              .filter(p => getProjectProgress(p.id) < 100)
              .map(renderProjectCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}