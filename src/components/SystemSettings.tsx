import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Settings, 
  Mail, 
  Shield, 
  Database,
  Bell,
  Calendar,
  Key,
  Globe,
  Server,
  Edit,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Monitor
} from 'lucide-react';

interface SystemConfig {
  category: string;
  settings: {
    key: string;
    label: string;
    value: string | boolean;
    type: 'text' | 'boolean' | 'number' | 'select';
    options?: string[];
    description?: string;
  }[];
}

export function SystemSettings() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const systemConfigs: SystemConfig[] = [
    {
      category: 'Application Processing',
      settings: [
        {
          key: 'auto_approval_enabled',
          label: 'Enable Auto-Approval',
          value: true,
          type: 'boolean',
          description: 'Automatically approve applications that meet direct certification criteria'
        },
        {
          key: 'processing_timeout',
          label: 'Processing Timeout (hours)',
          value: '72',
          type: 'number',
          description: 'Maximum time before flagging applications for review'
        },
        {
          key: 'duplicate_check_enabled',
          label: 'Enable Duplicate Detection',
          value: true,
          type: 'boolean',
          description: 'Automatically check for duplicate applications'
        }
      ]
    },
    {
      category: 'System Integration',
      settings: [
        {
          key: 'calpads_sync_frequency',
          label: 'CALPADS Sync Frequency',
          value: 'daily',
          type: 'select',
          options: ['hourly', 'daily', 'weekly'],
          description: 'How often to sync with CALPADS system'
        },
        {
          key: 'ebt_sync_enabled',
          label: 'EBT Real-time Sync',
          value: true,
          type: 'boolean',
          description: 'Enable real-time synchronization with EBT vendor'
        },
        {
          key: 'api_rate_limit',
          label: 'API Rate Limit (requests/minute)',
          value: '1000',
          type: 'number',
          description: 'Maximum API requests per minute'
        }
      ]
    },
    {
      category: 'Security',
      settings: [
        {
          key: 'session_timeout',
          label: 'Session Timeout (minutes)',
          value: '30',
          type: 'number',
          description: 'User session timeout duration'
        },
        {
          key: 'mfa_required',
          label: 'Require MFA for Admin Users',
          value: true,
          type: 'boolean',
          description: 'Require multi-factor authentication for admin access'
        },
        {
          key: 'password_expiry',
          label: 'Password Expiry (days)',
          value: '90',
          type: 'number',
          description: 'Number of days before password expires'
        }
      ]
    }
  ];

  const emailTemplates = [
    {
      id: '1',
      name: 'Application Confirmation',
      subject: 'Your SUN Bucks Application Has Been Received',
      type: 'Transactional',
      lastModified: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Approval Notification',
      subject: 'Your SUN Bucks Application Has Been Approved',
      type: 'Transactional',
      lastModified: '2024-01-14',
      status: 'active'
    },
    {
      id: '3',
      name: 'Document Required',
      subject: 'Additional Documents Needed for Your SUN Bucks Application',
      type: 'Notification',
      lastModified: '2024-01-13',
      status: 'active'
    },
    {
      id: '4',
      name: 'Benefits Loaded',
      subject: 'Your SUN Bucks Benefits Are Now Available',
      type: 'Notification',
      lastModified: '2024-01-12',
      status: 'active'
    }
  ];

  const systemStatus = [
    { service: 'Web Application', status: 'operational', uptime: '99.9%' },
    { service: 'Database', status: 'operational', uptime: '99.8%' },
    { service: 'CALPADS Integration', status: 'degraded', uptime: '97.2%' },
    { service: 'EBT Integration', status: 'operational', uptime: '99.5%' },
    { service: 'File Storage', status: 'operational', uptime: '99.9%' },
    { service: 'Email Service', status: 'operational', uptime: '99.7%' }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', color: string }> = {
      operational: { variant: 'default', color: 'text-green-600' },
      degraded: { variant: 'destructive', color: 'text-orange-600' },
      outage: { variant: 'destructive', color: 'text-red-600' }
    };
    
    const config = variants[status] || variants.operational;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${status === 'operational' ? 'bg-green-500' : status === 'degraded' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleSettingChange = (key: string, value: string | boolean) => {
    setUnsavedChanges(true);
    // Handle setting change logic here
  };

  const handleSaveSettings = () => {
    setUnsavedChanges(false);
    // Save settings logic here
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>System Settings</h1>
          <p className="text-muted-foreground">Configure system behavior and preferences</p>
        </div>
        {unsavedChanges && (
          <Button onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {systemConfigs.map((config, index) => (
            <Card key={index} className="p-6">
              <h2 className="mb-4">{config.category}</h2>
              <div className="space-y-4">
                {config.settings.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={setting.key}>{setting.label}</Label>
                      {setting.type === 'boolean' && (
                        <Switch
                          id={setting.key}
                          checked={setting.value as boolean}
                          onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                        />
                      )}
                    </div>
                    
                    {setting.type === 'text' && (
                      <Input
                        id={setting.key}
                        value={setting.value as string}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      />
                    )}
                    
                    {setting.type === 'number' && (
                      <Input
                        id={setting.key}
                        type="number"
                        value={setting.value as string}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      />
                    )}
                    
                    {setting.type === 'select' && (
                      <select
                        id={setting.key}
                        value={setting.value as string}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        {setting.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                    
                    {setting.description && (
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Email Templates</h2>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>
            
            <div className="space-y-3">
              {emailTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border border-border rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedTemplate === template.id ? 'bg-accent border-primary' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant="outline">{template.type}</Badge>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1">{template.subject}</p>
                  <p className="text-xs text-muted-foreground">Last modified: {template.lastModified}</p>
                </div>
              ))}
            </div>
          </Card>

          {selectedTemplate && (
            <Card className="p-6">
              <h3 className="mb-4">Edit Template</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-subject">Subject Line</Label>
                  <Input
                    id="template-subject"
                    value="Your SUN Bucks Application Has Been Received"
                    onChange={() => {}}
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-content">Template Content</Label>
                  <Textarea
                    id="template-content"
                    rows={10}
                    value={`Dear {{customer_name}},

Thank you for submitting your SUN Bucks application. We have received your application and it is currently being reviewed.

Application Details:
- Application ID: {{application_id}}
- Submitted Date: {{submission_date}}
- Status: Under Review

You can track the status of your application by logging into your account at {{portal_url}}.

If you have any questions, please contact us at support@sunbucks.ca.gov or call 1-800-SUN-BUCKS.

Thank you,
SUN Bucks Program Team`}
                    onChange={() => {}}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button>Save Template</Button>
                  <Button variant="outline">Preview</Button>
                  <Button variant="outline">Test Send</Button>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4">System Integrations</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-md">
                <div>
                  <h3 className="font-medium">CALPADS Integration</h3>
                  <p className="text-sm text-muted-foreground">Student enrollment and meal program data</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default">Connected</Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border rounded-md">
                <div>
                  <h3 className="font-medium">EBT Vendor (FIS)</h3>
                  <p className="text-sm text-muted-foreground">Electronic benefits transfer processing</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default">Connected</Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border rounded-md">
                <div>
                  <h3 className="font-medium">CalSAWS</h3>
                  <p className="text-sm text-muted-foreground">Social services case management system</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Disconnected</Badge>
                  <Button variant="outline" size="sm">
                    <Key className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4">Security Configuration</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Authentication</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-mfa">Require MFA for Admin Users</Label>
                    <Switch id="require-mfa" checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sso-enabled">Enable Single Sign-On</Label>
                    <Switch id="sso-enabled" checked={true} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input id="session-timeout" type="number" value="30" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Data Protection</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="encryption-enabled">Enable Data Encryption</Label>
                    <Switch id="encryption-enabled" checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="audit-logging">Enable Audit Logging</Label>
                    <Switch id="audit-logging" checked={true} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                    <Input id="backup-retention" type="number" value="30" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>System Status</h2>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="space-y-3">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-md">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{service.service}</h4>
                      <p className="text-sm text-muted-foreground">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="mb-4">Alerts & Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="system-alerts">System Health Alerts</Label>
                <Switch id="system-alerts" checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="error-notifications">Error Notifications</Label>
                <Switch id="error-notifications" checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="performance-alerts">Performance Alerts</Label>
                <Switch id="performance-alerts" checked={true} />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}