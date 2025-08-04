import React from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Filter, Download } from 'lucide-react';

interface SearchAndFiltersProps {
  searchQuery: string;
  statusFilter: string;
  eligibilityFilter: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onEligibilityChange: (eligibility: string) => void;
}

export function SearchAndFilters({
  searchQuery,
  statusFilter,
  eligibilityFilter,
  onSearchChange,
  onStatusChange,
  onEligibilityChange
}: Readonly<SearchAndFiltersProps>) {
  return (
    <Card className="p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search by case ID, name, or household ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-border rounded-md bg-background"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="eligible">Eligible</option>
            <option value="pending">Pending</option>
            <option value="under review">Under Review</option>
            <option value="ineligible">Ineligible</option>
          </select>
          <select
            className="px-3 py-2 border border-border rounded-md bg-background"
            value={eligibilityFilter}
            onChange={(e) => onEligibilityChange(e.target.value)}
          >
            <option value="">All Reasons</option>
            <option value="Free">Free Lunch</option>
            <option value="Reduced">Reduced Lunch</option>
            <option value="SNAP">SNAP</option>
            <option value="Medicaid">Medicaid</option>
            <option value="Housing Assistance">Housing Assistance</option>
            <option value="Unemployment Assistance">Unemployment Assistance</option>
            <option value="Child Care Subsidy">Child Care Subsidy</option>
            <option value="Transportation">Transportation</option>
            <option value="None">None</option>
            
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </Card>
  );
}