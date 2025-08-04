import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  CreditCard,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    { title: 'Active Cases', value: '12,453', change: '+5.2%', icon: FileText, color: 'text-blue-600' },
    { title: 'Pending Escalations', value: '127', change: '+12%', icon: AlertTriangle, color: 'text-orange-600' },
    { title: 'Benefits Issued Today', value: '$45,890', change: '+8.1%', icon: CreditCard, color: 'text-green-600' },
    { title: 'System Uptime', value: '99.9%', change: 'Normal', icon: TrendingUp, color: 'text-green-600' },
  ];

  const recentCases = [
    { id: 'CS-2024-001', name: 'Maria Garcia', status: 'approved', date: '2024-01-15' },
    { id: 'CS-2024-002', name: 'John Smith', status: 'pending', date: '2024-01-15' },
    { id: 'CS-2024-003', name: 'Lisa Johnson', status: 'review', date: '2024-01-14' },
    { id: 'CS-2024-004', name: 'David Brown', status: 'rejected', date: '2024-01-14' },
  ];

  const systemAlerts = [
    { type: 'warning', message: 'CALPADS integration experiencing delays', time: '2 hours ago' },
    { type: 'info', message: 'Scheduled maintenance: Sunday 2:00 AM - 4:00 AM', time: '1 day ago' },
    { type: 'success', message: 'EBT sync completed successfully', time: '3 hours ago' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'review': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

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
          <h1>Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of SUN Bucks program operations</p>
        </div>
        <Button>Generate Report</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-medium mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <IconComponent className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Recent Cases</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {recentCases.map((case_item) => (
              <div key={case_item.id} className="flex items-center justify-between p-3 border border-border rounded-md">
                <div className="flex items-center gap-3">
                  {getStatusIcon(case_item.status)}
                  <div>
                    <p className="font-medium">{case_item.name}</p>
                    <p className="text-sm text-muted-foreground">{case_item.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(case_item.status)}
                  <p className="text-xs text-muted-foreground mt-1">{case_item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>System Alerts</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-md">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  alert.type === 'warning' ? 'bg-orange-500' :
                  alert.type === 'success' ? 'bg-green-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="p-4 h-auto flex-col">
            <FileText className="w-6 h-6 mb-2" />
            Create New Case
          </Button>
          <Button variant="outline" className="p-4 h-auto flex-col">
            <Users className="w-6 h-6 mb-2" />
            Add User
          </Button>
          <Button variant="outline" className="p-4 h-auto flex-col">
            <AlertTriangle className="w-6 h-6 mb-2" />
            Review Escalations
          </Button>
        </div>
      </Card>
    </div>
  );
}