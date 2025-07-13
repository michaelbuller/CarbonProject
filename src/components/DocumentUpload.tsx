import React, { useState } from 'react';
import { Upload, File, CheckCircle, Camera, FileText, Image, X, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'document';
  category: string;
  uploaded: boolean;
  progress?: number;
}

interface DocumentUploadProps {
  onComplete: () => void;
  completed?: boolean;
}

export function DocumentUpload({ onComplete, completed }: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const documentCategories = [
    {
      id: 'project-design',
      title: 'Project Design Document',
      description: 'Technical specifications and project overview',
      required: true,
      examples: ['PDD', 'Technical Design', 'Project Plan', 'Feasibility Study']
    },
    {
      id: 'environmental-permits',
      title: 'Environmental Permits',
      description: 'Required environmental clearances and permits',
      required: true,
      examples: ['EIA Report', 'Environmental Clearance', 'Permits', 'Compliance Certificates']
    },
    {
      id: 'land-rights',
      title: 'Land Rights & Ownership',
      description: 'Documentation proving land access and ownership',
      required: true,
      examples: ['Land Title', 'Lease Agreement', 'Usage Rights', 'Survey Documents']
    },
    {
      id: 'monitoring-plan',
      title: 'Monitoring & Verification Plan',
      description: 'Plans for measuring and verifying carbon reductions',
      required: true,
      examples: ['Monitoring Plan', 'QA/QC Procedures', 'Measurement Protocol', 'Verification Framework']
    },
    {
      id: 'financial-docs',
      title: 'Financial Documentation',
      description: 'Project financing and economic analysis',
      required: false,
      examples: ['Financial Model', 'Investment Analysis', 'Funding Agreement', 'Cost Breakdown']
    },
    {
      id: 'stakeholder-consultation',
      title: 'Stakeholder Consultation',
      description: 'Evidence of community engagement and stakeholder input',
      required: false,
      examples: ['Consultation Reports', 'Community Meetings', 'Stakeholder Feedback', 'Public Comments']
    },
    {
      id: 'baseline-data',
      title: 'Baseline & Historical Data',
      description: 'Historical emissions data and baseline calculations',
      required: true,
      examples: ['Emission Baselines', 'Historical Data', 'Reference Scenarios', 'Calculation Sheets']
    },
    {
      id: 'supporting-docs',
      title: 'Supporting Documentation',
      description: 'Additional project documentation and references',
      required: false,
      examples: ['Research Papers', 'Technology Specs', 'Equipment Manuals', 'References']
    }
  ];

  const getFilesForCategory = (categoryId: string) => {
    return uploadedFiles.filter(file => file.category === categoryId && file.uploaded);
  };

  const getCompletionPercentage = () => {
    const requiredCategories = documentCategories.filter(cat => cat.required);
    const completedRequired = requiredCategories.filter(cat => 
      getFilesForCategory(cat.id).length > 0
    ).length;
    
    const totalOptional = documentCategories.filter(cat => !cat.required);
    const completedOptional = totalOptional.filter(cat => 
      getFilesForCategory(cat.id).length > 0
    ).length;
    
    const requiredScore = (completedRequired / requiredCategories.length) * 80; // 80% for required
    const optionalScore = (completedOptional / totalOptional.length) * 20; // 20% for optional
    
    return Math.round(requiredScore + optionalScore);
  };

  const canComplete = () => {
    const requiredCategories = documentCategories.filter(cat => cat.required);
    return requiredCategories.every(cat => getFilesForCategory(cat.id).length > 0);
  };

  const handleFileUpload = async (categoryId: string, type: 'camera' | 'file') => {
    setSelectedCategory(categoryId);
    setIsUploading(true);

    // Mock file upload process
    const mockFile: UploadedFile = {
      id: Date.now().toString(),
      name: type === 'camera' ? 'Camera_Photo.jpg' : 'Document.pdf',
      size: '2.4 MB',
      type: type === 'camera' ? 'image' : 'document',
      category: categoryId,
      uploaded: false,
      progress: 0
    };

    setUploadedFiles(prev => [...prev, mockFile]);

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === mockFile.id ? { ...file, progress } : file
        )
      );
    }

    // Mark as uploaded
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === mockFile.id ? { ...file, uploaded: true, progress: 100 } : file
      )
    );

    setIsUploading(false);
    setSelectedCategory(null);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  if (completed) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
        <h2 className="text-xl">Documents Uploaded Successfully</h2>
        <p className="text-muted-foreground">
          All required documents have been uploaded and are ready for AI analysis.
        </p>
        <Button onClick={onComplete} className="w-full">
          Continue to AI Assistant
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
      <div className="mb-6">
        <h2 className="text-xl mb-2">Upload Project Documents</h2>
        <p className="text-muted-foreground text-sm">
          Share documents from your device to help our AI understand your project
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Upload Progress</span>
          <span>{Math.round(getCompletionPercentage())}%</span>
        </div>
        <Progress value={getCompletionPercentage()} className="h-2" />
      </div>

      <Alert className="mb-6">
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Upload documents directly from your phone camera or file storage. Our AI will analyze them to optimize your project setup.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {documentCategories.map((category) => {
          const categoryFiles = getFilesForCategory(category.id);
          const categoryIsUploading = selectedCategory === category.id && isUploading;
          
          return (
            <Card key={category.id} className="relative h-fit">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                      {category.title}
                      {category.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                      {categoryFiles.length > 0 && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {category.examples.map((example, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {example}
                    </Badge>
                  ))}
                </div>

                {categoryFiles.length > 0 && (
                  <div className="space-y-2">
                    {categoryFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {file.type === 'image' ? (
                            <Image className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <FileText className="h-4 w-4 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {categoryIsUploading && (
                  <div className="space-y-2">
                    <p className="text-sm">Uploading...</p>
                    <Progress value={uploadedFiles.find(f => f.category === category.id && !f.uploaded)?.progress || 0} className="h-1" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleFileUpload(category.id, 'camera')}
                    disabled={isUploading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleFileUpload(category.id, 'file')}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 max-w-md mx-auto lg:max-w-none">
        <Button 
          onClick={onComplete} 
          disabled={!canComplete()}
          className="w-full"
        >
          {canComplete() ? 'Continue to AI Assistant' : 'Upload Required Documents'}
        </Button>
      </div>
    </div>
  );
}