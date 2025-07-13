import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'carbon-avoidance' | 'carbon-sequestration' | 'energy-efficiency';
  status: 'setup' | 'in-progress' | 'validation' | 'registered' | 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
  
  // Progress tracking
  setupProgress: {
    projectTypeSelected: boolean;
    kycCompleted: boolean;
    walletConnected: boolean;
    documentsUploaded: boolean;
    aiAssistantUsed: boolean;
  };
  
  // Project details
  details: {
    location: string;
    startDate: string;
    estimatedDuration: string;
    standard: 'VCS' | 'CAR' | 'Gold-Standard' | 'ACR';
    methodology?: string;
    estimatedCreditsPerYear: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD';
    timezone: string;
  };
  
  // Team and collaboration
  team: {
    members: Array<{
      id: string;
      name: string;
      email: string;
      role: 'project-owner' | 'project-manager' | 'technical-lead' | 'validator' | 'consultant';
      status: 'active' | 'pending' | 'invited';
      joinedAt?: string;
    }>;
  };
  
  // Financial data
  financial: {
    estimatedRevenue: number;
    actualRevenue: number;
    creditsIssued: number;
    creditsTraded: number;
    avgPricePerCredit: number;
  };
  
  // Compliance and validation
  compliance: {
    validationStatus: 'pending' | 'in-review' | 'approved' | 'rejected';
    validatorId?: string;
    lastValidationDate?: string;
    nextMilestoneDate?: string;
    complianceScore: number;
  };
  
  // Settings and preferences
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
    };
    privacy: {
      publicProfile: boolean;
      showInMarketplace: boolean;
    };
  };
}

export interface ProjectContextType {
  projects: Project[];
  currentProjectId: string | null;
  currentProject: Project | null;
  
  // Project management
  createProject: (projectData: Partial<Project>) => Promise<string>;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  switchProject: (projectId: string) => void;
  
  // Bulk operations
  archiveProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => Promise<string>;
  
  // Progress and analytics
  getProjectProgress: (projectId?: string) => number;
  getPortfolioStats: () => {
    totalProjects: number;
    activeProjects: number;
    totalCredits: number;
    totalRevenue: number;
  };
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

interface ProjectProviderProps {
  children: React.ReactNode;
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('carbon-credit-projects');
    const savedCurrentProjectId = localStorage.getItem('current-project-id');
    
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      setProjects(parsedProjects);
      
      if (savedCurrentProjectId && parsedProjects.find((p: Project) => p.id === savedCurrentProjectId)) {
        setCurrentProjectId(savedCurrentProjectId);
      } else if (parsedProjects.length > 0) {
        setCurrentProjectId(parsedProjects[0].id);
      }
    }
  }, []);

  // Save to localStorage when projects change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('carbon-credit-projects', JSON.stringify(projects));
    }
  }, [projects]);

  useEffect(() => {
    if (currentProjectId) {
      localStorage.setItem('current-project-id', currentProjectId);
    }
  }, [currentProjectId]);

  const currentProject = projects.find(p => p.id === currentProjectId) || null;

  const createProject = async (projectData: Partial<Project>): Promise<string> => {
    const newProject: Project = {
      id: Date.now().toString(), // In real app, use UUID
      name: projectData.name || 'New Project',
      description: projectData.description || '',
      type: projectData.type || 'carbon-avoidance',
      status: 'setup',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      setupProgress: {
        projectTypeSelected: !!projectData.type,
        kycCompleted: false,
        walletConnected: false,
        documentsUploaded: false,
        aiAssistantUsed: false,
      },
      
      details: {
        location: projectData.details?.location || '',
        startDate: projectData.details?.startDate || new Date().toISOString().split('T')[0],
        estimatedDuration: projectData.details?.estimatedDuration || '18 months',
        standard: projectData.details?.standard || 'VCS',
        methodology: projectData.details?.methodology || '',
        estimatedCreditsPerYear: projectData.details?.estimatedCreditsPerYear || 1000,
        currency: projectData.details?.currency || 'USD',
        timezone: projectData.details?.timezone || 'America/New_York',
      },
      
      team: {
        members: [{
          id: 'owner-1',
          name: 'Project Owner',
          email: 'owner@example.com',
          role: 'project-owner',
          status: 'active',
          joinedAt: new Date().toISOString(),
        }],
      },
      
      financial: {
        estimatedRevenue: 0,
        actualRevenue: 0,
        creditsIssued: 0,
        creditsTraded: 0,
        avgPricePerCredit: 0,
      },
      
      compliance: {
        validationStatus: 'pending',
        complianceScore: 0,
      },
      
      settings: {
        notifications: {
          email: true,
          push: true,
          frequency: 'immediate',
        },
        privacy: {
          publicProfile: true,
          showInMarketplace: true,
        },
      },
      
      ...projectData,
    };

    setProjects(prev => [...prev, newProject]);
    setCurrentProjectId(newProject.id);
    
    return newProject.id;
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    ));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    
    if (currentProjectId === projectId) {
      const remainingProjects = projects.filter(p => p.id !== projectId);
      setCurrentProjectId(remainingProjects.length > 0 ? remainingProjects[0].id : null);
    }
  };

  const switchProject = (projectId: string) => {
    setCurrentProjectId(projectId);
  };

  const archiveProject = (projectId: string) => {
    updateProject(projectId, { status: 'completed' });
  };

  const duplicateProject = async (projectId: string): Promise<string> => {
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');
    
    const duplicatedProject = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'setup' as const,
      setupProgress: {
        projectTypeSelected: true,
        kycCompleted: false,
        walletConnected: false,
        documentsUploaded: false,
        aiAssistantUsed: false,
      },
      financial: {
        estimatedRevenue: 0,
        actualRevenue: 0,
        creditsIssued: 0,
        creditsTraded: 0,
        avgPricePerCredit: 0,
      },
    };
    
    setProjects(prev => [...prev, duplicatedProject]);
    return duplicatedProject.id;
  };

  const getProjectProgress = (projectId?: string): number => {
    const project = projectId 
      ? projects.find(p => p.id === projectId)
      : currentProject;
    
    if (!project) return 0;
    
    const steps = Object.values(project.setupProgress);
    return (steps.filter(Boolean).length / steps.length) * 100;
  };

  const getPortfolioStats = () => {
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active' || p.status === 'in-progress').length,
      totalCredits: projects.reduce((sum, p) => sum + p.financial.creditsIssued, 0),
      totalRevenue: projects.reduce((sum, p) => sum + p.financial.actualRevenue, 0),
    };
  };

  const value: ProjectContextType = {
    projects,
    currentProjectId,
    currentProject,
    createProject,
    updateProject,
    deleteProject,
    switchProject,
    archiveProject,
    duplicateProject,
    getProjectProgress,
    getPortfolioStats,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}