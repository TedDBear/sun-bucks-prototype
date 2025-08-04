import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CaseListItem } from './case-management/CaseListItem';
import { CaseDetailsPanel } from './case-management/CaseDetailsPanel';
import { SearchAndFilters } from './case-management/SearchAndFilters';
import { PaginatedNavigation } from './PaginatedNavigation';

interface CaseManagementProps {
  onCaseSelect?: (caseId: string) => void;
}

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

export function CaseManagement({ onCaseSelect }: CaseManagementProps) {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [caseNotes, setCaseNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState('');
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [filteredCases, setFilteredCases] = useState<CaseItem[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 4;

  useEffect(() => {
    axios.get('/api/cases') // Replace with your real API endpoint
      .then(res => {
        setCases(res.data);
        setFilteredCases(res.data);
      })
      .catch(err => {
        console.error('Error fetching cases:', err);
      });
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    const filtered = cases.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.caseId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesEligibility = !eligibilityFilter || item.eligibilityReason === eligibilityFilter;
      return matchesSearch && matchesStatus && matchesEligibility;
    });

    setFilteredCases(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, statusFilter, eligibilityFilter, cases]);

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (e.key === 'ArrowLeft' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [currentPage, totalPages]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Case Management</h1>
          <p className="text-muted-foreground">Search, filter and manage SUN Bucks cases</p>
        </div>
        <Button>New Case</Button>
      </div>

      <SearchAndFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        eligibilityFilter={eligibilityFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onEligibilityChange={setEligibilityFilter}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="xl:col-span-2">
          <Card className="p-6">
            <div className="space-y-4">
              {currentCases.map((case_item) => (
                <CaseListItem
                  key={case_item.caseId}
                  case_item={case_item}
                  isSelected={selectedCase === case_item.caseId}
                  onSelect={setSelectedCase}
                  onCaseSelect={onCaseSelect}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <PaginatedNavigation
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Card>
        </div>

        {/* Case Details Panel */}
        <div className="xl:col-span-1">
          <CaseDetailsPanel
            selectedCase={selectedCase}
            caseNotes={caseNotes}
            setCaseNotes={setCaseNotes}
          />
        </div>
      </div>
    </div>
  );
}
