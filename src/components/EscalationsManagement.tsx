import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Clock, 
  User,
  MessageSquare,
  FileText,
  ChevronRight,
  Plus,
  Edit,
  Eye,
  Send,
  Calendar,
  Flag
} from 'lucide-react';

interface Escalation {
  id: string;
  caseId: string;
  customerName: string;
  issue: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  description: string;
  lastUpdate: string;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export function EscalationsManagement() {
  const [selectedEscalation, setSelectedEscalation] = useState<string | null>(null);
  const [showNewEscalation, setShowNewEscalation] = useState(false);

  const escalations: Escalation[] = [
    {
      id: 'ESC-2024-001',
      caseId: 'CS-2024-001',
      customerName: 'Maria Garcia',
      issue: 'Benefits not received after 10 days',
      category: 'Benefits Delay',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'John Smith',
      createdDate: '2024-01-15',
      dueDate: '2024-01-17',
      description: 'Customer reports benefits were approved but not loaded to EBT card. EBT vendor integration needs investigation.',
      lastUpdate: '2024-01-16'
    },
    {
      id: 'ESC-2024-002',
      caseId: 'CS-2024-045',
      customerName: 'Robert Johnson',
      issue: 'Application incorrectly rejected',
      category: 'Eligibility Error',
      priority: 'urgent',
      status: 'open',
      assignedTo: 'Sarah Davis',
      createdDate: '2024-01-14',
      dueDate: '2024-01-16',
      description: 'Customer believes they were incorrectly rejected due to system error in income calculation.',
      lastUpdate: '2024-01-15'
    },
    {
      id: 'ESC-2024-003',
      caseId: 'CS-2024-023',
      customerName: 'Lisa Chen',
      issue: 'Document upload system errors',
      category: 'Technical Issue',
      priority: 'medium',
      status: 'resolved',
      assignedTo: 'Mike Wilson',
      createdDate: '2024-01-12',
      dueDate: '2024-01-15',
      description: 'Recurring issues with document upload functionality affecting multiple users.',
      lastUpdate: '2024-01-14'
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: '1',
      action: 'Escalation Created',
      user: 'John Smith',
      timestamp: '2024-01-15 10:30 AM',
      details: 'New escalation created for case CS-2024-001'
    },
    {
      id: '2',
      action: 'Status Updated',
      user: 'Sarah Davis',
      timestamp: '2024-01-15 2:15 PM',
      details: 'Status changed from Open to In Progress'
    },
    {
      id: '3',
      action: 'Comment Added',
      user: 'Mike Wilson',
      timestamp: '2024-01-15 4:45 PM',
      details: 'Added investigation findings and next steps'
    }
  ];

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', color: string }> = {
      low: { variant: 'secondary', color: 'text-green-600' },
      medium: { variant: 'outline', color: 'text-yellow-600' },
      high: { variant: 'destructive', color: 'text-orange-600' },
      urgent: { variant: 'destructive', color: 'text-red-600' }
    };
    
    const config = variants[priority];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Flag className={`w-3 h-3 ${config.color}`} />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      open: 'secondary',
      assigned: 'outline',
      'in-progress': 'outline',
      resolved: 'default',
      closed: 'secondary'
    };
    
    return <Badge variant={variants[status]}>{status.replace('-', ' ').toUpperCase()}</Badge>;
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Escalations Management</h1>
          <p className="text-muted-foreground">Track and manage escalated cases requiring immediate attention</p>
        </div>
        <Button onClick={() => setShowNewEscalation(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Escalation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Open</p>
              <p className="text-2xl font-medium">8</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-2xl font-medium">3</p>
            </div>
            <Flag className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-medium">2</p>
            </div>
            <Clock className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolved Today</p>
              <p className="text-2xl font-medium">5</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-medium">✓</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Escalations List */}
        <div className="xl:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Active Escalations</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Search escalations..." />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {escalations.map((escalation) => {
                const daysOverdue = getDaysOverdue(escalation.dueDate);
                const isOverdue = daysOverdue > 0;
                
                return (
                  <div
                    key={escalation.id}
                    className={`p-4 border border-border rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                      selectedEscalation === escalation.id ? 'bg-accent border-primary' : ''
                    } ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}
                    onClick={() => setSelectedEscalation(escalation.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{escalation.issue}</h4>
                        {getPriorityBadge(escalation.priority)}
                        {getStatusBadge(escalation.status)}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-2">
                      <div>
                        <span className="font-medium">Customer:</span> {escalation.customerName}
                      </div>
                      <div>
                        <span className="font-medium">Assigned:</span> {escalation.assignedTo}
                      </div>
                      <div>
                        <span className="font-medium">Case ID:</span> {escalation.caseId}
                      </div>
                      <div className={isOverdue ? 'text-red-600' : ''}>
                        <span className="font-medium">Due:</span> {escalation.dueDate}
                        {isOverdue && <span className="ml-1">({daysOverdue} days overdue)</span>}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{escalation.description}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Escalation Details */}
        <div className="xl:col-span-1">
          {selectedEscalation ? (
            <Card className="p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Escalation Details</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {(() => {
                const escalation = escalations.find(e => e.id === selectedEscalation);
                if (!escalation) return null;
                
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <span className="font-medium">ID:</span> {escalation.id}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {escalation.category}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {escalation.createdDate}
                      </div>
                      <div>
                        <span className="font-medium">Last Update:</span> {escalation.lastUpdate}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Actions</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <User className="w-4 h-4 mr-2" />
                          Reassign
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="w-4 h-4 mr-2" />
                          Update Due Date
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Add Comment
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Quick Response</h4>
                      <div className="space-y-2">
                        <Textarea placeholder="Add a comment or update..." rows={3} />
                        <Button size="sm" className="w-full">
                          <Send className="w-4 h-4 mr-2" />
                          Send Update
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Card>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select an escalation to view details</p>
            </Card>
          )}
        </div>
      </div>

      {/* Audit Log */}
      <Card className="p-6">
        <h2 className="mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 border border-border rounded-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-3"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{log.action}</p>
                  <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                </div>
                <p className="text-sm text-muted-foreground">{log.details}</p>
                <p className="text-xs text-muted-foreground">by {log.user}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* New Escalation Modal - simplified for wireframe */}
      {showNewEscalation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3>Create New Escalation</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewEscalation(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="case-id">Case ID</Label>
                <Input id="case-id" placeholder="Enter case ID" />
              </div>
              
              <div>
                <Label htmlFor="issue">Issue Summary</Label>
                <Input id="issue" placeholder="Brief description of the issue" />
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select id="priority" className="w-full px-3 py-2 border border-border rounded-md bg-background">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1">Create Escalation</Button>
                <Button variant="outline" onClick={() => setShowNewEscalation(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}