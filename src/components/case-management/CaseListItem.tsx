import React from 'react';
import { Button } from '../ui/button';
import { Eye, Edit } from 'lucide-react';
import { getStatusBadge } from './helpers';

interface CaseItem {
  caseId: string;
  name: string;
  beneficiaryId: string;
  status: string;
  created: string;
  lastModified: string;
  eligibilityReason: string;
  notes: string;
  documents: number;
}

interface CaseListItemProps {
  case_item: CaseItem;
  isSelected: boolean;
  onSelect: (caseId: string) => void;
  onCaseSelect?: (caseId: string) => void;
}

export function CaseListItem({ case_item, isSelected, onSelect, onCaseSelect }: CaseListItemProps) {
  return (
    <div 
      className={`p-4 border border-border rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
        isSelected ? 'bg-accent border-primary' : ''
      }`}
      onClick={() => onSelect(case_item.caseId)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{case_item.name}</h4>
          {getStatusBadge(case_item.status)}
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onCaseSelect?.(case_item.caseId);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Case ID</p>
          <p>{case_item.caseId}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Benefits</p>
          <p>{case_item.eligibilityReason}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Household</p>
          <p>TedDBear</p>
        </div>
        
        <div>
          <p className="text-muted-foreground">Documents</p>
          <p>{case_item.documents} files</p>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
         Created {case_item.created} • Last modified {case_item.lastModified}
        </p>
      </div>
    </div>
  );
}