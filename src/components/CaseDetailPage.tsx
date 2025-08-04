import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Edit,
  Save,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Eye,
  CreditCard,
  History
} from 'lucide-react';

interface CaseDetailPageProps {
  caseId: string;
  onBack: () => void;
}

export function CaseDetailPage({ caseId, onBack }: CaseDetailPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [caseNotes, setCaseNotes] = useState('');

  // Mock case data
  const caseData = {
    id: 'CS-2024-001',
    customerName: 'Maria Garcia',
    status: 'approved',
    priority: 'normal',
    created: '2024-01-10',
    lastModified: '2024-01-15',
    assignedTo: 'John Smith',
    eligibilityStatus: 'Eligible - Direct Certification',
    benefitAmount: '$240',
    householdSize: 3,
    contactInfo: {
      email: 'maria.garcia@email.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Sacramento, CA 95814'
    },
    children: [
      { name: 'Carlos Garcia', age: 8, school: 'Lincoln Elementary', grade: '2nd' },
      { name: 'Sofia Garcia', age: 12, school: 'Washington Middle', grade: '6th' }
    ],
    documents: [
      { id: '1', name: 'Income Verification.pdf', type: 'Income', status: 'approved', uploadDate: '2024-01-10' },
      { id: '2', name: 'School Enrollment.pdf', type: 'School', status: 'approved', uploadDate: '2024-01-11' }
    ],
    timeline: [
      { date: '2024-01-15', action: 'Benefits Approved', user: 'John Smith', details: 'Application approved for $240 in benefits' },
      { date: '2024-01-12', action: 'Documents Reviewed', user: 'Sarah Davis', details: 'All required documents verified' },
      { date: '2024-01-10', action: 'Application Submitted', user: 'System', details: 'Customer submitted online application' }
    ],
    communications: [
      { date: '2024-01-15', type: 'Email', subject: 'Application Approved', status: 'sent' },
      { date: '2024-01-12', type: 'SMS', subject: 'Documents Required', status: 'delivered' }
    ]
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode }> = {
      approved: { variant: 'default', icon: <CheckCircle className="w-3 h-3" /> },
      pending: { variant: 'secondary', icon: <Clock className="w-3 h-3" /> },
      review: { variant: 'outline', icon: <AlertTriangle className="w-3 h-3" /> },
      rejected: { variant: 'destructive', icon: <AlertTriangle className="w-3 h-3" /> }
    };
    
    const config = variants[status];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Button>
          <div>
            <h1>Case Details - {caseData.id}</h1>
            <p className="text-muted-foreground">{caseData.customerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(caseData.status)}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Case
          </Button>
        </div>
      </div>

      {/* Case Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{caseData.eligibilityStatus}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Benefit Amount</p>
              <p className="font-medium">{caseData.benefitAmount}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Household Size</p>
              <p className="font-medium">{caseData.householdSize} members</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Last Modified</p>
              <p className="font-medium">{caseData.lastModified}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="household">Household</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Case Information */}
            <Card className="p-6">
              <h2 className="mb-4">Case Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Case ID</Label>
                    <p className="text-sm font-medium">{caseData.id}</p>
                  </div>
                  <div>
                    <Label>Assigned To</Label>
                    <p className="text-sm font-medium">{caseData.assignedTo}</p>
                  </div>
                  <div>
                    <Label>Created Date</Label>
                    <p className="text-sm font-medium">{caseData.created}</p>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Badge variant="outline">{caseData.priority}</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h2 className="mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{caseData.contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{caseData.contactInfo.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{caseData.contactInfo.address}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Case Notes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Case Notes</h2>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>
            {isEditing ? (
              <Textarea
                value={caseNotes}
                onChange={(e) => setCaseNotes(e.target.value)}
                placeholder="Add case notes..."
                rows={4}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {caseNotes || 'No case notes added yet. Click Edit to add notes.'}
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="household" className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4">Household Members</h2>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{caseData.customerName} (Primary Applicant)</h3>
                  <Badge variant="outline">Adult</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Head of household</p>
              </div>
              
              {caseData.children.map((child, index) => (
                <div key={index} className="p-4 border border-border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{child.name}</h3>
                    <Badge variant="outline">Child - Age {child.age}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">School:</span> {child.school}
                    </div>
                    <div>
                      <span className="font-medium">Grade:</span> {child.grade}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Uploaded Documents</h2>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
            <div className="space-y-3">
              {caseData.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border border-border rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} • Uploaded {doc.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(doc.status)}
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4">Case Timeline</h2>
            <div className="space-y-4">
              {caseData.timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{event.action}</h4>
                      <span className="text-sm text-muted-foreground">{event.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.details}</p>
                    <p className="text-xs text-muted-foreground">by {event.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Communication History</h2>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
            <div className="space-y-3">
              {caseData.communications.map((comm, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-md">
                  <div className="flex items-center gap-3">
                    {comm.type === 'Email' ? (
                      <Mail className="w-5 h-5 text-blue-600" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    )}
                    <div>
                      <p className="font-medium">{comm.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {comm.type} • {comm.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={comm.status === 'sent' ? 'default' : 'secondary'}>
                      {comm.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4">Benefit Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Benefit Amount</Label>
                  <p className="text-2xl font-medium text-green-600">{caseData.benefitAmount}</p>
                </div>
                <div>
                  <Label>Per Child Amount</Label>
                  <p className="text-lg font-medium">$120</p>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium">EBT Card Status</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Benefits loaded to card ending in 1234 on 2024-01-15
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}