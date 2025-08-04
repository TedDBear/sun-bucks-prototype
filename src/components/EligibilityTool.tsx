import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  HelpCircle
} from 'lucide-react';
import { SupportCenter } from './SupportCenter';


export function EligibilityTool() {
  const [currentStep, setCurrentStep] = useState(1);
 const [formData, setFormData] = useState<{
  householdSize: string;
  income: string;
  hasSchoolMeals: boolean | null;  // allow boolean or null
  benefitPrograms: string[];
  children: any[];
  zipCode: string;
}>({
  householdSize: '',
  income: '',
  hasSchoolMeals: null,  // initial value is null
  benefitPrograms: [],
  children: [],
  zipCode: ''
});
  const [result, setResult] = useState<'eligible' | 'ineligible' | 'maybeEligible' | null>(null);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleStartOver = () => {
  setCurrentStep(1);
  setFormData({
    householdSize: '',
    income: '',
    hasSchoolMeals: null,
    benefitPrograms: [],
    children: [],
    zipCode: ''
  });
  setResult(null);
};

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateEligibility();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateEligibility = () => {
    // Simple eligibility logic for demonstration
    const income = parseInt(formData.income);
    const householdSize = parseInt(formData.householdSize);
    
    // Example income thresholds (simplified)
    const incomeThresholds: Record<number, number> = {
      1: 25000,
      2: 34000,
      3: 43000,
      4: 52000,
      5: 61000,
      6: 70000
    };

    const threshold = incomeThresholds[householdSize] || 70000;
    
    if (formData.hasSchoolMeals || formData.benefitPrograms.length > 0) {
      setResult('eligible');
    } else if (income && income <= threshold) {
      setResult('eligible');
    } else if (income && income <= threshold * 1.3) {
      setResult('maybeEligible');
    } else {
      setResult('ineligible');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2>Household Information</h2>
              <p className="text-muted-foreground">Tell us about your household</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="householdSize">How many people live in your household?</Label>
                <Input
                  id="householdSize"
                  type="number"
                  value={formData.householdSize}
                  onChange={(e) => setFormData({...formData, householdSize: e.target.value})}
                  placeholder="Enter number of people"
                  min="1"
                  max="20"
                />
              </div>
              
              <div>
                <Label htmlFor="zipCode">What is your ZIP code?</Label>
                <Input
                  id="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  placeholder="Enter your ZIP code"
                  maxLength={5}
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2>School Meal Programs</h2>
              <p className="text-muted-foreground">Do your children receive school meals?</p>
            </div>
            
            <div className="space-y-4">
              <Label>Do any of your children receive free or reduced-price school meals?</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="schoolMeals" 
                    value="yes"
                    onChange={(e) => setFormData({...formData, hasSchoolMeals: e.target.value === 'yes'})}
                  />
                  <span>Yes, my children receive free or reduced-price school meals</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="schoolMeals" 
                    value="no"
                    onChange={(e) => setFormData({...formData, hasSchoolMeals: e.target.value === 'yes'})}
                  />
                  <span>No, my children do not receive school meals</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="schoolMeals" 
                    value="unsure"
                    onChange={(e) => setFormData({...formData, hasSchoolMeals: null})}
                  />
                  <span>I'm not sure</span>
                </label>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2>Benefit Programs</h2>
              <p className="text-muted-foreground">Select any programs your household currently receives</p>
            </div>
            
            <div className="space-y-4">
              <Label>Check all that apply:</Label>
              <div className="space-y-2">
                {['SNAP (Food Stamps)', 'TANF (Temporary Assistance)', 'Medicaid', 'WIC', 'Free/Reduced School Lunch'].map((program) => (
                  <label key={program} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, benefitPrograms: [...formData.benefitPrograms, program]});
                        } else {
                          setFormData({...formData, benefitPrograms: formData.benefitPrograms.filter(p => p !== program)});
                        }
                      }}
                    />
                    <span>{program}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2>Income Information</h2>
              <p className="text-muted-foreground">This helps us determine your eligibility</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="income">What is your approximate annual household income?</Label>
                <Input
                  id="income"
                  type="number"
                  value={formData.income}
                  onChange={(e) => setFormData({...formData, income: e.target.value})}
                  placeholder="Enter annual income (optional)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This information is optional and helps provide a more accurate eligibility assessment.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderResult = () => {
    if (result === 'eligible') {
      return (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-green-600">You may be eligible!</h2>
            <p className="text-muted-foreground mt-2">
              Based on your responses, your household appears to qualify for SUN Bucks benefits.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="font-medium text-green-900 mb-2">Next Steps:</h3>
            <ul className="text-sm text-green-800 space-y-1 text-left">
              <li>• Complete the full application</li>
              <li>• Submit required documentation</li>
              <li>• Wait for application review (typically 3-5 days)</li>
              <li>• Receive your EBT card in the mail</li>
            </ul>
          </div>
          <Button size="lg">
            Start Application
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      );
    }
    
    if (result === 'maybeEligible') {
      return (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-yellow-600">You might be eligible</h2>
            <p className="text-muted-foreground mt-2">
              Based on your responses, you may qualify for SUN Bucks. We recommend applying to get a definitive answer.
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-yellow-800">
              Income levels can vary, and there may be other factors that could make you eligible. 
              The application process will provide a complete eligibility review.
            </p>
          </div>
          <Button size="lg">
            Apply Anyway
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      );
    }
    
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h2 className="text-red-600">You may not be eligible</h2>
          <p className="text-muted-foreground mt-2">
            Based on your responses, your household may not qualify for SUN Bucks benefits at this time.
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-md">
          <h3 className="font-medium text-red-900 mb-2">But don't give up!</h3>
          <ul className="text-sm text-red-800 space-y-1 text-left">
            <li>• Your situation may change</li>
            <li>• There may be other programs you qualify for</li>
            <li>• You can always reapply if circumstances change</li>
          </ul>
        </div>
        <div className="space-y-2">
          <Button variant="outline" size="lg">
            Find Other Resources
          </Button>
          <Button variant="ghost" onClick={handleStartOver}>Start Over</Button>
        </div>
      </div>
    );
  };

  if (result) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl mx-auto p-8">
          {renderResult()}
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1>Am I Eligible for SUN Bucks?</h1>
          <p className="text-muted-foreground mt-2">
            Answer a few quick questions to see if you qualify for summer nutrition benefits
          </p>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button onClick={handleNext}>
              {currentStep === totalSteps ? 'Check Eligibility' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            This tool provides an estimate only. Final eligibility is determined during the application review process.
          </p>
        </div>
      </div>
    </div>
  );
}