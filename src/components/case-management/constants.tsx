export const CASE_DATA = [
  {
    id: 'CS-2024-001',
    name: 'Maria Garcia',
    status: 'approved',
    eligibility: 'Eligible - Direct Certification',
    created: '2024-01-10',
    lastModified: '2024-01-15',
    benefits: '$240',
    household: 3,
    documents: 2
  },
  {
    id: 'CS-2024-002',
    name: 'John Smith',
    status: 'pending',
    eligibility: 'Under Review',
    created: '2024-01-12',
    lastModified: '2024-01-15',
    benefits: 'Pending',
    household: 2,
    documents: 1
  },
  {
    id: 'CS-2024-003',
    name: 'Lisa Johnson',
    status: 'review',
    eligibility: 'Manual Review Required',
    created: '2024-01-08',
    lastModified: '2024-01-14',
    benefits: 'Pending',
    household: 4,
    documents: 3
  },
];

export const STATUS_VARIANTS = {
  approved: 'default',
  pending: 'secondary',
  review: 'outline',
  rejected: 'destructive'
} as const;