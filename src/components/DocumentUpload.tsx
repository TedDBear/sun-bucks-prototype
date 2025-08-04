import React, { useState, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  X, 
  Check, 
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Calendar
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  status: 'uploaded' | 'processing' | 'approved' | 'rejected';
  category: string;
}

export function DocumentUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'household_income_statement.pdf',
      size: '1.2 MB',
      type: 'PDF',
      uploadDate: '2024-01-15',
      status: 'approved',
      category: 'Income Verification'
    },
    {
      id: '2',
      name: 'school_enrollment_form.pdf',
      size: '856 KB',
      type: 'PDF',
      uploadDate: '2024-01-14',
      status: 'processing',
      category: 'School Documentation'
    },
    {
      id: '3',
      name: 'identity_verification.jpg',
      size: '2.1 MB',
      type: 'Image',
      uploadDate: '2024-01-13',
      status: 'rejected',
      category: 'Identity Verification'
    }
  ]);

  const requiredDocuments = [
    { name: 'Proof of Income', description: 'Pay stubs, tax returns, or benefit statements', uploaded: true },
    { name: 'School Enrollment', description: 'Current school enrollment verification', uploaded: true },
    { name: 'Identity Verification', description: 'Government-issued ID or driver\'s license', uploaded: false },
    { name: 'Household Composition', description: 'Documentation of all household members', uploaded: false }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  }, []);

  const handleUpload = (files: FileList) => {
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'image':
      case 'jpg':
      case 'png':
        return <Image className="w-5 h-5 text-blue-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      uploaded: { variant: 'secondary', label: 'Uploaded' },
      processing: { variant: 'outline', label: 'Processing' },
      approved: { variant: 'default', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' }
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Upload Documents</h1>
          <p className="text-muted-foreground">Upload required documents for your SUN Bucks application</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download All
        </Button>
      </div>

      {/* Upload Area */}
      <Card className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-primary bg-accent/50' : 'border-muted-foreground/25'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
            </p>
          </div>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button className="mt-4" asChild>
              <span>Choose Files</span>
            </Button>
          </label>
        </div>

        {uploading && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Required Documents Checklist */}
        <Card className="p-6">
          <h2 className="mb-4">Required Documents</h2>
          <div className="space-y-4">
            {requiredDocuments.map((doc, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-md">
                <div className="mt-1">
                  {doc.uploaded ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{doc.name}</h4>
                    <Badge variant={doc.uploaded ? 'default' : 'secondary'}>
                      {doc.uploaded ? 'Complete' : 'Required'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upload Guidelines */}
        <Card className="p-6">
          <h2 className="mb-4">Upload Guidelines</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">File Requirements</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Maximum file size: 10MB</li>
                <li>• Accepted formats: PDF, JPG, PNG, DOC, DOCX</li>
                <li>• Documents must be clear and readable</li>
                <li>• All text must be in English or include translation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Document Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure documents are recent (within 30 days)</li>
                <li>• Include all pages of multi-page documents</li>
                <li>• Verify all information is visible and legible</li>
                <li>• Remove any personal information not required</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Uploaded Files */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2>Uploaded Documents</h2>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Filter by Date
          </Button>
        </div>
        
        <div className="space-y-3">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-4 border border-border rounded-md">
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {file.size} • {file.category} • Uploaded {file.uploadDate}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {getStatusBadge(file.status)}
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}