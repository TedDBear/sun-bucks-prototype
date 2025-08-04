import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { MainNavigation } from './components/MainNavigation';
import { AdminDashboard } from './components/AdminDashboard';
import { CaseManagement } from './components/CaseManagement';
import { CaseDetailPage } from './components/CaseDetailPage';
import { CustomerLanding } from './components/CustomerLanding';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ApplicationForm } from './components/ApplicationForm';
import { EligibilityTool } from './components/EligibilityTool';
import { DocumentUpload } from './components/DocumentUpload';
import { SupportCenter } from './components/SupportCenter';
import { EscalationsManagement } from './components/EscalationsManagement';
import { UserManagement } from './components/UserManagement';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { SystemSettings } from './components/SystemSettings';
import { DataImportPage } from './components/DataImportPage';
import { BulkProcessingPage } from './components/BulkProcessingPage';
import { NotificationCenter } from './components/NotificationCenter';

interface User {
  type: 'admin' | 'customer';
  name: string;
  email: string;
  role: string;
  agency?: string;
  department?: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'admin' | 'customer'>('customer');
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const handleLogin = (userType: 'admin' | 'customer', userData: any) => {
    const user: User = {
      type: userType,
      name: userData.name,
      email: userData.email || userData.username,
      role: userData.role,
      agency: userData.agency,
      department: userData.department
    };
    
    setCurrentUser(user);
    setCurrentView(userType);
    setIsAuthenticated(true);
    
    // Set appropriate default page based on user type
    if (userType === 'admin') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('customer-dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('customer');
    setCurrentPage('landing');
    setSelectedCaseId(null);
  };

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentPage('case-detail');
  };

  const handleBackFromCaseDetail = () => {
    setSelectedCaseId(null);
    setCurrentPage('case-management');
  };

  const handleApplicationComplete = (applicationData: any) => {
    console.log('Application completed:', applicationData);
    setCurrentPage('customer-dashboard');
  };

  const handleApplicationCancel = () => {
    setCurrentPage('customer-dashboard');
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (currentView === 'admin') {
      switch (currentPage) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'case-management':
          return <CaseManagement onCaseSelect={handleCaseSelect} />;
        case 'case-detail':
          return selectedCaseId ? (
            <CaseDetailPage caseId={selectedCaseId} onBack={handleBackFromCaseDetail} />
          ) : (
            <CaseManagement onCaseSelect={handleCaseSelect} />
          );
        case 'escalations':
          return <EscalationsManagement />;
        case 'user-management':
          return <UserManagement />;
        case 'reports':
          return <ReportsAnalytics />;
        case 'settings':
          return <SystemSettings />;
        case 'data-import':
          return <DataImportPage />;
        case 'bulk-processing':
          return <BulkProcessingPage />;
        case 'notifications':
          return <NotificationCenter />;
        default:
          return <AdminDashboard />;
      }
    } else {
      // Customer portal
      switch (currentPage) {
        case 'landing':
          return <CustomerLanding />;
        case 'customer-dashboard':
          return <CustomerDashboard />;
        case 'application-form':
          return <ApplicationForm onComplete={handleApplicationComplete} onCancel={handleApplicationCancel} />;
        case 'eligibility-tool':
          return <EligibilityTool />;
        case 'document-upload':
          return <DocumentUpload />;
        case 'support':
          return <SupportCenter />;
        default:
          return <CustomerDashboard />;
      }
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <MainNavigation 
        currentView={currentView}
        currentPage={currentPage}
        currentUser={currentUser}
        onViewChange={(view) => {
          // Only allow view switching for admin users
          if (currentUser?.type === 'admin') {
            setCurrentView(view);
            // Reset to appropriate default page when switching views
            setCurrentPage(view === 'admin' ? 'dashboard' : 'customer-dashboard');
            setSelectedCaseId(null);
          }
        }}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}