import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Mail,
  MessageSquare,
  Phone,
  Send,
  Plus,
  Edit,
  Eye,
  Users,
  Calendar,
  Bell,
  Search,
  Filter,
  Download,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  type: 'email' | 'sms' | 'push' | 'letter';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  recipients: number;
  sentCount: number;
  failedCount: number;
  template: string;
  scheduledDate?: string;
  sentDate?: string;
  createdBy: string;
  subject?: string;
}

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'letter';
  category: string;
  subject?: string;
  preview: string;
  lastModified: string;
}

export function NotificationCenter() {
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const notifications: Notification[] = [
    {
      id: 'NOT-2024-001',
      title: 'Application Approved - January Batch',
      type: 'email',
      status: 'sent',
      recipients: 1250,
      sentCount: 1238,
      failedCount: 12,
      template: 'Application Approval',
      sentDate: '2024-01-15 10:30:00',
      createdBy: 'John Smith',
      subject: 'Your SUN Bucks Application Has Been Approved'
    },
    {
      id: 'NOT-2024-002',
      title: 'Document Request Reminder',
      type: 'sms',
      status: 'sending',
      recipients: 340,
      sentCount: 287,
      failedCount: 8,
      template: 'Document Request',
      scheduledDate: '2024-01-15 14:00:00',
      createdBy: 'Sarah Davis'
    },
    {
      id: 'NOT-2024-003',
      title: 'Benefits Available Notification',
      type: 'email',
      status: 'scheduled',
      recipients: 890,
      sentCount: 0,
      failedCount: 0,
      template: 'Benefits Available',
      scheduledDate: '2024-01-16 09:00:00',
      createdBy: 'Mike Wilson',
      subject: 'Your SUN Bucks Benefits Are Now Available'
    }
  ];

  const templates: Template[] = [
    {
      id: 'temp-001',
      name: 'Application Confirmation',
      type: 'email',
      category: 'Transactional',
      subject: 'Your SUN Bucks Application Has Been Received',
      preview: 'Thank you for submitting your SUN Bucks application. We have received your application and it is currently being reviewed.',
      lastModified: '2024-01-10'
    },
    {
      id: 'temp-002',
      name: 'Document Request',
      type: 'sms',
      category: 'Notification',
      preview: 'Additional documents needed for your SUN Bucks application. Please upload required documents.',
      lastModified: '2024-01-12'
    },
    {
      id: 'temp-003',
      name: 'Application Approval',
      type: 'email',
      category: 'Transactional',
      subject: 'Your SUN Bucks Application Has Been Approved',
      preview: 'Congratulations! Your SUN Bucks application has been approved. Benefits will be loaded to your EBT card.',
      lastModified: '2024-01-14'
    },
    {
      id: 'temp-004',
      name: 'Benefits Available',
      type: 'email',
      category: 'Notification',
      subject: 'Your SUN Bucks Benefits Are Now Available',
      preview: 'Your SUN Bucks benefits have been loaded to your EBT card and are now available for use.',
      lastModified: '2024-01-15'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode }> = {
      draft: { variant: 'secondary', icon: <Edit className="w-3 h-3" /> },
      scheduled: { variant: 'outline', icon: <Calendar className="w-3 h-3" /> },
      sending: { variant: 'outline', icon: <Send className="w-3 h-3" /> },
      sent: { variant: 'default', icon: <CheckCircle className="w-3 h-3" /> },
      failed: { variant: 'destructive', icon: <AlertTriangle className="w-3 h-3" /> }
    };
    
    const config = variants[status];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Bell className="w-4 h-4" />;
      case 'letter': return <Mail className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Notification Center</h1>
          <p className="text-muted-foreground">Manage and send communications to customers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Notification
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sent Today</p>
              <p className="text-2xl font-medium">2,485</p>
            </div>
            <Send className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-medium">890</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Delivery Rate</p>
              <p className="text-2xl font-medium">98.7%</p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-medium">32</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Recent Notifications</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border border-border rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedNotification === notification.id ? 'bg-accent border-primary' : ''
                  }`}
                  onClick={() => setSelectedNotification(notification.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(notification.type)}
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        {notification.subject && (
                          <p className="text-sm text-muted-foreground">{notification.subject}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(notification.status)}
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Recipients:</span> {notification.recipients.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Sent:</span> {notification.sentCount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Failed:</span> {notification.failedCount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Template:</span> {notification.template}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground">
                    {notification.sentDate && `Sent: ${notification.sentDate}`}
                    {notification.scheduledDate && `Scheduled: ${notification.scheduledDate}`}
                    {` • Created by ${notification.createdBy}`}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="compose" className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4">Compose New Notification</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="notification-type">Notification Type</Label>
                <select id="notification-type" className="w-full px-3 py-2 border border-border rounded-md bg-background">
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push Notification</option>
                  <option value="letter">Physical Letter</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="template-select">Template</Label>
                <select 
                  id="template-select" 
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="">Create from scratch</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="recipients">Recipients</Label>
                <select id="recipients" className="w-full px-3 py-2 border border-border rounded-md bg-background">
                  <option>All customers</option>
                  <option>Approved applications</option>
                  <option>Pending applications</option>
                  <option>Applications requiring documents</option>
                  <option>Custom selection</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  placeholder="Enter subject line"
                  defaultValue={selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.subject : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message Content</Label>
                <Textarea
                  id="message"
                  rows={8}
                  placeholder="Enter your message content..."
                  defaultValue={selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.preview : ''}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="send-time">Send Time</Label>
                  <select id="send-time" className="w-full px-3 py-2 border border-border rounded-md bg-background">
                    <option>Send immediately</option>
                    <option>Schedule for later</option>
                    <option>Send at optimal time</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select id="priority" className="w-full px-3 py-2 border border-border rounded-md bg-background">
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Message Templates</h2>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <h3 className="font-medium">{template.name}</h3>
                    </div>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  
                  {template.subject && (
                    <p className="text-sm font-medium mb-2">{template.subject}</p>
                  )}
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {template.preview}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Modified: {template.lastModified}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Notification Preferences */}
          <Card className="p-6">
            <h2 className="mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Send notifications via email</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">Send push notifications to mobile app</p>
                </div>
                <input type="checkbox" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Physical Mail</h3>
                  <p className="text-sm text-muted-foreground">Send physical letters for critical communications</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </Card>

          {/* Delivery Settings */}
          <Card className="p-6">
            <h2 className="mb-4">Delivery Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="retry-attempts">Retry Attempts</Label>
                <select id="retry-attempts" className="w-full px-3 py-2 border border-border rounded-md bg-background">
                  <option>3 attempts</option>
                  <option>5 attempts</option>
                  <option>10 attempts</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="delivery-window">Delivery Window</Label>
                <select id="delivery-window" className="w-full px-3 py-2 border border-border rounded-md bg-background">
                  <option>Business hours only (9 AM - 5 PM)</option>
                  <option>Extended hours (8 AM - 8 PM)</option>
                  <option>24/7 delivery</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="batch-size">Batch Size</Label>
                <select id="batch-size" className="w-full px-3 py-2 border border-border rounded-md bg-background">
                  <option>100 recipients</option>
                  <option>500 recipients</option>
                  <option>1000 recipients</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Integration Settings */}
          <Card className="p-6">
            <h2 className="mb-4">Integration Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Service Provider</h3>
                  <p className="text-sm text-muted-foreground">Connected to SendGrid</p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">SMS Gateway</h3>
                  <p className="text-sm text-muted-foreground">Connected to Twilio</p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Mail Service</h3>
                  <p className="text-sm text-muted-foreground">Connected to USPS</p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}