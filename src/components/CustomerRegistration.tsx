
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
 
interface RegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
  preferredLanguage: string;
  enableMFA: boolean;
  agreedToTerms: boolean;
}
 
export function CustomerRegistration() {
  const [formData, setFormData] = useState<RegistrationData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dob: '',
    phoneNumber: '',
    preferredLanguage: 'en',
    enableMFA: false,
    agreedToTerms: false
  });
 
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [mfaQRCode, setMfaQRCode] = useState<string>('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
 
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'ko', name: '한국어' },
    { code: 'tl', name: 'Tagalog' },
    { code: 'ar', name: 'العربية' }
  ];
 
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
 
    // Required field validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms';
 
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
 
    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
 
    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
 
    // Username validation
    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
 
    setIsLoading(true);
    setErrors({});
 
    try {
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          dob: formData.dob || null,
          phone_number: formData.phoneNumber || null,
          preferred_language: formData.preferredLanguage,
          enable_mfa: formData.enableMFA
        })
      });
 
      const result = await response.json();
 
      if (response.ok) {
        setRegistrationSuccess(true);
        if (result.mfa_qr_code) {
          setMfaQRCode(result.mfa_qr_code);
        }
      } else {
        setErrors({ submit: result.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleInputChange = (field: keyof RegistrationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
 
  if (registrationSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-600">Registration Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your account has been created successfully.
            </p>
            
            {mfaQRCode && (
              <div className="space-y-4">
                <p className="text-sm font-medium">Set up Two-Factor Authentication:</p>
                <div className="flex justify-center">
                  <img 
                    src={`data:image/png;base64,${mfaQRCode}`} 
                    alt="MFA QR Code"
                    className="border rounded"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
              </div>
            )}
            
            <Button 
              onClick={() => window.location.href = '/customer/login'}
              className="w-full mt-4"
            >
              Continue to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
 
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Create Your Account</CardTitle>
          <p className="text-center text-gray-600">
            Register to access benefits and apply for meal programs
          </p>
        </CardHeader>
        <CardContent>
          {errors.submit && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}
 
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Language Preference */}
            <div>
              <Label htmlFor="language">Preferred Language / Idioma Preferido</Label>
              <Select value={formData.preferredLanguage} onValueChange={(value) => handleInputChange('preferredLanguage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


 
{/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                  autoComplete="given-name"
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="text-red-500 text-sm mt-1" role="alert">
                    {errors.firstName}
                  </p>
                )}
              </div>
 
              <div>
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                  autoComplete="family-name"
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="text-red-500 text-sm mt-1" role="alert">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
 
            {/* Date of Birth */}
            <div>
              <Label htmlFor="dob">Date of Birth (Optional)</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                autoComplete="bday"
              />
            </div>
 
            {/* Contact Information */}
            <div>
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                autoComplete="email"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
 
            <div>
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                autoComplete="tel"
              />
            </div>
 
            {/* Account Information */}
            <div>
              <Label htmlFor="username">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={errors.username ? 'border-red-500' : ''}
                autoComplete="username"
                aria-describedby={errors.username ? 'username-error' : 'username-help'}
              />
              <p id="username-help" className="text-xs text-gray-500 mt-1">
                Must be at least 3 characters
              </p>
              {errors.username && (
                <p id="username-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.username}
                </p>
              )}
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                  autoComplete="new-password"
                  aria-describedby={errors.password ? 'password-error' : 'password-help'}
                />
                <p id="password-help" className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters
                </p>
                {errors.password && (
                  <p id="password-error" className="text-red-500 text-sm mt-1" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>
 
              <div>
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                  autoComplete="new-password"
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                />
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-red-500 text-sm mt-1" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
 
            {/* Security Options */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium">Security Options</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableMFA"
                  checked={formData.enableMFA}
                  onCheckedChange={(checked) => handleInputChange('enableMFA', !!checked)}
                />
                <Label htmlFor="enableMFA" className="text-sm">
                  Enable Two-Factor Authentication (Recommended)
                </Label>
              </div>
              
              <p className="text-xs text-gray-600">
                Two-factor authentication adds an extra layer of security to your account.
              </p>
            </div>
 
           
 
 {/* Terms Agreement */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreedToTerms', !!checked)}
                  className={errors.agreedToTerms ? 'border-red-500' : ''}
                />
                <Label htmlFor="agreedToTerms" className="text-sm leading-normal">
                  I agree to the{' '}
                  <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                    Privacy Policy
                  </a>
                  <span className="text-red-500"> *</span>
                </Label>
              </div>
              {errors.agreedToTerms && (
                <p className="text-red-500 text-sm" role="alert">
                  {errors.agreedToTerms}
                </p>
              )}
            </div>
 
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
 
          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/customer/login" className="text-blue-600 hover:underline">
                Sign in here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


 