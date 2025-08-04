import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert } from './ui/alert';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Phone,
  Building,
  User
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (userType: 'admin' | 'customer', userData: any) => void;
}

interface UserCredentials {
  email: string;
  password: string;
  mfaCode?: string;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [credentials, setCredentials] = useState<UserCredentials>({
    email: '',
    password: '',
    mfaCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginStep, setLoginStep] = useState<'credentials' | 'mfa' | 'loading'>('credentials');
  const [error, setError] = useState<string | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<'admin' | 'customer' | null>(null);

  // Mock user database for demonstration
  const mockUsers = {
    // Admin users
    'john.smith@cdss.ca.gov': {
      password: 'admin123',
      type: 'admin' as const,
      role: 'CDSS Administrator',
      department: 'Benefits Administration',
      agency: 'CDSS',
      requiresMFA: true,
      name: 'John Smith'
    },
    'sarah.davis@cde.ca.gov': {
      password: 'admin123',
      type: 'admin' as const,
      role: 'CDE User',
      department: 'Student Services', 
      agency: 'CDE',
      requiresMFA: true,
      name: 'Sarah Davis'
    },
    // Customer users
    'maria.garcia@email.com': {
      password: 'customer123',
      type: 'customer' as const,
      role: 'Customer',
      name: 'Maria Garcia',
      requiresMFA: false
    },
    'demo@customer.com': {
      password: 'demo123',
      type: 'customer' as const,
      role: 'Customer',
      name: 'Demo Customer',
      requiresMFA: false
    }
  };

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoginStep('loading');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers[credentials.email as keyof typeof mockUsers];
    
    if (!user) {
      setError('Invalid email address. Please check your credentials.');
      setLoginStep('credentials');
      return;
    }

    if (user.password !== credentials.password) {
      setError('Invalid password. Please try again.');
      setLoginStep('credentials');
      return;
    }

    // Check if MFA is required
    if (user.requiresMFA) {
      setLoginStep('mfa');
      return;
    }

    // Complete login
    completeLogin(user);
  };

  const handleMFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoginStep('loading');

    // Simulate MFA verification
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!credentials.mfaCode || credentials.mfaCode.length !== 6) {
      setError('Please enter a valid 6-digit MFA code.');
      setLoginStep('mfa');
      return;
    }

    // For demo purposes, accept any 6-digit code
    if (credentials.mfaCode === '123456' || credentials.mfaCode.length === 6) {
      const user = mockUsers[credentials.email as keyof typeof mockUsers];
      completeLogin(user);
    } else {
      setError('Invalid MFA code. Please try again.');
      setLoginStep('mfa');
    }
  };

  const completeLogin = (user: any) => {
    setLoginStep('credentials');
    onLogin(user.type, user);
  };

  const handleQuickLogin = (userType: 'admin' | 'customer') => {
    // Quick login for demo purposes
    if (userType === 'admin') {
      const adminUser = mockUsers['john.smith@cdss.ca.gov'];
      onLogin('admin', adminUser);
    } else {
      const customerUser = mockUsers['maria.garcia@email.com'];
      onLogin('customer', customerUser);
    }
  };

  const renderCredentialsStep = () => (
    <form onSubmit={handleInitialLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            placeholder="Enter your email address"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            placeholder="Enter your password"
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loginStep === 'loading'}
      >
        {loginStep === 'loading' ? 'Signing In...' : 'Sign In'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );

  const renderMFAStep = () => (
    <form onSubmit={handleMFASubmit} className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="font-medium">Multi-Factor Authentication</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mfa-code">Authentication Code</Label>
        <Input
          id="mfa-code"
          type="text"
          value={credentials.mfaCode}
          onChange={(e) => setCredentials({ ...credentials, mfaCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
          placeholder="000000"
          className="text-center text-lg tracking-widest"
          maxLength={6}
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loginStep === 'loading' || !credentials.mfaCode || credentials.mfaCode.length !== 6}
      >
        {loginStep === 'loading' ? 'Verifying...' : 'Verify & Sign In'}
      </Button>

      <Button 
        type="button" 
        variant="ghost" 
        className="w-full" 
        onClick={() => setLoginStep('credentials')}
      >
        Back to Login
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-40 h-16 flex items-center justify-center mx-auto mb-4">
            <img src="./rexus_logo.png" alt='Rexus Logo'></img>
          </div>
          <h1 className="text-2xl font-medium">SUN Bucks System</h1>
          <p className="text-muted-foreground">
            California Summer Nutrition Assistance Program
          </p>
        </div>

        {/* Main Login Card */}
        <Card className="p-6">
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <div className="ml-2">{error}</div>
              </Alert>
            )}

            {loginStep === 'credentials' && renderCredentialsStep()}
            {loginStep === 'mfa' && renderMFAStep()}

            {/* Forgot Password */}
            {loginStep === 'credentials' && (
              <div className="text-center">
                <Button variant="link" className="text-sm">
                  Forgot your password?
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Demo Quick Login */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="bg-yellow-100">Demo Mode</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              For demonstration purposes, you can quickly access different user types:
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickLogin('customer')}
                className="flex-1"
              >
                <User className="w-4 h-4 mr-2" />
                Customer Portal
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickLogin('admin')}
                className="flex-1"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Portal
              </Button>
            </div>
          </div>
        </Card>

        {/* Sample Credentials */}
        <Card className="p-4 bg-gray-50">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Sample Credentials for Testing:</h4>
            <div className="space-y-2 text-xs">
              <div>
                <p className="font-medium">Admin User:</p>
                <p>Email: john.smith@cdss.ca.gov</p>
                <p>Password: admin123</p>
                <p>MFA Code: 123456 (any 6 digits)</p>
              </div>
              <div>
                <p className="font-medium">Customer User:</p>
                <p>Email: maria.garcia@email.com</p>
                <p>Password: customer123</p>
                <p>No MFA required</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>© 2024 California Department of Social Services</p>
          <div className="flex justify-center gap-4">
            <Button variant="link" className="text-xs p-0 h-auto">Privacy Policy</Button>
            <Button variant="link" className="text-xs p-0 h-auto">Terms of Service</Button>
            <Button variant="link" className="text-xs p-0 h-auto">Accessibility</Button>
          </div>
        </div>
      </div>
    </div>
  );
}