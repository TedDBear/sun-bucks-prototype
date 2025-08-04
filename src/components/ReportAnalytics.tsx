import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Share,
  RefreshCw
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: string;
  description: string;
  lastGenerated: string;
  status: 'ready' | 'generating' | 'failed';
  fileSize: string;
  schedule: string;
}

export function ReportsAnalytics() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('last-30-days');

  const reports: Report[] = [
    {
      id: '1',
      name: 'Monthly Benefits Report',
      type: 'Compliance',
      description: 'Monthly summary of benefits issued and program participation',
      lastGenerated: '2024-01-15 09:30 AM',
      status: 'ready',
      fileSize: '2.4 MB',
      schedule: 'Monthly'
    },
    {
      id: '2',
      name: 'Eligibility Audit Report',
      type: 'Audit',
      description: 'Detailed audit of eligibility determinations and decisions',
      lastGenerated: '2024-01-14 02:15 PM',
      status: 'ready',
      fileSize: '5.1 MB',
      schedule: 'Weekly'
    },
    {
      id: '3',
      name: 'System Performance Report',
      type: 'Performance',
      description: 'Application performance metrics and system health indicators',
      lastGenerated: '2024-01-15 06:00 AM',
      status: 'generating',
      fileSize: 'Pending',
      schedule: 'Daily'
    },
    {
      id: '4',
      name: 'User Activity Report',
      type: 'Security',
      description: 'User login activity and system access patterns',
      lastGenerated: '2024-01-13 11:45 AM',
      status: 'failed',
      fileSize: 'N/A',
      schedule: 'Weekly'
    }
  ];

  const kpiData = [
    {
      title: 'Applications Processed',
      value: '15,432',
      change: '+12.5%',
      trend: 'up',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Benefits Issued',
      value: '$2.1M',
      change: '+8.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Approval Rate',
      value: '87.2%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Avg Processing Time',
      value: '3.2 days',
      change: '-0.8 days',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  const chartData = [
    { month: 'Jan', applications: 1200, approvals: 1050, rejections: 150 },
    { month: 'Feb', applications: 1350, approvals: 1180, rejections: 170 },
    { month: 'Mar', applications: 1500, approvals: 1320, rejections: 180 },
    { month: 'Apr', applications: 1800, approvals: 1570, rejections: 230 },
    { month: 'May', applications: 2100, approvals: 1830, rejections: 270 },
    { month: 'Jun', applications: 2400, approvals: 2090, rejections: 310 }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode }> = {
      ready: { variant: 'default', icon: <CheckCircle className="w-3 h-3" /> },
      generating: { variant: 'outline', icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate reports and view system analytics</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-90-days">Last 90 days</option>
            <option value="last-year">Last year</option>
            <option value="custom">Custom range</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={kpi.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-medium mt-2">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <IconComponent className={`w-8 h-8 ${kpi.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2>Application Trends</h2>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
          
          {/* Simplified chart visualization */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Applications</span>
              <span>Approvals</span>
              <span>Rejections</span>
            </div>
            {chartData.map((data, index) => (
              <div key={data.month} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{data.month}</span>
                  <span>{data.applications}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-12 text-xs">Apps</div>
                    <Progress value={(data.applications / 2500) * 100} className="flex-1 h-2" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 text-xs">Approved</div>
                    <Progress value={(data.approvals / 2500) * 100} className="flex-1 h-2 bg-green-100" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 text-xs">Rejected</div>
                    <Progress value={(data.rejections / 2500) * 100} className="flex-1 h-2 bg-red-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2>Benefits Distribution</h2>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-medium">$2.1M</p>
              <p className="text-sm text-muted-foreground">Total Benefits Issued</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Direct Certification</span>
                <span className="text-sm font-medium">$1.2M (57%)</span>
              </div>
              <Progress value={57} className="h-2" />
              
              <div className="flex justify-between">
                <span className="text-sm">Income Verification</span>
                <span className="text-sm font-medium">$650K (31%)</span>
              </div>
              <Progress value={31} className="h-2" />
              
              <div className="flex justify-between">
                <span className="text-sm">Manual Review</span>
                <span className="text-sm font-medium">$250K (12%)</span>
              </div>
              <Progress value={12} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      {/* Reports Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2>Available Reports</h2>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Generate Custom Report
          </Button>
        </div>
        
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`p-4 border border-border rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                selectedReport === report.id ? 'bg-accent border-primary' : ''
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">{report.name}</h4>
                  <Badge variant="outline">{report.type}</Badge>
                  {getStatusBadge(report.status)}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" disabled={report.status !== 'ready'}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
              
              <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Last Generated:</span> {report.lastGenerated}
                </div>
                <div>
                  <span className="font-medium">File Size:</span> {report.fileSize}
                </div>
                <div>
                  <span className="font-medium">Schedule:</span> {report.schedule}
                </div>
                <div>
                  <span className="font-medium">Format:</span> PDF, Excel, CSV
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium">Compliance Reports</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Generate federal and state compliance reports
          </p>
          <Button variant="outline" size="sm">Generate Report</Button>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="font-medium">Performance Analytics</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            View system performance and user analytics
          </p>
          <Button variant="outline" size="sm">View Dashboard</Button>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium">User Reports</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Export user activity and access reports
          </p>
          <Button variant="outline" size="sm">Export Data</Button>
        </Card>
      </div>
    </div>
  );
}