import React, { useState } from 'react';
import { Shield, Camera, FileText, User, CheckCircle, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface KYCProcessProps {
  onComplete: () => void;
  completed?: boolean;
}

export function KYCProcess({ onComplete, completed }: KYCProcessProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    address: '',
    idUploaded: false,
    selfieUploaded: false,
    businessDocs: false
  });

  const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Identity Verification', icon: Camera },
    { id: 3, title: 'Business Documents', icon: FileText }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: true }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2:
        return formData.idUploaded && formData.selfieUploaded;
      case 3:
        return formData.businessDocs;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="company">Company/Organization</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Green Energy Solutions"
              />
            </div>

            <div>
              <Label htmlFor="role">Your Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="Project Manager"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                We need to verify your identity to comply with regulatory requirements for carbon credit projects.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Government ID
                  {formData.idUploaded && <CheckCircle className="h-4 w-4 text-green-600" />}
                </CardTitle>
                <CardDescription className="text-sm">
                  Upload a clear photo of your passport, driver's license, or national ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant={formData.idUploaded ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => handleFileUpload('idUploaded')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {formData.idUploaded ? 'ID Uploaded' : 'Upload Government ID'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Selfie Verification
                  {formData.selfieUploaded && <CheckCircle className="h-4 w-4 text-green-600" />}
                </CardTitle>
                <CardDescription className="text-sm">
                  Take a selfie holding your ID next to your face
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant={formData.selfieUploaded ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => handleFileUpload('selfieUploaded')}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {formData.selfieUploaded ? 'Selfie Uploaded' : 'Take Selfie'}
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Business documentation helps us verify your organization's legitimacy for carbon credit projects.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Business Documents
                  {formData.businessDocs && <CheckCircle className="h-4 w-4 text-green-600" />}
                </CardTitle>
                <CardDescription className="text-sm">
                  Upload business registration, tax documents, or incorporation papers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>• Business Registration</div>
                  <div>• Tax ID Certificate</div>
                  <div>• Incorporation Papers</div>
                  <div>• Operating License</div>
                </div>
                <Button 
                  variant={formData.businessDocs ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => handleFileUpload('businessDocs')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {formData.businessDocs ? 'Documents Uploaded' : 'Upload Documents'}
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (completed) {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl mb-2">KYC Verification Complete</h2>
          <p className="text-muted-foreground mb-6">
            Your identity has been verified successfully. You can now proceed with wallet connection.
          </p>
          <Button onClick={onComplete} className="w-full">
            Continue to Wallet Setup
          </Button>
        </div>
      </div>
    );
  }

  // Get the current step's icon component
  const CurrentStepIcon = steps[currentStep - 1].icon;

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-xl mb-2">KYC Verification</h2>
          <p className="text-muted-foreground text-sm">
            Complete identity verification to comply with carbon credit regulations
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-600 text-white' : 
                    isActive ? 'bg-primary text-primary-foreground' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <p className="text-xs mt-1 text-center max-w-16">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${
                    isCompleted ? 'bg-green-600' : 'bg-muted'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CurrentStepIcon className="h-4 w-4" />
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1"
            >
              Previous
            </Button>
          )}
          <Button 
            onClick={() => {
              if (currentStep === 3) {
                onComplete();
              } else {
                setCurrentStep(currentStep + 1);
              }
            }}
            disabled={!canProceedToNext()}
            className="flex-1"
          >
            {currentStep === 3 ? 'Complete KYC' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}