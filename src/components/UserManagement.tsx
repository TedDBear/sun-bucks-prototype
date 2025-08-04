import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  Building,
  Key,
  UserCheck,
  UserX,
  MoreHorizontal
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  agency: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  created: string;
  phone: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showNewUser, setShowNewUser] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const users: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@cdss.ca.gov',
      role: 'CDSS Administrator',
      department: 'Benefits Administration',
      agency: 'CDSS',
      status: 'active',
      lastLogin: '2024-01-15 9:30 AM',
      created: '2023-06-15',
      phone: '(916) 555-0123',
      permissions: ['case_management', 'user_management', 'reports', 'system_admin']
    },
    {
      id: '2',
      name: 'Sarah Davis',
      email: 'sarah.davis@cde.ca.gov',
      role: 'CDE User',
      department: 'Student Services',
      agency: 'CDE',
      status: 'active',
      lastLogin: '2024-01-14 2:15 PM',
      created: '2023-08-20',
      phone: '(916) 555-0456',
      permissions: ['case_view', 'reports_view']
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@contractor.com',
      role: 'Call Center Agent',
      department: 'Customer Support',
      agency: 'Contract Agency',
      status: 'active',
      lastLogin: '2024-01-15 8:45 AM',
      created: '2023-12-01',
      phone: '(916) 555-0789',
      permissions: ['case_view', 'customer_support']
    },
    {
      id: '4',
      name: 'Lisa Johnson',
      email: 'lisa.johnson@cdss.ca.gov',
      role: 'CDSS User',
      department: 'Operations',
      agency: 'CDSS',
      status: 'inactive',
      lastLogin: '2024-01-10 3:22 PM',
      created: '2023-04-10',
      phone: '(916) 555-0321',
      permissions: ['case_management', 'reports_view']
    }
  ];

  const roles: Role[] = [
    {
      id: '1',
      name: 'CDSS Administrator',
      description: 'Full system access for CDSS staff',
      permissions: ['case_management', 'user_management', 'reports', 'system_admin', 'escalations'],
      userCount: 5
    },
    {
      id: '2',
      name: 'CDSS User',
      description: 'Standard access for CDSS case workers',
      permissions: ['case_management', 'reports_view', 'customer_support'],
      userCount: 12
    },
    {
      id: '3',
      name: 'CDE User',
      description: 'Read-only access for CDE staff',
      permissions: ['case_view', 'reports_view'],
      userCount: 8
    },
    {
      id: '4',
      name: 'Call Center Agent',
      description: 'Customer support and basic case access',
      permissions: ['case_view', 'customer_support'],
      userCount: 15
    }
  ];

  const agencies = [
    { id: 'cdss', name: 'California Department of Social Services (CDSS)' },
    { id: 'cde', name: 'California Department of Education (CDE)' },
    { id: 'contractor', name: 'Contract Agency' },
    { id: 'radd', name: 'Regional Administrative Data Division (RADD)' }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode }> = {
      active: { variant: 'default', icon: <UserCheck className="w-3 h-3" /> },
      inactive: { variant: 'secondary', icon: <UserX className="w-3 h-3" /> },
      suspended: { variant: 'destructive', icon: <Shield className="w-3 h-3" /> }
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
          <h1>User Management</h1>
          <p className="text-muted-foreground">Manage users, roles, and permissions across the system</p>
        </div>
        <Button onClick={() => setShowNewUser(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New User
        </Button>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="agencies">Agencies</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-medium">40</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-medium">35</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Agencies</p>
                  <p className="text-2xl font-medium">4</p>
                </div>
                <Building className="w-8 h-8 text-purple-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Roles</p>
                  <p className="text-2xl font-medium">6</p>
                </div>
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Users List */}
            <div className="xl:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2>System Users</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input className="pl-10" placeholder="Search users..." />
                    </div>
                    <select className="px-3 py-2 border border-border rounded-md bg-background">
                      <option>All Agencies</option>
                      <option>CDSS</option>
                      <option>CDE</option>
                      <option>Contract Agency</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 border border-border rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                        selectedUser === user.id ? 'bg-accent border-primary' : ''
                      }`}
                      onClick={() => setSelectedUser(user.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{user.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(user.status)}
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Role:</span> {user.role}
                        </div>
                        <div>
                          <span className="font-medium">Agency:</span> {user.agency}
                        </div>
                        <div>
                          <span className="font-medium">Last Login:</span> {user.lastLogin}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* User Details */}
            <div className="xl:col-span-1">
              {selectedUser ? (
                <Card className="p-6 sticky top-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3>User Details</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {(() => {
                    const user = users.find(u => u.id === selectedUser);
                    if (!user) return null;
                    
                    return (
                      <div className="space-y-4">
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{user.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span>{user.department}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Created {user.created}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Permissions</h4>
                          <div className="space-y-1">
                            {user.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission.replace('_', ' ').toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Account Status</h4>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="user-status">Active</Label>
                            <Switch id="user-status" checked={user.status === 'active'} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full">
                            <Key className="w-4 h-4 mr-2" />
                            Reset Password
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Notification
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </Card>
              ) : (
                <Card className="p-6 text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a user to view details</p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Roles & Permissions</h2>
              <Button variant="outline" onClick={() => setShowRoleModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Role
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <Card key={role.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{role.name}</h3>
                    <Badge variant="outline">{role.userCount} users</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Permissions:</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace('_', ' ').toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Assign Users
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="agencies" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Agency Management</h2>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Agency
              </Button>
            </div>
            
            <div className="space-y-4">
              {agencies.map((agency) => (
                <div key={agency.id} className="flex items-center justify-between p-4 border border-border rounded-md">
                  <div>
                    <h3 className="font-medium">{agency.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {users.filter(u => u.agency === agency.name.split(' ')[0]).length} users
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                    <Button size="sm" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      View Users
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New User Modal - simplified for wireframe */}
      {showNewUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3>Add New User</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNewUser(false)}>×</Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-name">Full Name</Label>
                <Input id="user-name" placeholder="Enter full name" />
              </div>
              
              <div>
                <Label htmlFor="user-email">Email</Label>
                <Input id="user-email" type="email" placeholder="Enter email address" />
              </div>
              
              <div>
                <Label htmlFor="user-role">Role</Label>
                <select id="user-role" className="w-full px-3 py-2 border border-border rounded-md bg-background">
                  <option>Select role...</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="user-agency">Agency</Label>
                <select id="user-agency" className="w-full px-3 py-2 border border-border rounded-md bg-background">
                  <option>Select agency...</option>
                  {agencies.map(agency => (
                    <option key={agency.id} value={agency.id}>{agency.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1">Create User</Button>
                <Button variant="outline" onClick={() => setShowNewUser(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}