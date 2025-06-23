export interface ClaimData {
  // Personal Information
  policyNumber: string;
  claimantName: string;
  phoneNumber: string;
  email: string;

  // Incident Details
  incidentDate: string;
  incidentTime: string;
  location: string;
  description: string;

  // Vehicle Information
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  licensePlate: string;

  // Claim Details
  estimatedDamage: number;
  hasDocuments: boolean;
  documentTypes: string[];
  uploadedDocuments?: UploadedDocument[];

  // Additional Info
  policeReportFiled: boolean;
  witnessesPresent: boolean;
  previousClaims: number;

  // ✅ New Fields for Policy Validity
  policyStartDate: string;
  policyEndDate: string;
}

export interface BackendClaimData {
  "Policy Number": string;
  "Claimant Name": string;
  "Phone Number": string;
  "Email": string;
  "Incident Date": string;
  "Incident Time": string;
  "Location": string;
  "Description": string;
  "Vehicle Year": string;
  "Vehicle Make": string;
  "Vehicle Model": string;
  "License Plate": string;
  "Claim Amount": string;
  "Supporting Documents": string;
  "Police Report Filed": string;
  "Witnesses Present": string;
  "Previous Claims": string;
  "Policy Validity": string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  category: string;
}

export interface AgentResult {
  agentName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  message?: string;
  score?: number;
}

export interface BackendResponse {
  decision: string;
  details: {
    claim_details: BackendClaimData;
    documents_verified: boolean;
    fraud_score: number;
    policy_matched: boolean;
    estimated_damage: string;
    damage_summary?:string;
  };
}

export interface FinalDecision {
  approved: boolean;
  reason: string;
  fraudScore: number;
  policyValid: boolean;
  estimatedPayout: number;
  conditions?: string[];
  nextSteps: string[];
}

export type ProcessingStage = 'idle' | 'processing' | 'completed';
