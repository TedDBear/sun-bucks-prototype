import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Alert } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search,
  Filter,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Users,
  FileText,
  Mail,
  CreditCard,
  RefreshCw,
  Settings,
  Calendar,
  Target
} from 'lucide-react';

interface BulkOperation {
  id: string;
  name: string;
  type: 'approval' | 'rejection' | 'document_request' | 'benefit_issuance' | 'notification' | 'status_update';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  totalCases: number;
  processedCases: number;
  successfulCases: number;
  failedCases: number;
  startTime: string;
  endTime?: string;
  createdBy: string;
}

interface CaseItem {
  id: string;
  customerName: string;
  status: string;
  createdDate: string;
  eligibility: string;
  benefitAmount: string;
  selected: boolean;
}

export function BulkProcessingPage() {
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const bulkOperations: BulkOperation[] = [
    {
      id: 'BULK-2024-001',
      name: 'Direct Certification Approvals - January',
      type: 'approval',
      status: 'completed',
      progress: 100,
      totalCases: 1250,
      processedCases: 1250,
      successfulCases: 1198,
      failedCases: 52,
      startTime: '2024-01-15 09:00:00',
      endTime: '2024-01-15 09:45:00',
      createdBy: 'John Smith'
    },
    {
      id: 'BULK-2024-002',
      name: 'Benefits Issuance - Approved Cases',
      type: 'benefit_issuance',
      status: 'running',
      progress: 75,
      totalCases: 890,
      processedCases: 668,
      successfulCases: 652,
      failedCases: 16,
      startTime: '2024-01-15 14:30:00',
      createdBy: 'Sarah Davis'
    },
    {
      id: 'BULK-2024-003',
      name: 'Document Request Notifications',
      type: 'notification',
      status: 'failed',
      progress: 23,
      totalCases: 345,
      processedCases: 79,
      successfulCases: 67,
      failedCases: 12,
      startTime: '2024-01-15 11:15:00',
      endTime: '2024-01-15 11:32:00',
      createdBy: 'Mike Wilson'
    }
  ];

  const cases: CaseItem[] = [
    {
      id: 'CS-2024-001',
      customerName: 'Maria Garcia',
      status: 'pending',
      createdDate: '2024-01-14',
      eligibility: 'Under Review',
      benefitAmount: 'Pending',
      selected: false
    },
    {
      id: 'CS-2024-002',
      customerName: 'John Smith',
      status: 'pending',
      createdDate: '2024-01-14',
      eligibility: 'Direct Certification',
      benefitAmount: '$240',
      selected: false
    },
    {
      id: 'CS-2024-003',
      customerName: 'Lisa Johnson',
      status: 'review',
      createdDate: '2024-01-13',
      eligibility: 'Manual Review Required',
      benefitAmount: 'Pending',
      selected: false
    }
  ];

  const operationTypes = [
    { id: 'approval', label: 'Bulk Approval', description: 'Approve multiple cases at once', icon: CheckCircle },
    { id: 'rejection', label: 'Bulk Rejection', description: 'Reject multiple cases with reason', icon: AlertTriangle },
    { id: 'document_request', label: 'Document Request', description: 'Request documents from multiple cases', icon: FileText },
    { id: 'benefit_issuance', label: 'Benefit Issuance', description: 'Issue benefits to approved cases', icon: CreditCard },
    { id: 'notification', label: 'Send Notifications', description: 'Send communications to customers', icon: Mail },
    { id: 'status_update', label: 'Status Update', description: 'Update case status in bulk', icon: RefreshCw }
  ];

  const handleCaseSelection = (caseId: string, selected: boolean) => {
    if (selected) {
      setSelectedCases([...selectedCases, caseId]);
    } else {
      setSelectedCases(selectedCases.filter(id => id !== caseId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedCases(cases.map(c => c.id));
    } else {
      setSelectedCases([]);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode }> = {
      pending: { variant: 'secondary', icon: <RefreshCw className="w-3 h-3" /> },
      running: { variant: 'outline', icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
      completed: { variant: 'default', icon: <CheckCircle className="w-3 h-3" /> },
      failed: { variant: 'destructive', icon: <AlertTriangle className="w-3 h-3" /> },
      paused: { variant: 'secondary', icon: <Pause className="w-3 h-3" /> }
    };
    
    const config = variants[status];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getOperationIcon = (type: string) => {
    const operation = operationTypes.find(op => op.id === type);
    if (!operation) return <Settings className="w-4 h-4" />;
    
    const IconComponent = operation.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Bulk Processing</h1>
          <p className="text-muted-foreground">Perform batch operations on multiple cases</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Operation Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="operations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="operations">Active Operations</TabsTrigger>
          <TabsTrigger value="create">Create Operation</TabsTrigger>
          <TabsTrigger value="history">Operation History</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-6">
          {/* Operation Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Running Operations</p>
                  <p className="text-2xl font-medium">1</p>
                </div>
                <Play className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Queued Operations</p>
                  <p className="text-2xl font-medium">3</p>
                </div>
                <RefreshCw className="w-8 h-8 text-orange-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cases Processed Today</p>
                  <p className="text-2xl font-medium">2,485</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-medium">96.2%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </Card>
          </div>

          {/* Active Operations */}
          <Card className="p-6">
            <h2 className="mb-4">Active Operations</h2>
            <div className="space-y-4">
              {bulkOperations.map((operation) => (
                <div key={operation.id} className="p-4 border border-border rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getOperationIcon(operation.type)}
                      <div>
                        <h4 className="font-medium">{operation.name}</h4>
                        <p className="text-sm text-muted-foreground">Created by {operation.createdBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(operation.status)}
                      {operation.status === 'running' && (
                        <Button size="sm" variant="outline">
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      {operation.status === 'paused' && (
                        <Button size="sm" variant="outline">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {operation.status === 'running' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress: {operation.processedCases} of {operation.totalCases} cases</span>
                        <span>{operation.progress}%</span>
                      </div>
                      <Progress value={operation.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total Cases:</span> {operation.totalCases.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Processed:</span> {operation.processedCases.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Successful:</span> {operation.successfulCases.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Failed:</span> {operation.failedCases.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground">
                    Started: {operation.startTime}
                    {operation.endTime && ` • Completed: ${operation.endTime}`}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          {/* Operation Type Selection */}
          <Card className="p-6">
            <h2 className="mb-4">Select Operation Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {operationTypes.map((operation) => {
                const IconComponent = operation.icon;
                return (
                  <div
                    key={operation.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedOperation === operation.id 
                        ? 'border-primary bg-accent' 
                        : 'border-border hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedOperation(operation.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <h3 className="font-medium">{operation.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{operation.description}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Case Selection */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Select Cases</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Search cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="mb-4 p-4 bg-accent/50 rounded-md">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Status</Label>
                    <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                      <option>All Status</option>
                      <option>Pending</option>
                      <option>Review</option>
                      <option>Approved</option>
                    </select>
                  </div>
                  <div>
                    <Label>Date Range</Label>
                    <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                      <option>All Dates</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Custom range</option>
                    </select>
                  </div>
                  <div>
                    <Label>Eligibility</Label>
                    <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                      <option>All Types</option>
                      <option>Direct Certification</option>
                      <option>Income Verification</option>
                      <option>Manual Review</option>
                    </select>
                  </div>
                  <div>
                    <Label>Benefit Amount</Label>
                    <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                      <option>All Amounts</option>
                      <option>$120</option>
                      <option>$240</option>
                      <option>$360</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4 flex items-center gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCases.length === cases.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span className="text-sm font-medium">Select All ({cases.length} cases)</span>
              </label>
              {selectedCases.length > 0 && (
                <Badge variant="outline">
                  {selectedCases.length} case{selectedCases.length !== 1 ? 's' : ''} selected
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              {cases.map((case_item) => (
                <div key={case_item.id} className="flex items-center justify-between p-3 border border-border rounded-md">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCases.includes(case_item.id)}
                      onChange={(e) => handleCaseSelection(case_item.id, e.target.checked)}
                    />
                    <div>
                      <p className="font-medium">{case_item.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {case_item.id} • {case_item.eligibility}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{case_item.status}</Badge>
                    <span className="text-sm text-muted-foreground">{case_item.benefitAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Operation Configuration */}
          {selectedOperation && selectedCases.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-4">Operation Configuration</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="operation-name">Operation Name</Label>
                  <Input
                    id="operation-name"
                    placeholder="Enter operation name"
                    defaultValue={`${operationTypes.find(op => op.id === selectedOperation)?.label} - ${new Date().toLocaleDateString()}`}
                  />
                </div>

                {selectedOperation === 'rejection' && (
                  <div>
                    <Label htmlFor="rejection-reason">Rejection Reason</Label>
                    <select id="rejection-reason" className="w-full px-3 py-2 border border-border rounded-md bg-background">
                      <option>Select reason</option>
                      <option>Incomplete documentation</option>
                      <option>Income exceeds threshold</option>
                      <option>Not eligible for program</option>
                      <option>Duplicate application</option>
                    </select>
                  </div>
                )}

                {selectedOperation === 'notification' && (
                  <div>
                    <Label htmlFor="notification-template">Notification Template</Label>
                    <select id="notification-template" className="w-full px-3 py-2 border border-border rounded-md bg-background">
                      <option>Select template</option>
                      <option>Document Request</option>
                      <option>Application Update</option>
                      <option>Benefits Available</option>
                      <option>Reminder Notice</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auto-start" defaultChecked />
                  <Label htmlFor="auto-start">Start operation immediately</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="send-notification" defaultChecked />
                  <Label htmlFor="send-notification">Send completion notification</Label>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Start Operation ({selectedCases.length} cases)
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Operation History</h2>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export History
              </Button>
            </div>
            
            <div className="space-y-3">
              {[...bulkOperations].reverse().map((operation) => (
                <div key={operation.id} className="p-4 border border-border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getOperationIcon(operation.type)}
                      <div>
                        <h4 className="font-medium">{operation.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {operation.totalCases} cases • {operation.successfulCases} successful • {operation.failedCases} failed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(operation.status)}
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {operation.startTime} - {operation.endTime || 'In Progress'} • Created by {operation.createdBy}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}