import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  CreditCard, 
  FileText, 
  CheckCircle, 
  Clock,
  User,
  Download,
  Eye,
  Upload,
  Bell
} from 'lucide-react';

export function CustomerDashboard() {
  const applicationStatus = {
    status: 'approved',
    progress: 100,
    submittedDate: '2024-01-10',
    approvedDate: '2024-01-14',
    nextStep: 'Benefits will be loaded to your EBT card'
  };

  const children = [
    { name: 'Maria Garcia Jr.', age: 8, status: 'approved', benefits: '$120' },
    { name: 'Carlos Garcia', age: 12, status: 'approved', benefits: '$120' },
  ];

  const recentActivity = [
    { date: '2024-01-14', activity: 'Application approved', type: 'success' },
    { date: '2024-01-12', activity: 'Documents reviewed', type: 'info' },
    { date: '2024-01-10', activity: 'Application submitted', type: 'info' },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      approved: 'default',
      pending: 'secondary',
      review: 'outline',
      rejected: 'destructive'
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your SUN Bucks account overview.</p>
        </div>
        <Button variant="outline">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </Button>
      </div>

      {/* Application Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2>Application Status</h2>
          {getStatusBadge(applicationStatus.status)}
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Application Progress</span>
              <span>{applicationStatus.progress}%</span>
            </div>
            <Progress value={applicationStatus.progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Submitted</p>
              <p className="font-medium">{applicationStatus.submittedDate}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Approved</p>
              <p className="font-medium">{applicationStatus.approvedDate}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Next Step</p>
              <p className="font-medium">{applicationStatus.nextStep}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Benefits Summary */}
        <Card className="p-6">
          <h2 className="mb-4">Benefits Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-md">
              <div>
                <p className="font-medium">Total Benefits Approved</p>
                <p className="text-2xl text-green-600">$240</p>
              </div>
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Eligible Children</h3>
              {children.map((child, index) => (
                <div key={index} className="flex justify-between items-center p-3 border border-border rounded-md">
                  <div>
                    <p className="font-medium">{child.name}</p>
                    <p className="text-sm text-muted-foreground">Age {child.age}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(child.status)}
                    <p className="text-sm font-medium mt-1">{child.benefits}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* EBT Card Information */}
        <Card className="p-6">
          <h2 className="mb-4">EBT Card Information</h2>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-lg">
              <p className="text-sm opacity-90">California EBT Card</p>
              <p className="text-lg font-mono mt-2">**** **** **** 1234</p>
              <div className="flex justify-between mt-4">
                <div>
                  <p className="text-xs opacity-90">Card Holder</p>
                  <p className="text-sm">MARIA GARCIA</p>
                </div>
                <div>
                  <p className="text-xs opacity-90">Balance</p>
                  <p className="text-sm">$240.00</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Transaction History
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Statement
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <p className="text-sm">{activity.activity}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-3" />
              Upload Additional Documents
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <User className="w-4 h-4 mr-3" />
              Update Household Information
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-3" />
              Download Application Copy
            </Button>
          </div>
        </Card>
      </div>

      {/* Important Notices */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Important Notice</h3>
            <p className="text-blue-800 mt-1">
              Your benefits will be automatically loaded to your EBT card on June 1st, 2024. 
              You will receive a text notification when benefits are available.
            </p>
            <Button variant="link" className="text-blue-600 p-0 mt-2">
              Update notification preferences →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}