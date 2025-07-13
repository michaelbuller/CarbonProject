import React, { useState } from 'react';
import { 
  CheckCircle, Clock, AlertTriangle, FileText, BarChart3, Users, 
  Calendar, DollarSign, Shield, Eye, Download, Upload, Edit, 
  ArrowLeft, ArrowRight, Target, Settings, Database, Leaf
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useProject } from './ProjectContext';

interface ComplianceStepScreenProps {
  stepId: string;
  onNavigate: (screen: string) => void;
  onStepChange: (stepId: string) => void;
}

export function ComplianceStepScreen({ stepId, onNavigate, onStepChange }: ComplianceStepScreenProps) {
  const { currentProject } = useProject();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for the current step (Monitoring Plan example)
  const stepData = {
    'monitoring-plan': {
      title: 'Monitoring Plan Development',
      phase: 'Preparation',
      status: 'In Progress',
      progress: 68,
      description: 'Develop comprehensive monitoring and measurement protocols for emission reductions',
      dueDate: 'May 31, 2025',
      estimatedDuration: '2-3 weeks',
      assignedTo: 'Sarah Johnson',
      priority: 'High',
      requirements: [
        'Define monitoring parameters and measurement methods',
        'Establish QA/QC procedures for data collection',
        'Specify monitoring equipment and calibration requirements',
        'Create data management and reporting protocols',
        'Define roles and responsibilities for monitoring activities'
      ],
      deliverables: [
        { name: 'Monitoring Plan Document', status: 'in-progress', dueDate: '2025-05-20' },
        { name: 'QA/QC Procedures', status: 'pending', dueDate: '2025-05-25' },
        { name: 'Equipment Specifications', status: 'completed', dueDate: '2025-05-15' },
        { name: 'Data Management Protocol', status: 'pending', dueDate: '2025-05-30' }
      ],
      measurements: {
        baseline: '1,250 tCO2e/year',
        projected: '780 tCO2e/year',
        reduction: '470 tCO2e/year',
        confidence: '95%'
      },
      equipment: [
        { type: 'FLIR GF320 & GF620 OGI Cameras', purpose: 'Fugitive emission detection' },
        { type: 'EPA Method 21 with OGI', purpose: 'Measurement Standard' },
        { type: 'Weather Monitoring Station', purpose: 'Environmental conditions' }
      ],
      qualityRating: 'A+',
      verificationMethod: 'OGI + Direct Measurement'
    }
  };

  const currentStepData = stepData[stepId as keyof typeof stepData] || stepData['monitoring-plan'];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header with Project Management Dashboard style */}
      <div className="bg-blue-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Project Management Dashboard</h1>
            <p className="text-blue-100">Monitoring and managing carbon reduction projects</p>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => onNavigate('dashboard')}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Project Info Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentProject?.name || 'North Texas Gas Processing Facility'}
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Active
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                Project ID: PRJ-2025-0042 • Start Date: March 15, 2025 • Status: Verification Phase
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Step Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {currentStepData.title}
                    <Badge className={getPriorityColor(currentStepData.priority)}>
                      {currentStepData.priority} Priority
                    </Badge>
                  </CardTitle>
                  <CardDescription>{currentStepData.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(currentStepData.status)}>
                  {currentStepData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{currentStepData.progress}%</span>
                </div>
                <Progress value={currentStepData.progress} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Due Date:</span>
                    <div className="font-medium">{currentStepData.dueDate}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Assigned To:</span>
                    <div className="font-medium">{currentStepData.assignedTo}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <div className="font-medium">{currentStepData.estimatedDuration}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phase:</span>
                    <div className="font-medium">{currentStepData.phase}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Latest Measurement */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Latest Measurement</CardTitle>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  Pending Review
                </Badge>
              </div>
              <CardDescription>Methane Leak Detection & Repair • Conducted on May 18, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="findings" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="findings">Findings</TabsTrigger>
                  <TabsTrigger value="impact">Carbon Impact</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="findings" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm">Identified 3 fugitive emission sources at compressor station</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm">Quantified total methane leak rate at 0.87 kg/hour</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm">Recommended valve replacement for 2 sources</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm">Immediate repair completed for high-flow leak at flange connection</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="impact" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">CH₄ Reduction:</div>
                      <div className="text-lg font-semibold">7.6 tonnes/year</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">CO₂e Reduction:</div>
                      <div className="text-lg font-semibold">212 tCO₂e/year</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Confidence Level:</div>
                      <div className="text-lg font-semibold">95%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Verification Method:</div>
                      <div className="text-lg font-semibold">OGI + Direct Measurement</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Equipment Used:</div>
                      <div className="text-sm">FLIR GF320 & GF620 OGI Cameras</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Measurement Standard:</div>
                      <div className="text-sm">EPA Method 21 with OGI</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Weather Conditions:</div>
                      <div className="text-sm">Clear, 18.5°C, Wind 2.1 m/s</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Quality Rating:</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">A+ (Confidence: 95%)</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
                          High Quality
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Project ID:</span>
                  <div className="font-medium">PRJ-2025-0042</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <div className="font-medium">March 15, 2025</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="font-medium text-green-600">Verification Phase</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Project Manager:</span>
                  <div className="font-medium">Sarah Johnson</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carbon Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Carbon Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Baseline Emissions:</span>
                  <div className="font-medium">{currentStepData.measurements.baseline}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Reduction:</span>
                  <div className="font-medium text-green-600">{currentStepData.measurements.reduction}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Projected Annual:</span>
                  <div className="font-medium">{currentStepData.measurements.projected}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Verification Status:</span>
                  <div className="font-medium text-blue-600">In Progress (68%)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">CRU Value (Projected):</span>
                  <div className="font-medium">$42,500 USD</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Implementation Cost:</span>
                  <div className="font-medium">$28,750 USD</div>
                </div>
                <div>
                  <span className="text-muted-foreground">ROI (5-year):</span>
                  <div className="font-medium text-green-600">247%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Payback Period:</span>
                  <div className="font-medium">1.8 years</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Edit Step Details
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" onClick={() => onStepChange('baseline-assessment')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous Step
        </Button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Step 3 of 16 • Preparation Phase
          </p>
        </div>
        <Button onClick={() => onStepChange('stakeholder-consultation')}>
          Next Step
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}