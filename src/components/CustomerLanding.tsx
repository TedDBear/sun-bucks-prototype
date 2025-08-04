import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  CreditCard, 
  FileText, 
  HelpCircle,
  ArrowRight,
  Bell,
  Calendar
} from 'lucide-react';

export function CustomerLanding() {
  const benefits = [
    'Free summer meals for eligible children',
    'Easy online application process',
    'Direct deposit to EBT card',
    'No need to reapply if already enrolled'
  ];

  const announcements = [
    {
      title: 'Application Deadline Extended',
      content: 'The deadline for SUN Bucks applications has been extended to February 15th.',
      date: '2024-01-10',
      type: 'important'
    },
    {
      title: 'New Document Upload Feature',
      content: 'You can now upload documents directly through your account dashboard.',
      date: '2024-01-08',
      type: 'info'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-medium mb-4">SUN Bucks Program</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          The Summer Nutrition Assistance Program provides eligible families with benefits to purchase food 
          for children during summer months when school meals are not available.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            Check My Eligibility
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" size="lg">
            Sign In to My Account
          </Button>
        </div>
      </div>

      {/* Program Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="mb-4">Program Benefits</h2>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Applications Processed</span>
              <span className="font-medium">15,432</span>
            </div>
            <div className="flex justify-between">
              <span>Benefits Issued</span>
              <span className="font-medium">$2.1M</span>
            </div>
            <div className="flex justify-between">
              <span>Children Served</span>
              <span className="font-medium">8,765</span>
            </div>
            <div className="flex justify-between">
              <span>Average Processing Time</span>
              <span className="font-medium">3.2 days</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Announcements */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5" />
          <h2>Important Announcements</h2>
        </div>
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <div key={index} className="border border-border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{announcement.title}</h3>
                <Badge variant={announcement.type === 'important' ? 'destructive' : 'secondary'}>
                  {announcement.type === 'important' ? 'Important' : 'Info'}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-2">{announcement.content}</p>
              <p className="text-xs text-muted-foreground">{announcement.date}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer">
          <HelpCircle className="w-8 h-8 mx-auto mb-3 text-blue-600" />
          <h3 className="font-medium mb-2">Am I Eligible?</h3>
          <p className="text-sm text-muted-foreground">Quick eligibility screening tool</p>
        </Card>

        <Card className="p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer">
          <FileText className="w-8 h-8 mx-auto mb-3 text-green-600" />
          <h3 className="font-medium mb-2">Apply Now</h3>
          <p className="text-sm text-muted-foreground">Start your SUN Bucks application</p>
        </Card>

        <Card className="p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer">
          <CreditCard className="w-8 h-8 mx-auto mb-3 text-purple-600" />
          <h3 className="font-medium mb-2">Check Status</h3>
          <p className="text-sm text-muted-foreground">View your application status</p>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="p-6">
        <h2 className="mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Who is eligible for SUN Bucks?</h4>
            <p className="text-muted-foreground">
              Children who are eligible for free or reduced-price school meals, or children in households 
              that receive SNAP, TANF, or Medicaid benefits.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">How much will I receive?</h4>
            <p className="text-muted-foreground">
              Eligible children receive $40 per month for each month of summer vacation, 
              loaded onto an EBT card for food purchases.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">When will benefits be available?</h4>
            <p className="text-muted-foreground">
              Benefits are typically loaded in June and are available throughout the summer months.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="outline">View All FAQs</Button>
        </div>
      </Card>
    </div>
  );
}