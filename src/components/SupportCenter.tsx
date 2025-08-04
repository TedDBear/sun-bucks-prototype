import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Search, 
  HelpCircle,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  ChevronRight,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created: string;
  lastUpdate: string;
  description: string;
}

export function SupportCenter() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  const tickets: SupportTicket[] = [
    {
      id: 'T-2024-001',
      subject: 'Unable to access my application status',
      category: 'Technical Support',
      status: 'in-progress',
      priority: 'medium',
      created: '2024-01-15',
      lastUpdate: '2024-01-15',
      description: 'I am unable to log into my account to check my application status. The page keeps loading but never displays my information.'
    },
    {
      id: 'T-2024-002',
      subject: 'Document upload failing',
      category: 'Technical Support',
      status: 'resolved',
      priority: 'high',
      created: '2024-01-14',
      lastUpdate: '2024-01-14',
      description: 'My PDF documents are not uploading successfully. I get an error message each time I try.'
    },
    {
      id: 'T-2024-003',
      subject: 'Question about eligibility requirements',
      category: 'General Inquiry',
      status: 'closed',
      priority: 'low',
      created: '2024-01-12',
      lastUpdate: '2024-01-13',
      description: 'I need clarification on the income requirements for the SUN Bucks program.'
    }
  ];

  const faqs = [
    {
      question: 'How do I check my application status?',
      answer: 'You can check your application status by logging into your account and viewing your dashboard. Your current status will be displayed prominently.',
      category: 'Account'
    },
    {
      question: 'What documents do I need to upload?',
      answer: 'Required documents include proof of income, school enrollment verification, identity verification, and household composition documentation.',
      category: 'Documents'
    },
    {
      question: 'When will I receive my benefits?',
      answer: 'Benefits are typically loaded to your EBT card within 5-7 business days of application approval.',
      category: 'Benefits'
    },
    {
      question: 'How do I update my contact information?',
      answer: 'You can update your contact information in your account settings or by contacting customer support.',
      category: 'Account'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string, icon: React.ReactNode }> = {
      open: { variant: 'secondary', label: 'Open', icon: <AlertCircle className="w-3 h-3" /> },
      'in-progress': { variant: 'outline', label: 'In Progress', icon: <Clock className="w-3 h-3" /> },
      resolved: { variant: 'default', label: 'Resolved', icon: <CheckCircle className="w-3 h-3" /> },
      closed: { variant: 'secondary', label: 'Closed', icon: <CheckCircle className="w-3 h-3" /> }
    };
    
    const config = variants[status];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      low: 'secondary',
      medium: 'outline',
      high: 'destructive'
    };
    
    return <Badge variant={variants[priority]}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Support Center</h1>
          <p className="text-muted-foreground">Get help with your SUN Bucks application and account</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Call Support
          </Button>
          <Button variant="outline">
            <MessageCircle className="w-4 h-4 mr-2" />
            Live Chat
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="new-ticket">New Ticket</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Support Tickets</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Search tickets..." />
                </div>
                <select className="px-3 py-2 border border-border rounded-md bg-background">
                  <option>All Status</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-4 border border-border rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedTicket === ticket.id ? 'bg-accent border-primary' : ''
                  }`}
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{ticket.subject}</h4>
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Ticket ID:</span> {ticket.id}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {ticket.category}
                    </div>
                    <div>
                      <span className="font-medium">Last Update:</span> {ticket.lastUpdate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {selectedTicket && (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3>Ticket Details</h3>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Updates
                  </Button>
                </div>
                
                {(() => {
                  const ticket = tickets.find(t => t.id === selectedTicket);
                  if (!ticket) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Status:</span> {getStatusBadge(ticket.status)}
                        </div>
                        <div>
                          <span className="font-medium">Priority:</span> {getPriorityBadge(ticket.priority)}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {ticket.created}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {ticket.category}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{ticket.description}</p>
                      </div>
                      
                      <div className="border-t border-border pt-4">
                        <h4 className="font-medium mb-3">Add Response</h4>
                        <div className="space-y-3">
                          <Textarea placeholder="Type your response here..." rows={3} />
                          <Button>
                            <Send className="w-4 h-4 mr-2" />
                            Send Response
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="new-ticket" className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4">Submit New Support Ticket</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  placeholder="Brief description of your issue"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select 
                    id="category"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                  >
                    <option value="">Select category</option>
                    <option value="technical">Technical Support</option>
                    <option value="account">Account Issues</option>
                    <option value="application">Application Questions</option>
                    <option value="benefits">Benefits & Payments</option>
                    <option value="documents">Document Upload</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select 
                    id="priority"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  placeholder="Please provide detailed information about your issue..."
                  rows={5}
                />
              </div>
              
              <Button className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Submit Ticket
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Frequently Asked Questions</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="Search FAQs..." />
              </div>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{faq.question}</h4>
                    <Badge variant="outline">{faq.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">1-800-SUN-BUCKS</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri 8AM-6PM PST</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@sunbucks.ca.gov</p>
                    <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available 24/7</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="mb-4">Additional Resources</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-3" />
                  User Guide
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-3" />
                  Video Tutorials
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Community Forum
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}