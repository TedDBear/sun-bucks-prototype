import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import axios from 'axios';
import { 
  FileText,
  MessageSquare,
  Upload,
  Calendar
} from 'lucide-react';

interface CaseDetailsPanelProps {
  selectedCase: string | null;
  caseNotes: string;
  setCaseNotes: (notes: string) => void;
}

export function CaseDetailsPanel({ selectedCase, caseNotes, setCaseNotes }: CaseDetailsPanelProps) {
  if (!selectedCase) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Select a case to view details</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 sticky top-6">
      <h3 className="mb-4">Case Details</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Case Notes</label>
          <Textarea 
            placeholder="Add notes about this case..." 
            className="mt-1"
            rows={3}
            value={caseNotes}
            onChange={(e) => setCaseNotes(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <Button className="w-full" onClick={async (event) => {
              event.preventDefault();
              try {
                await axios.post('/api/notes', {
                  caseId: selectedCase,
                  notes: caseNotes
                });
                setCaseNotes('');
              } catch (error) {
                console.error('Failed to send case notes:', error);
                // Optionally show a toast or error message to the user
              }
            }}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Add Note
          </Button>
          <Button variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
          <Button variant="outline" className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Task
          </Button>
        </div>

        {/* Recent Activity */}
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p>Benefits approved and issued</p>
                <p className="text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p>Documents reviewed</p>
                <p className="text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p>Case created</p>
                <p className="text-muted-foreground">5 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}