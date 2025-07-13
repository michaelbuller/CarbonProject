import React from 'react';
import { Leaf, Recycle, Zap, ChevronRight, Crown, Flame } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ProjectSelectionProps {
  onComplete: (projectType: string) => void;
  selectedType?: string;
}

const projectTypes = [
  {
    id: 'carbon-avoidance',
    title: 'Carbon Avoidance',
    subtitle: 'Methane Prevention Projects',
    description: 'Prevent methane emissions through LDAR, well plugging, and renewable energy systems',
    icon: Flame,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    bgColorDark: 'dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    examples: ['LDAR Programs', 'Well P&A Projects', 'Solar installations', 'Wind farms', 'Waste-to-energy'],
    credits: '50-500 tons CO₂eq/year',
    multiplier: '80x',
    isPremier: true,
    premierNote: 'Methane is 80x more potent than CO₂'
  },
  {
    id: 'carbon-sequestration',
    title: 'Carbon Sequestration',
    description: 'Actively remove and store carbon dioxide from the atmosphere',
    icon: Recycle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    bgColorDark: 'dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    examples: ['Reforestation', 'Soil carbon storage', 'Direct air capture', 'Blue carbon projects'],
    credits: '10-100 tons CO₂/year',
    isPremier: false
  },
  {
    id: 'energy-efficiency',
    title: 'Energy Efficiency',
    description: 'Reduce energy consumption through improved systems and technologies',
    icon: Zap,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    bgColorDark: 'dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    examples: ['Building retrofits', 'Smart grid systems', 'Industrial optimization', 'LED conversions'],
    credits: '2-25 tons CO₂/year',
    isPremier: false
  }
];

export function ProjectSelection({ onComplete, selectedType }: ProjectSelectionProps) {
  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-xl mb-2">Select Your Project Type</h2>
          <p className="text-muted-foreground text-sm">
            Choose the type of carbon credit project you're working on. Our AI will customize the process accordingly.
          </p>
        </div>

        <div className="space-y-4">
          {projectTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <Card 
                key={type.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary' : ''
                } ${type.isPremier ? `${type.borderColor} border-2 ${type.bgColorDark}` : ''}`}
                onClick={() => onComplete(type.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-full ${type.bgColor} ${type.bgColorDark} flex items-center justify-center relative`}>
                        <Icon className={`h-6 w-6 ${type.color}`} />
                        {type.isPremier && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Crown className="h-3 w-3 text-yellow-800" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-base">{type.title}</CardTitle>
                          {type.isPremier && (
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                              Premier
                            </Badge>
                          )}
                        </div>
                        {type.subtitle && (
                          <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">
                            {type.subtitle}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {type.credits}
                          </Badge>
                          {type.multiplier && (
                            <Badge variant="destructive" className="text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                              {type.multiplier} Impact
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-3">
                    {type.description}
                  </CardDescription>
                  
                  {type.premierNote && (
                    <div className="mb-3 p-2 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
                      <p className="text-xs text-orange-700 dark:text-orange-300 font-medium">
                        💡 {type.premierNote}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Key Projects:</p>
                    <div className="flex flex-wrap gap-1">
                      {type.examples.slice(0, 4).map((example, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className={`text-xs ${
                            index < 2 && type.isPremier 
                              ? 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-900/20 dark:text-orange-300' 
                              : ''
                          }`}
                        >
                          {example}
                        </Badge>
                      ))}
                      {type.examples.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{type.examples.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Crown className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">Premier Projects</p>
              <p className="text-sm text-muted-foreground">
                Methane prevention projects offer the highest climate impact due to methane's potent greenhouse effect. LDAR and well P&A projects are in high demand and command premium pricing.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Need help choosing?</strong> Our AI assistant will guide you through the selection process and help identify the best project type for your specific use case.
          </p>
        </div>
      </div>
    </div>
  );
}