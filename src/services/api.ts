// API service for React frontend
const API_BASE_URL = 'http://localhost:5000/api';

export interface EligibilityRecord {
  EligibilityID: number;
  ParticipantID: number;
  IssuanceType: string;
  IssuanceAmount: number;
  IssuanceDate: string;
  ApprovalStatus: string;
  HouseholdID: number;
  HouseholdName?: string;
  Address?: string;
}

export interface User {
  UserID: number;
  Username: string;
  Email: string;
  RoleID: number;
  RoleName?: string;
}

class ApiService {
  // Authentication
  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  }

  // Eligibility Records
  async getEligibilityRecords(): Promise<EligibilityRecord[]> {
    const response = await fetch(`${API_BASE_URL}/eligibility`);
    return response.json();
  }

  async createEligibilityRecord(record: Partial<EligibilityRecord>) {
    const response = await fetch(`${API_BASE_URL}/eligibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });
    return response.json();
  }

  // Users
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  }

  // Reports
  async getSummaryReport() {
    const response = await fetch(`${API_BASE_URL}/reports/summary`);
    return response.json();
  }

  // Documents
  async getDocuments(eligibilityId: number) {
    const response = await fetch(`${API_BASE_URL}/documents/${eligibilityId}`);
    return response.json();
  }

  // Households
  async getHouseholds() {
    const response = await fetch(`${API_BASE_URL}/households`);
    return response.json();
  }

  async createHousehold(household: { householdName: string; address: string }) {
    const response = await fetch(`${API_BASE_URL}/households`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(household),
    });
    return response.json();
  }
}

export const apiService = new ApiService();
