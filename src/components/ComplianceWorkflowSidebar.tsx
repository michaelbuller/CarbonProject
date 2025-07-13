import React from 'react';
import { 
  FileText, ClipboardCheck, BarChart3, Eye, Shield, Calendar, 
  CheckCircle, Clock, AlertCircle, ArrowRight, Target, Database,
  MapPin, Users, DollarSign, Leaf, Zap, Factory, Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useProject } from './ProjectContext';

interface ComplianceStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'completed' | 'current' | 'pending' | 'locked';
  phase: 'preparation' | 'validation' | 'verification' | 'registration' | 'monitoring';
  estimatedDuration: string;
  required: boolean;
}

interface ComplianceWorkflowSidebarProps {
  currentStep: string;
  onStepSelect: (stepId: string) => void;
  onClose?: () => void;
}

export function ComplianceWorkflowSidebar({ currentStep, onStepSelect, onClose }: ComplianceWorkflowSidebarProps) {
  const { currentProject } = useProject();

  const complianceSteps: ComplianceStep[] = [
    // Preparation Phase
    {
      id: 'project-design',
      title: 'Project Design Document',
      description: 'Create comprehensive project design and methodology',
      icon: FileText,
      status: 'completed',
      phase: 'preparation',
      estimatedDuration: '2-4 weeks',
      required: true
    },
    {
      id: 'baseline-assessment',
      title: 'Baseline Assessment',
      description: 'Establish emission baselines and reference scenarios',
      icon: Database,
      status: 'completed',
      phase: 'preparation',
      estimatedDuration: '3-5 weeks',
      required: true
    },
    {
      id: 'monitoring-plan',
      title: 'Monitoring Plan',
      description: 'Develop monitoring and measurement protocols',
      icon: BarChart3,
      status: 'current',
      phase: 'preparation',
      estimatedDuration: '2-3 weeks',
      required: true
    },
    {
      id: 'stakeholder-consultation',
      title: 'Stakeholder Consultation',
      description: 'Conduct community engagement and consultation',
      icon: Users,
      status: 'pending',
      phase: 'preparation',
      estimatedDuration: '4-6 weeks',
      required: true
    },
    {
      id: 'environmental-impact',
      title: 'Environmental Impact Assessment',
      description: 'Assess environmental impacts and mitigation measures',
      icon: Leaf,
      status: 'pending',
      phase: 'preparation',
      estimatedDuration: '6-8 weeks',
      required: true
    },

    // Validation Phase
    {
      id: 'doc-validation',
      title: 'Documentation Validation',
      description: 'Third-party validation of project documentation',
      icon: ClipboardCheck,
      status: 'locked',
      phase: 'validation',
      estimatedDuration: '4-6 weeks',
      required: true
    },
    {
      id: 'technical-review',
      title: 'Technical Review',
      description: 'Independent technical assessment of methodology',
      icon: Settings,
      status: 'locked',
      phase: 'validation',
      estimatedDuration: '3-4 weeks',
      required: true
    },
    {
      id: 'validation-report',
      title: 'Validation Report',
      description: 'Receive and review validation findings',
      icon: FileText,
      status: 'locked',
      phase: 'validation',
      estimatedDuration: '1-2 weeks',
      required: true
    },

    // Verification Phase
    {
      id: 'implementation',
      title: 'Project Implementation',
      description: 'Execute project activities according to design',
      icon: Factory,
      status: 'locked',
      phase: 'verification',
      estimatedDuration: '12-24 months',
      required: true
    },
    {
      id: 'monitoring-execution',
      title: 'Monitoring Execution',
      description: 'Implement monitoring plan and collect data',
      icon: Target,
      status: 'locked',
      phase: 'verification',
      estimatedDuration: 'Ongoing',
      required: true
    },
    {
      id: 'verification-prep',
      title: 'Verification Preparation',
      description: 'Prepare monitoring reports for verification',
      icon: FileText,
      status: 'locked',
      phase: 'verification',
      estimatedDuration: '2-3 weeks',
      required: true
    },
    {
      id: 'third-party-verification',
      title: 'Third-Party Verification',
      description: 'Independent verification of emission reductions',
      icon: Shield,
      status: 'locked',
      phase: 'verification',
      estimatedDuration: '4-8 weeks',
      required: true
    },

    // Registration Phase
    {
      id: 'credit-issuance',
      title: 'Credit Issuance Request',
      description: 'Submit verified emission reductions for credit issuance',
      icon: DollarSign,
      status: 'locked',
      phase: 'registration',
      estimatedDuration: '2-4 weeks',
      required: true
    },
    {
      id: 'registry-review',
      title: 'Registry Review',
      description: 'Registry review and approval of credits',
      icon: Eye,
      status: 'locked',
      phase: 'registration',
      estimatedDuration: '2-3 weeks',
      required: true
    },
    {
      id: 'credit-registration',
      title: 'Credit Registration',
      description: 'Final registration and issuance of carbon credits',
      icon: CheckCircle,
      status: 'locked',
      phase: 'registration',
      estimatedDuration: '1 week',
      required: true
    },

    // Ongoing Monitoring
    {
      id: 'ongoing-monitoring',
      title: 'Ongoing Monitoring',
      description: 'Continuous monitoring and periodic verification',
      icon: Calendar,
      status: 'locked',
      phase: 'monitoring',
      estimatedDuration: 'Crediting period',
      required: true
    }
  ];

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'current':
        return 'text-blue-600 dark:text-blue-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-400 dark:text-gray-500';
    }
  };

  const getPhaseProgress = (phase: string) => {
    const phaseSteps = complianceSteps.filter(step => step.phase === phase);
    const completedSteps = phaseSteps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / phaseSteps.length) * 100);
  };

  const getOverallProgress = () => {
    const completedSteps = complianceSteps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / complianceSteps.length) * 100);
  };

  const phases = [
    { id: 'preparation', label: 'Preparation', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
    { id: 'validation', label: 'Validation', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
    { id: 'verification', label: 'Verification', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
    { id: 'registration', label: 'Registration', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
    { id: 'monitoring', label: 'Monitoring', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' }
  ];

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-medium text-sm">Compliance Workflow</h3>
            <p className="text-xs text-muted-foreground">
              {currentProject?.name || 'Carbon Credit Project'}
            </p>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              ×
            </Button>
          )}
        </div>
        
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Overall Progress</span>
            <span>{getOverallProgress()}%</span>
          </div>
          <Progress value={getOverallProgress()} className="h-1.5" />
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {phases.map((phase) => {
            const phaseSteps = complianceSteps.filter(step => step.phase === phase.id);
            const phaseProgress = getPhaseProgress(phase.id);
            
            return (
              <div key={phase.id} className="mb-4">
                {/* Phase Header */}
                <div className="px-2 py-2 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={`text-xs ${phase.color}`}>
                      {phase.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{phaseProgress}%</span>
                  </div>
                  <Progress value={phaseProgress} className="h-1" />
                </div>

                {/* Phase Steps */}
                <div className="space-y-1">
                  {phaseSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isClickable = step.status !== 'locked';
                    
                    return (
                      <Button
                        key={step.id}
                        variant={isActive ? 'default' : 'ghost'}
                        className={`w-full justify-start h-auto p-3 ${
                          !isClickable ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => isClickable && onStepSelect(step.id)}
                        disabled={!isClickable}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="relative flex-shrink-0 mt-0.5">
                            <Icon className={`h-4 w-4 ${getStepStatusColor(step.status)}`} />
                            {step.status === 'completed' && (
                              <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400 absolute -top-1 -right-1" />
                            )}
                            {step.status === 'current' && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full absolute -top-1 -right-1" />
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-medium mb-1 leading-tight">
                              {step.title}
                            </div>
                            <div className="text-xs text-muted-foreground mb-1 leading-tight">
                              {step.description}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {step.estimatedDuration}
                              </span>
                              {step.required && (
                                <Badge variant="outline" className="text-xs px-1">
                                  Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          <p>Verification Phase • Step {complianceSteps.findIndex(s => s.id === currentStep) + 1} of {complianceSteps.length}</p>
        </div>
      </div>
    </div>
  );
}