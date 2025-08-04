import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  Users, 
  BarChart3, 
  FileText, 
  AlertTriangle, 
  Settings, 
  Home,
  User,
  Upload,
  HelpCircle,
  LogOut,
  ChevronDown,
  Shield,
  Building,
  Database,
  Zap,
  Bell,
  Edit
} from 'lucide-react';

interface User {
  type: 'admin' | 'customer';
  name: string;
  email: string;
  role: string;
  agency?: string;
  department?: string;
}

interface MainNavigationProps {
  currentView: 'admin' | 'customer';
  currentPage: string;
  currentUser: User | null;
  onViewChange: (view: 'admin' | 'customer') => void;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

interface Page {
  id: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>; // or appropriate type from lucide-react
  badge?: string;  // optional property
}

export function MainNavigation({ 
  currentView, 
  currentPage, 
  currentUser,
  onViewChange, 
  onPageChange,
  onLogout 
}: Readonly<MainNavigationProps>) {
  const adminPages: Page[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'case-management', label: 'Case Management', icon: FileText },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle, badge: '3' },
    { id: 'data-import', label: 'Data Import', icon: Database },
    { id: 'bulk-processing', label: 'Bulk Processing', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const customerPages: Page[] = [
    { id: 'landing', label: 'Program Info', icon: Home },
    { id: 'customer-dashboard', label: 'My Dashboard', icon: User },
    { id: 'application-form', label: 'Apply Now', icon: Edit },
    { id: 'eligibility-tool', label: 'Am I Eligible?', icon: HelpCircle },
    { id: 'document-upload', label: 'Upload Documents', icon: Upload },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  const pages = currentView === 'admin' ? adminPages : customerPages;

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-40 h-20 flex items-center justify-center">
           <img src="./rexus_logo.png" alt='Rexus Logo'></img>
          </div>
          <div>
            <h1 className="text-lg font-medium">SUN Bucks</h1>
            <p className="text-xs text-muted-foreground">California Summer School Lunches</p>
          </div>
        </div>
        
        {/* View switcher - only show for admin users */}
        {currentUser?.type === 'admin' && (
          <div className="flex gap-2">
            <Button 
              variant={currentView === 'admin' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewChange('admin')}
              className="flex-1"
            >
              <Shield className="w-3 h-3 mr-2" />
              Admin
            </Button>
            <Button 
              variant={currentView === 'customer' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewChange('customer')}
              className="flex-1"
            >
              <User className="w-3 h-3 mr-2" />
              Customer
            </Button>
          </div>
        )}

        {/* User type badge for customers */}
        {currentUser?.type === 'customer' && (
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              <User className="w-3 h-3 mr-1" />
              Customer Portal
            </Badge>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-2">
          {pages.map((page) => {
            const IconComponent = page.icon;
            return (
              <Button
                key={page.id}
                variant={currentPage === page.id ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => onPageChange(page.id)}
              >
                <IconComponent className="w-4 h-4 mr-3" />
                {page.label}
                {page.badge && (
                  <Badge variant="destructive" className="ml-auto">
                    {page.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border">
        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentUser.role}</p>
                    {currentUser.agency && (
                      <p className="text-xs text-muted-foreground truncate">{currentUser.agency}</p>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              {currentUser.type === 'admin' && (
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}