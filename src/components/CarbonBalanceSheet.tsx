import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Target, Calendar, Download, Upload, 
  BarChart3, PieChart, Leaf, Building2, Factory, Truck, 
  Zap, Droplets, Recycle, AlertCircle, CheckCircle, 
  FileText, Settings, Plus, Filter, Search, Eye, Edit,
  ArrowUpRight, ArrowDownRight, Shield, Award, Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CarbonBalanceData {
  month: string;
  footprint: number;
  credits: number;
  netBalance: number;
  offsetPercentage: number;
}

interface OfftakeAgreement {
  id: string;
  supplier: string;
  projectType: string;
  monthlyCredits: number;
  pricePerCredit: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'expired';
  totalValue: number;
  delivered: number;
}

interface ESGMetrics {
  category: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'on-track' | 'behind' | 'ahead';
}

export function CarbonBalanceSheet() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedView, setSelectedView] = useState('monthly');
  const [isNewAgreementOpen, setIsNewAgreementOpen] = useState(false);

  // Mock data for carbon balance
  const carbonBalanceData: CarbonBalanceData[] = [
    { month: 'Jan', footprint: 2450, credits: 2000, netBalance: 450, offsetPercentage: 82 },
    { month: 'Feb', footprint: 2380, credits: 2100, netBalance: 280, offsetPercentage: 88 },
    { month: 'Mar', footprint: 2520, credits: 2200, netBalance: 320, offsetPercentage: 87 },
    { month: 'Apr', footprint: 2430, credits: 2300, netBalance: 130, offsetPercentage: 95 },
    { month: 'May', footprint: 2500, credits: 2400, netBalance: 100, offsetPercentage: 96 },
    { month: 'Jun', footprint: 2600, credits: 2500, netBalance: 100, offsetPercentage: 96 },
    { month: 'Jul', footprint: 2550, credits: 2600, netBalance: -50, offsetPercentage: 102 },
    { month: 'Aug', footprint: 2480, credits: 2650, netBalance: -170, offsetPercentage: 107 },
    { month: 'Sep', footprint: 2520, credits: 2700, netBalance: -180, offsetPercentage: 107 },
    { month: 'Oct', footprint: 2450, credits: 2750, netBalance: -300, offsetPercentage: 112 },
    { month: 'Nov', footprint: 2380, credits: 2800, netBalance: -420, offsetPercentage: 118 },
    { month: 'Dec', footprint: 2500, credits: 2900, netBalance: -400, offsetPercentage: 116 },
  ];

  // Mock offtake agreements
  const offtakeAgreements: OfftakeAgreement[] = [
    {
      id: '1',
      supplier: 'GreenTech Solutions',
      projectType: 'Solar Farm',
      monthlyCredits: 800,
      pricePerCredit: 15,
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      status: 'active',
      totalValue: 288000,
      delivered: 7200
    },
    {
      id: '2',
      supplier: 'Forest Carbon Co.',
      projectType: 'Reforestation',
      monthlyCredits: 1200,
      pricePerCredit: 12,
      startDate: '2024-03-01',
      endDate: '2029-02-28',
      status: 'active',
      totalValue: 720000,
      delivered: 10800
    },
    {
      id: '3',
      supplier: 'MethaneCap Industries',
      projectType: 'Landfill Gas Capture',
      monthlyCredits: 900,
      pricePerCredit: 18,
      startDate: '2024-06-01',
      endDate: '2027-05-31',
      status: 'active',
      totalValue: 583200,
      delivered: 5400
    }
  ];

  // Mock ESG metrics
  const esgMetrics: ESGMetrics[] = [
    { category: 'Scope 1 Emissions', current: 15420, target: 12000, unit: 'tCO2e', trend: 'down', status: 'on-track' },
    { category: 'Scope 2 Emissions', current: 8950, target: 7000, unit: 'tCO2e', trend: 'down', status: 'on-track' },
    { category: 'Scope 3 Emissions', current: 45200, target: 35000, unit: 'tCO2e', trend: 'down', status: 'behind' },
    { category: 'Renewable Energy', current: 68, target: 80, unit: '%', trend: 'up', status: 'on-track' },
    { category: 'Water Usage', current: 125000, target: 100000, unit: 'm³', trend: 'down', status: 'on-track' },
    { category: 'Waste Reduction', current: 45, target: 60, unit: '%', trend: 'up', status: 'behind' },
  ];

  // Footprint breakdown data
  const footprintBreakdown = [
    { name: 'Energy Consumption', value: 35, color: '#ff6b6b' },
    { name: 'Transportation', value: 25, color: '#4ecdc4' },
    { name: 'Manufacturing', value: 20, color: '#45b7d1' },
    { name: 'Supply Chain', value: 15, color: '#96ceb4' },
    { name: 'Waste', value: 5, color: '#ffeaa7' },
  ];

  const currentYear = new Date().getFullYear();
  const totalFootprint = carbonBalanceData.reduce((sum, item) => sum + item.footprint, 0);
  const totalCredits = carbonBalanceData.reduce((sum, item) => sum + item.credits, 0);
  const netBalance = totalCredits - totalFootprint;
  const offsetPercentage = Math.round((totalCredits / totalFootprint) * 100);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold">Carbon Balance Sheet</h1>
          <p className="text-muted-foreground">Track your ESG commitments and carbon footprint offsetting</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-red-600" />
              Total Footprint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalFootprint.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">tCO2e ({selectedYear})</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Credits purchased</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">tCO2e balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              Offset Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{offsetPercentage}%</div>
            <p className="text-xs text-muted-foreground">Net zero progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Net Zero Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Net Zero Progress
          </CardTitle>
          <CardDescription>Track your journey to carbon neutrality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">{offsetPercentage}% offset</span>
            </div>
            <Progress value={Math.min(offsetPercentage, 100)} className="h-3" />
            
            {offsetPercentage >= 100 ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Congratulations! You've achieved carbon neutrality with {offsetPercentage}% offset.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need {(totalFootprint - totalCredits).toLocaleString()} more credits to achieve net zero.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="footprint">Footprint</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="esg">ESG Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Monthly Carbon Balance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Carbon Balance</CardTitle>
              <CardDescription>Footprint vs Credits purchased over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={carbonBalanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="footprint"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                    name="Carbon Footprint"
                  />
                  <Area
                    type="monotone"
                    dataKey="credits"
                    stackId="2"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.3}
                    name="Credits Purchased"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Offset Percentage Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Offset Percentage Trend</CardTitle>
              <CardDescription>Monthly progress toward net zero</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={carbonBalanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="offsetPercentage"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    name="Offset %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footprint" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Footprint Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Footprint Breakdown</CardTitle>
                <CardDescription>Emissions by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={footprintBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {footprintBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Footprint Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Footprint Trend</CardTitle>
                <CardDescription>Carbon emissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={carbonBalanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="footprint" fill="#ef4444" name="Footprint (tCO2e)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Scope Emissions Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Scope Emissions Breakdown</CardTitle>
              <CardDescription>Emissions categorized by scope</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Factory className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <div className="text-2xl font-bold text-red-600">15,420</div>
                  <div className="text-sm text-muted-foreground">Scope 1 (Direct)</div>
                  <div className="text-xs text-muted-foreground mt-1">22% of total</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-600">8,950</div>
                  <div className="text-sm text-muted-foreground">Scope 2 (Indirect)</div>
                  <div className="text-xs text-muted-foreground mt-1">13% of total</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Truck className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <div className="text-2xl font-bold text-yellow-600">45,200</div>
                  <div className="text-sm text-muted-foreground">Scope 3 (Value Chain)</div>
                  <div className="text-xs text-muted-foreground mt-1">65% of total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agreements" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Offtake Agreements</h3>
              <p className="text-sm text-muted-foreground">Manage your carbon credit supply contracts</p>
            </div>
            <Dialog open={isNewAgreementOpen} onOpenChange={setIsNewAgreementOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Agreement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Offtake Agreement</DialogTitle>
                  <DialogDescription>
                    Create a new carbon credit purchase agreement
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input id="supplier" placeholder="Enter supplier name" />
                    </div>
                    <div>
                      <Label htmlFor="project-type">Project Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solar">Solar Farm</SelectItem>
                          <SelectItem value="wind">Wind Farm</SelectItem>
                          <SelectItem value="forest">Reforestation</SelectItem>
                          <SelectItem value="methane">Methane Capture</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monthly-credits">Monthly Credits</Label>
                      <Input id="monthly-credits" type="number" placeholder="1000" />
                    </div>
                    <div>
                      <Label htmlFor="price">Price per Credit</Label>
                      <Input id="price" type="number" placeholder="15" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsNewAgreementOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsNewAgreementOpen(false)}>
                      Create Agreement
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {offtakeAgreements.map((agreement) => (
              <Card key={agreement.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{agreement.supplier}</CardTitle>
                      <CardDescription>{agreement.projectType}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          agreement.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          agreement.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }
                      >
                        {agreement.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Monthly Credits:</span>
                      <div className="font-medium">{agreement.monthlyCredits.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price per Credit:</span>
                      <div className="font-medium">${agreement.pricePerCredit}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Value:</span>
                      <div className="font-medium">${agreement.totalValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Delivered:</span>
                      <div className="font-medium">{agreement.delivered.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Contract Period</span>
                      <span>{agreement.startDate} - {agreement.endDate}</span>
                    </div>
                    <Progress 
                      value={Math.min((agreement.delivered / (agreement.monthlyCredits * 12)) * 100, 100)} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="esg" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ESG Metrics Overview */}
            <Card>
              <CardHeader>
                <CardTitle>ESG Performance Metrics</CardTitle>
                <CardDescription>Track your environmental, social, and governance goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {esgMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.category}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            metric.status === 'on-track' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            metric.status === 'behind' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          }
                        >
                          {metric.status}
                        </Badge>
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : metric.trend === 'down' ? (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Current: {metric.current.toLocaleString()} {metric.unit}</span>
                      <span>Target: {metric.target.toLocaleString()} {metric.unit}</span>
                    </div>
                    <Progress 
                      value={Math.min((metric.current / metric.target) * 100, 100)} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ESG Score Card */}
            <Card>
              <CardHeader>
                <CardTitle>ESG Score Summary</CardTitle>
                <CardDescription>Overall sustainability performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-green-600">B+</div>
                  <div className="text-sm text-muted-foreground">Overall ESG Rating</div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">A-</div>
                      <div className="text-xs text-muted-foreground">Environmental</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">B</div>
                      <div className="text-xs text-muted-foreground">Social</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">B+</div>
                      <div className="text-xs text-muted-foreground">Governance</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <span>Certified B-Corp</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ESG Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle>2024 ESG Goals Progress</CardTitle>
              <CardDescription>Track progress toward your sustainability commitments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Net Zero by 2030</span>
                    </div>
                    <Progress value={75} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground">75% progress</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">100% Renewable Energy</span>
                    </div>
                    <Progress value={68} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground">68% progress</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Recycle className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Zero Waste to Landfill</span>
                    </div>
                    <Progress value={45} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground">45% progress</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}