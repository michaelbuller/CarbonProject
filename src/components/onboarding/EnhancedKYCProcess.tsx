import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Check, ChevronRight, ChevronLeft, Upload, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase'

interface EnhancedKYCProcessProps {
  onComplete: () => void
  projectType?: string
}

interface KYCFormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  role: string
  address: string
  
  // Carbon Wells Specific
  apiNumber?: string
  commissionState?: string
  operatorName?: string
  fieldName?: string
  wellCount?: string
  
  // Documents
  idUploaded: boolean
  selfieUploaded: boolean
  businessDocs: boolean
  apiDocumentUploaded?: boolean
}

const US_STATES_WITH_COMMISSIONS = [
  { value: 'TX', label: 'Texas', commission: 'Texas Railroad Commission' },
  { value: 'CO', label: 'Colorado', commission: 'Colorado Oil and Gas Conservation Commission' },
  { value: 'ND', label: 'North Dakota', commission: 'North Dakota Industrial Commission' },
  { value: 'OK', label: 'Oklahoma', commission: 'Oklahoma Corporation Commission' },
  { value: 'LA', label: 'Louisiana', commission: 'Louisiana Department of Natural Resources' },
  { value: 'NM', label: 'New Mexico', commission: 'New Mexico Oil Conservation Division' },
  { value: 'WY', label: 'Wyoming', commission: 'Wyoming Oil and Gas Conservation Commission' },
  { value: 'AK', label: 'Alaska', commission: 'Alaska Oil and Gas Conservation Commission' },
]

export function EnhancedKYCProcess({ onComplete, projectType }: EnhancedKYCProcessProps) {
  const { userProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validatingApi, setValidatingApi] = useState(false)
  
  const isCarbonWells = projectType === 'carbon-avoidance' || projectType === 'Carbon Capture'
  const totalSteps = isCarbonWells ? 4 : 3
  
  const [formData, setFormData] = useState<KYCFormData>({
    firstName: '',
    lastName: '',
    email: userProfile?.email || '',
    phone: '',
    company: userProfile?.organization || '',
    role: '',
    address: '',
    apiNumber: '',
    commissionState: '',
    operatorName: '',
    fieldName: '',
    wellCount: '',
    idUploaded: false,
    selfieUploaded: false,
    businessDocs: false,
    apiDocumentUploaded: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateApiNumber = async () => {
    if (!formData.apiNumber || !formData.commissionState) return
    
    setValidatingApi(true)
    setError(null)
    
    try {
      // Check if API number exists in our database
      const { data: apiData, error: apiError } = await supabase
        .from('api_numbers')
        .select('*')
        .eq('api_number', formData.apiNumber)
        .single()
      
      if (apiError && apiError.code !== 'PGRST116') {
        throw apiError
      }
      
      if (apiData) {
        // Auto-fill fields from existing API data
        setFormData(prev => ({
          ...prev,
          operatorName: apiData.operator_name || prev.operatorName,
          fieldName: apiData.field_name || prev.fieldName,
        }))
      }
    } catch (err) {
      setError('Failed to validate API number')
    } finally {
      setValidatingApi(false)
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 2:
        if (isCarbonWells) {
          return formData.apiNumber && formData.commissionState && formData.operatorName && formData.wellCount
        }
        return formData.idUploaded && formData.selfieUploaded
      case 3:
        if (isCarbonWells) {
          return formData.idUploaded && formData.selfieUploaded
        }
        return formData.businessDocs
      case 4:
        return formData.businessDocs && formData.apiDocumentUploaded
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Save KYC data to user profile or create a KYC record
      // This would be implemented based on your specific requirements
      onComplete()
    } catch (err) {
      setError('Failed to complete KYC process')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
                disabled={!!userProfile?.email}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company/Organization</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Acme Corporation"
                disabled={!!userProfile?.organization}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Project Manager"
              />
            </div>
          </div>
        )
      
      case 2:
        if (isCarbonWells) {
          return (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  For Carbon Wells projects, we need to verify your API number with the appropriate state commission.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="commissionState">State Commission *</Label>
                <Select 
                  value={formData.commissionState}
                  onValueChange={(value) => handleSelectChange('commissionState', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state commission" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES_WITH_COMMISSIONS.map(state => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label} - {state.commission}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiNumber">API Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="apiNumber"
                    name="apiNumber"
                    value={formData.apiNumber}
                    onChange={handleInputChange}
                    placeholder="42-123-45678"
                    required
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={validateApiNumber}
                    disabled={validatingApi || !formData.apiNumber}
                  >
                    {validatingApi ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Validate'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter your well's API number for verification
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="operatorName">Operator Name *</Label>
                <Input
                  id="operatorName"
                  name="operatorName"
                  value={formData.operatorName}
                  onChange={handleInputChange}
                  placeholder="XYZ Energy Corp"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fieldName">Field Name</Label>
                <Input
                  id="fieldName"
                  name="fieldName"
                  value={formData.fieldName}
                  onChange={handleInputChange}
                  placeholder="Eagle Ford"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wellCount">Number of Wells *</Label>
                <Input
                  id="wellCount"
                  name="wellCount"
                  type="number"
                  value={formData.wellCount}
                  onChange={handleInputChange}
                  placeholder="1"
                  min="1"
                  required
                />
              </div>
            </div>
          )
        }
        
        // Non-Carbon Wells projects show identity verification in step 2
        return renderIdentityVerification()
      
      case 3:
        if (isCarbonWells) {
          return renderIdentityVerification()
        }
        return renderBusinessDocuments()
      
      case 4:
        // Only for Carbon Wells projects
        return (
          <div className="space-y-4">
            {renderBusinessDocuments()}
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">API Documentation</h4>
              <div className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    formData.apiDocumentUploaded ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, apiDocumentUploaded: true }))}
                >
                  {formData.apiDocumentUploaded ? (
                    <div className="flex flex-col items-center">
                      <Check className="h-8 w-8 text-green-500 mb-2" />
                      <p className="text-sm text-green-700">API documentation uploaded</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Upload well completion reports or API verification documents
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  const renderIdentityVerification = () => (
    <div className="space-y-4">
      <h4 className="font-medium">Identity Verification</h4>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          formData.idUploaded ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => setFormData(prev => ({ ...prev, idUploaded: true }))}
      >
        {formData.idUploaded ? (
          <div className="flex flex-col items-center">
            <Check className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm text-green-700">Government ID uploaded</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Upload a photo of your government-issued ID</p>
          </div>
        )}
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          formData.selfieUploaded ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => setFormData(prev => ({ ...prev, selfieUploaded: true }))}
      >
        {formData.selfieUploaded ? (
          <div className="flex flex-col items-center">
            <Check className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm text-green-700">Selfie uploaded</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Take a selfie holding your ID</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderBusinessDocuments = () => (
    <div className="space-y-4">
      <h4 className="font-medium">Business Documents</h4>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          formData.businessDocs ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => setFormData(prev => ({ ...prev, businessDocs: true }))}
      >
        {formData.businessDocs ? (
          <div className="flex flex-col items-center">
            <Check className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm text-green-700">Business documents uploaded</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Upload business registration or tax documents
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Information'
      case 2:
        return isCarbonWells ? 'Carbon Wells Information' : 'Identity Verification'
      case 3:
        return isCarbonWells ? 'Identity Verification' : 'Business Documents'
      case 4:
        return 'Business & API Documents'
      default:
        return ''
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your KYC Process</CardTitle>
        <CardDescription>
          {isCarbonWells 
            ? 'Enhanced verification process for Carbon Wells projects'
            : 'Verify your identity to start creating carbon credit projects'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`flex items-center ${step < totalSteps ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">{getStepTitle()}</h3>
          {renderStepContent()}
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceedToNext() || loading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceedToNext() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                'Complete KYC'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}