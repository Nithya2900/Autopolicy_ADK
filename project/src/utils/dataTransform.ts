import { ClaimData, BackendClaimData } from '../types';

function formatDateToYYYYMMDD(dateStr: string): string {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function transformToBackendFormat(claimData: ClaimData): string {
  const backendData: BackendClaimData = {
    "Policy Number": claimData.policyNumber,
    "Claimant Name": claimData.claimantName,
    "Phone Number": claimData.phoneNumber,
    "Email": claimData.email,
    "Incident Date": formatDateToYYYYMMDD(claimData.incidentDate),
    "Incident Time": claimData.incidentTime,
    "Location": claimData.location,
    "Description": claimData.description,
    "Vehicle Year": claimData.vehicleYear,
    "Vehicle Make": claimData.vehicleMake,
    "Vehicle Model": claimData.vehicleModel,
    "License Plate": claimData.licensePlate,
    "Claim Amount": `₹${claimData.estimatedDamage.toLocaleString()}`,
    "Supporting Documents": claimData.hasDocuments ? claimData.documentTypes.join(", ") : "none",
    "Police Report Filed": claimData.policeReportFiled ? "yes" : "no",
    "Witnesses Present": claimData.witnessesPresent ? "yes" : "no",
    "Previous Claims": claimData.previousClaims.toString(),
    "Policy Validity": `${formatDateToYYYYMMDD(claimData.policyStartDate)} to ${formatDateToYYYYMMDD(claimData.policyEndDate)}`
  };

  return Object.entries(backendData)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}
