import React from 'react';
import { 
  TrendingUp, DollarSign, Leaf, Clock, Users, Target, 
  BarChart3, LineChart, PieChart, Activity, Award, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface AnalyticsDashboardProps {
  userData: any;
}

const mockAnalyticsData = {
  carbonCredits: {
    total: '12,450',
    thisMonth: '1,240',
    trend: '+12.5%',
    projectedAnnual: '14,900'
  },
  revenue: {
    total: '$124,500',
    thisMonth: '$12,400',
    trend: '+8.3%',
    avgPrice: '$10.00'
  },
  impact: {
    co2Prevented: '2,450 tons',
    methanePrevented: '156 tons',
    equivalentCars: '532 cars/year',
    treesEquivalent: '2,890 trees'
  },
  market: {
    demandScore: 85,
    priceVolatility: 'Low',
    marketTrend: 'Bullish',
    competitorCount: 23
  }
};

const chartData = [
  { month: 'Jan', credits: 800, revenue: 8000 },
  { month: 'Feb', credits: 950, revenue: 9500 },
  { month: 'Mar', credits: 1100, revenue: 11000 },
  { month: 'Apr', credits: 1240, revenue: 12400 },
  { month: 'May', credits: 1380, revenue: 13800 },
  { month: 'Jun', credits: 1450, revenue: 14500 }
];

export function AnalyticsDashboard({ userData }: AnalyticsDashboardProps) {
  const isPremierProject = userData.projectType === 'carbon-avoidance';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your carbon credit project performance</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">Live Data</Badge>
          {isPremierProject && (
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
              Premier Project
            </Badge>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockAnalyticsData.carbonCredits.total}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              {mockAnalyticsData.carbonCredits.trend} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{mockAnalyticsData.revenue.total}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              {mockAnalyticsData.revenue.trend} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              Market Demand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{mockAnalyticsData.market.demandScore}/100</div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockAnalyticsData.market.marketTrend} market trend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-orange-600" />
              Avg. Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockAnalyticsData.revenue.avgPrice}</div>
            <p className="text-xs text-muted-foreground mt-1">
              per credit • {mockAnalyticsData.market.priceVolatility} volatility
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Credit Generation Trend
            </CardTitle>
            <CardDescription>Monthly carbon credit production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.slice(-3).map((item, index) => (
                <div key={item.month} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">{item.month}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{item.credits} credits</span>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(item.credits / 1500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Environmental Impact
            </CardTitle>
            <CardDescription>Your project's environmental contribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-bold text-green-600">{mockAnalyticsData.impact.co2Prevented}</div>
                <div className="text-xs text-muted-foreground">CO₂ Prevented</div>
              </div>
              {isPremierProject && (
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">{mockAnalyticsData.impact.methanePrevented}</div>
                  <div className="text-xs text-muted-foreground">CH₄ Prevented</div>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Equivalent to removing</span>
                <span className="font-medium">{mockAnalyticsData.impact.equivalentCars}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Equivalent to planting</span>
                <span className="font-medium">{mockAnalyticsData.impact.treesEquivalent}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Market Analysis
          </CardTitle>
          <CardDescription>Current market conditions and projections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Demand Score</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current</span>
                  <span>{mockAnalyticsData.market.demandScore}/100</span>
                </div>
                <Progress value={mockAnalyticsData.market.demandScore} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">High demand in your market segment</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Price Trend</span>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-bold text-green-600">+15.2%</div>
                <p className="text-xs text-muted-foreground">6-month price appreciation</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Competition</span>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-bold">{mockAnalyticsData.market.competitorCount}</div>
                <p className="text-xs text-muted-foreground">Similar projects in region</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}