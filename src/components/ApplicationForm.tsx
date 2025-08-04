import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Alert } from './ui/alert';
import { 
  ArrowLeft,
  ArrowRight,
  User,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Upload,
  Home,
  Phone,
  Mail,
  Calendar,
  DollarSign
} from 'lucide-react';

interface ApplicationFormProps {
  onComplete: (applicationData: any) => void;
  onCancel: () => void;
}

interface FormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Step 2: Household Information
  householdSize: string;
  children: Array<{
    firstName: string;
    lastName: string;
    birthDate: string;
    school: string;
    grade: string;
  }>;
  
  // Step 3: Eligibility Information
  receivesSnapBenefits: boolean;
  receivesTanfBenefits: boolean;
  receivesMedicaid: boolean;
  childrenReceiveFreeReducedMeals: boolean;
  householdIncome: string;
  
  // Step 4: Document Upload
  documents: Array<{
    type: string;
    file: File | null;
    uploaded: boolean;
  }>;
  
  // Step 5: Certification
  certificationAgreement: boolean;
  electronicSignature: string;
}

export function ApplicationForm({ onComplete, onCancel }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'CA',
    zipCode: '',
    householdSize: '',
    children: [{ firstName: '', lastName: '', birthDate: '', school: '', grade: '' }],
    receivesSnapBenefits: false,
    receivesTanfBenefits: false,
    receivesMedicaid: false,
    childrenReceiveFreeReducedMeals: false,
    householdIncome: '',
    documents: [
      { type: 'Income Verification', file: null, uploaded: false },
      { type: 'School Enrollment', file: null, uploaded: false },
      { type: 'Identity Verification', file: null, uploaded: false }
    ],
    certificationAgreement: false,
    electronicSignature: ''
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const addChild = () => {
    setFormData({
      ...formData,
      children: [...formData.children, { firstName: '', lastName: '', birthDate: '', school: '', grade: '' }]
    });
  };

  const removeChild = (index: number) => {
    const newChildren = formData.children.filter((_, i) => i !== index);
    setFormData({ ...formData, children: newChildren });
  };

  const updateChild = (index: number, field: string, value: string) => {
    const newChildren = [...formData.children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setFormData({ ...formData, children: newChildren });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.address;
      case 2:
        return formData.householdSize && formData.children.every(child => child.firstName && child.lastName);
      case 3:
        return true; // At least one eligibility criteria or income
      case 4:
        return formData.documents.some(doc => doc.uploaded);
      case 5:
        return formData.certificationAgreement && formData.electronicSignature;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2>Personal Information</h2>
              <p className="text-muted-foreground">Please provide your contact information</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email address"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <div className="relative">
                <Home className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your street address"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="CA">California</option>
                </select>
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="12345"
                  maxLength={5}
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h2>Household Information</h2>
              <p className="text-muted-foreground">Tell us about your household members</p>
            </div>
            
            <div>
              <Label htmlFor="householdSize">Total Household Size *</Label>
              <Input
                id="householdSize"
                type="number"
                value={formData.householdSize}
                onChange={(e) => setFormData({ ...formData, householdSize: e.target.value })}
                placeholder="Number of people in household"
                min="1"
                max="20"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Include yourself and all people living in your household
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3>Children Information</h3>
                <Button type="button" variant="outline" size="sm" onClick={addChild}>
                  Add Child
                </Button>
              </div>
              
              {formData.children.map((child, index) => (
                <Card key={index} className="p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4>Child {index + 1}</h4>
                    {formData.children.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChild(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>First Name *</Label>
                      <Input
                        value={child.firstName}
                        onChange={(e) => updateChild(index, 'firstName', e.target.value)}
                        placeholder="Child's first name"
                      />
                    </div>
                    <div>
                      <Label>Last Name *</Label>
                      <Input
                        value={child.lastName}
                        onChange={(e) => updateChild(index, 'lastName', e.target.value)}
                        placeholder="Child's last name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Birth Date</Label>
                      <Input
                        type="date"
                        value={child.birthDate}
                        onChange={(e) => updateChild(index, 'birthDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>School</Label>
                      <Input
                        value={child.school}
                        onChange={(e) => updateChild(index, 'school', e.target.value)}
                        placeholder="School name"
                      />
                    </div>
                    <div>
                      <Label>Grade</Label>
                      <select
                        value={child.grade}
                        onChange={(e) => updateChild(index, 'grade', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="">Select grade</option>
                        <option value="K">Kindergarten</option>
                        <option value="1">1st Grade</option>
                        <option value="2">2nd Grade</option>
                        <option value="3">3rd Grade</option>
                        <option value="4">4th Grade</option>
                        <option value="5">5th Grade</option>
                        <option value="6">6th Grade</option>
                        <option value="7">7th Grade</option>
                        <option value="8">8th Grade</option>
                        <option value="9">9th Grade</option>
                        <option value="10">10th Grade</option>
                        <option value="11">11th Grade</option>
                        <option value="12">12th Grade</option>
                      </select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h2>Eligibility Information</h2>
              <p className="text-muted-foreground">Check all that apply to your household</p>
            </div>
            
            <Card className="p-4">
              <h3 className="mb-4">Benefit Programs</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.receivesSnapBenefits}
                    onChange={(e) => setFormData({ ...formData, receivesSnapBenefits: e.target.checked })}
                  />
                  <span>My household receives SNAP (Food Stamps) benefits</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.receivesTanfBenefits}
                    onChange={(e) => setFormData({ ...formData, receivesTanfBenefits: e.target.checked })}
                  />
                  <span>My household receives TANF (Temporary Assistance) benefits</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.receivesMedicaid}
                    onChange={(e) => setFormData({ ...formData, receivesMedicaid: e.target.checked })}
                  />
                  <span>My household receives Medicaid benefits</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.childrenReceiveFreeReducedMeals}
                    onChange={(e) => setFormData({ ...formData, childrenReceiveFreeReducedMeals: e.target.checked })}
                  />
                  <span>My children receive free or reduced-price school meals</span>
                </label>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="mb-4">Income Information (Optional)</h3>
              <div>
                <Label htmlFor="householdIncome">Annual Household Income</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="householdIncome"
                    type="number"
                    value={formData.householdIncome}
                    onChange={(e) => setFormData({ ...formData, householdIncome: e.target.value })}
                    placeholder="Enter annual income"
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Providing income information may help speed up your application processing
                </p>
              </div>
            </Card>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h2>Document Upload</h2>
              <p className="text-muted-foreground">Upload required supporting documents</p>
            </div>
            
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <div className="ml-2">
                <p>Required document formats: PDF, JPG, PNG (Max 10MB per file)</p>
              </div>
            </Alert>
            
            <div className="space-y-4">
              {formData.documents.map((doc, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4>{doc.type}</h4>
                    {doc.uploaded && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const newDocuments = [...formData.documents];
                          newDocuments[index] = { ...doc, file, uploaded: true };
                          setFormData({ ...formData, documents: newDocuments });
                        }
                      }}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      {doc.type === 'Income Verification' && 'Pay stubs, tax returns, or benefit statements'}
                      {doc.type === 'School Enrollment' && 'School enrollment verification or registration'}
                      {doc.type === 'Identity Verification' && 'Government-issued ID or driver\'s license'}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2>Review & Submit</h2>
              <p className="text-muted-foreground">Please review your application and certify its accuracy</p>
            </div>
            
            <Card className="p-4">
              <h3 className="mb-4">Application Summary</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Applicant:</strong> {formData.firstName} {formData.lastName}</div>
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Phone:</strong> {formData.phone}</div>
                <div><strong>Household Size:</strong> {formData.householdSize}</div>
                <div><strong>Children:</strong> {formData.children.length}</div>
                <div><strong>Documents Uploaded:</strong> {formData.documents.filter(d => d.uploaded).length} of {formData.documents.length}</div>
              </div>
            </Card>
            
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <h3 className="mb-4">Certification</h3>
              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.certificationAgreement}
                    onChange={(e) => setFormData({ ...formData, certificationAgreement: e.target.checked })}
                    className="mt-1"
                  />
                  <span className="text-sm">
                    I certify that the information provided in this application is true and complete to the best of my knowledge. 
                    I understand that providing false information may result in denial of benefits and/or legal action.
                  </span>
                </label>
                
                <div>
                  <Label htmlFor="signature">Electronic Signature *</Label>
                  <Input
                    id="signature"
                    value={formData.electronicSignature}
                    onChange={(e) => setFormData({ ...formData, electronicSignature: e.target.value })}
                    placeholder="Type your full name as electronic signature"
                  />
                </div>
              </div>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium mb-2">SUN Bucks Application</h1>
          <p className="text-muted-foreground">California Summer Nutrition Assistance Program</p>
        </div>

        {/* Progress */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Form Content */}
        <Card className="p-6 mb-6">
          {renderStep()}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={currentStep === 1 ? onCancel : handlePrevious}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            {currentStep === totalSteps ? 'Submit Application' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}