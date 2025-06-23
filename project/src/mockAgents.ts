import { ClaimData, AgentResult, FinalDecision } from './types';

// Simulate processing delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockInsuranceAgents {
  private async processWithDelay(duration: number): Promise<void> {
    await delay(duration);
  }

  async intakeAgent(claimData: ClaimData): Promise<AgentResult> {
    await this.processWithDelay(1500);
    
    const missingFields = [];
    if (!claimData.policyNumber) missingFields.push('Policy Number');
    if (!claimData.claimantName) missingFields.push('Claimant Name');
    if (!claimData.incidentDate) missingFields.push('Incident Date');
    
    return {
      agentName: 'Intake Agent',
      status: 'completed',
      result: {
        structured: true,
        missingFields,
        completeness: Math.max(0, 100 - (missingFields.length * 10))
      },
      message: missingFields.length > 0 
        ? `Missing required fields: ${missingFields.join(', ')}`
        : 'All required information captured successfully',
      score: Math.max(0, 100 - (missingFields.length * 10))
    };
  }

  async documentVerifierAgent(claimData: ClaimData): Promise<AgentResult> {
    await this.processWithDelay(2000);
    
    const documentScore = claimData.hasDocuments ? 
      (claimData.documentTypes.length * 20) : 0;
    
    const verificationScore = Math.min(100, documentScore + 
      (claimData.policeReportFiled ? 30 : 0) + 
      (claimData.witnessesPresent ? 20 : 0));

    return {
      agentName: 'Document Verifier Agent',
      status: 'completed',
      result: {
        documentsPresent: claimData.hasDocuments,
        documentTypes: claimData.documentTypes,
        verificationScore
      },
      score: verificationScore,
      message: verificationScore > 70 
        ? 'Strong document verification'
        : verificationScore > 40 
        ? 'Moderate document verification'
        : 'Insufficient documentation'
    };
  }

  async fraudDetectionAgent(claimData: ClaimData): Promise<AgentResult> {
    await this.processWithDelay(2500);
    
    let riskScore = 0;
    const riskFactors = [];
    
    // Check for high damage amount (matches backend logic)
    if (claimData.estimatedDamage >= 500000) {
      riskScore += 40;
      riskFactors.push('High damage amount (≥₹500,000)');
    }
    
    // Check for multiple previous claims (matches backend logic)
    if (claimData.previousClaims >= 3) {
      riskScore += 40;
      riskFactors.push('Multiple previous claims (≥3)');
    }
    
    // Check for lack of documentation (matches backend logic)
    if (!claimData.hasDocuments || claimData.documentTypes.length === 0) {
      riskScore += 30;
      riskFactors.push('Insufficient documentation');
    }
    
    // Additional frontend-specific checks
    const incidentDate = new Date(claimData.incidentDate);
    if (incidentDate.getDay() === 0 || incidentDate.getDay() === 6) {
      riskScore += 10;
      riskFactors.push('Weekend incident');
    }
    
    if (claimData.estimatedDamage % 1000 === 0) {
      riskScore += 5;
      riskFactors.push('Round damage estimate');
    }

    riskScore = Math.min(100, riskScore);

    return {
      agentName: 'Fraud Detection Agent',
      status: 'completed',
      result: {
        riskScore,
        riskFactors,
        riskLevel: riskScore > 60 ? 'HIGH' : riskScore > 30 ? 'MEDIUM' : 'LOW'
      },
      score: riskScore,
      message: `Fraud risk: ${riskScore > 60 ? 'HIGH' : riskScore > 30 ? 'MEDIUM' : 'LOW'} (${riskScore}% risk score)`
    };
  }

  async policyMatcherAgent(claimData: ClaimData): Promise<AgentResult> {
    await this.processWithDelay(1800);
    
    // Simulate policy validation (matches backend logic)
    const mockPolicyStartDate = new Date('2023-01-01');
    const mockPolicyEndDate = new Date('2024-12-31');
    const incidentDate = new Date(claimData.incidentDate);
    
    const isValidPolicy = incidentDate >= mockPolicyStartDate && incidentDate <= mockPolicyEndDate;
    const coverage = {
      collision: true,
      comprehensive: true,
      liability: true,
      deductible: 500
    };

    return {
      agentName: 'Policy Matcher Agent',
      status: 'completed',
      result: {
        policyValid: isValidPolicy,
        coverage,
        policyPeriod: {
          start: mockPolicyStartDate.toISOString().split('T')[0],
          end: mockPolicyEndDate.toISOString().split('T')[0]
        }
      },
      score: isValidPolicy ? 100 : 0,
      message: isValidPolicy 
        ? 'Policy is active and covers the incident date'
        : 'Policy was not active on the incident date'
    };
  }

  async damageEstimatorAgent(claimData: ClaimData): Promise<AgentResult> {
    await this.processWithDelay(3000);
    
    // Use the claim amount directly (matches backend logic)
    const estimatedDamage = claimData.estimatedDamage;
    
    // Simulate some processing
    const vehicleAge = new Date().getFullYear() - parseInt(claimData.vehicleYear || '2020');
    let adjustedEstimate = estimatedDamage;
    
    if (vehicleAge > 10) {
      adjustedEstimate *= 0.9; // Slight adjustment for older vehicles
    }
    
    const laborCost = adjustedEstimate * 0.4;
    const partsCost = adjustedEstimate * 0.6;

    return {
      agentName: 'Damage Estimator Agent',
      status: 'completed',
      result: {
        originalEstimate: estimatedDamage,
        adjustedEstimate: Math.round(adjustedEstimate),
        breakdown: {
          labor: Math.round(laborCost),
          parts: Math.round(partsCost)
        },
        vehicleAge,
        repairability: vehicleAge > 15 ? 'CHALLENGING' : 'STANDARD'
      },
      score: 90,
      message: `Estimated repair cost: ₹${Math.round(adjustedEstimate).toLocaleString()}`
    };
  }

  async decisionSummarizerAgent(agentResults: AgentResult[]): Promise<FinalDecision> {
    await this.processWithDelay(2000);
    
    const fraudResult = agentResults.find(r => r.agentName === 'Fraud Detection Agent');
    const policyResult = agentResults.find(r => r.agentName === 'Policy Matcher Agent');
    const damageResult = agentResults.find(r => r.agentName === 'Damage Estimator Agent');
    const docResult = agentResults.find(r => r.agentName === 'Document Verifier Agent');
    
    const fraudScore = fraudResult?.score || 0;
    const policyValid = policyResult?.result?.policyValid || false;
    const estimatedPayout = damageResult?.result?.adjustedEstimate || 0;
    const documentScore = docResult?.score || 0;
    
    // Decision logic (matches backend logic)
    let approved = true;
    let reason = 'Claim approved based on comprehensive evaluation';
    const conditions: string[] = [];
    const nextSteps: string[] = [];
    
    // Backend logic: approved if fraud_score < 0.5 (50%) AND policy_matched
    if (!policyValid) {
      approved = false;
      reason = 'Policy was not active on the incident date';
    } else if (fraudScore >= 50) {
      approved = false;
      reason = 'High fraud risk detected - requires manual investigation';
    } else if (fraudScore > 30) {
      conditions.push('Additional documentation required');
      conditions.push('Subject to further verification');
    }
    
    if (documentScore < 50 && approved) {
      conditions.push('Must provide additional supporting documents');
    }
    
    if (approved) {
      nextSteps.push('Schedule vehicle inspection within 5 business days');
      nextSteps.push('Contact approved repair facilities');
      nextSteps.push('Upload final repair estimates for approval');
    } else {
      nextSteps.push('Contact claims adjuster for manual review');
      nextSteps.push('Provide additional documentation if available');
    }

    return {
      approved,
      reason,
      fraudScore,
      policyValid,
      estimatedPayout: approved ? Math.max(0, estimatedPayout - 500) : 0, // Subtract deductible
      conditions: conditions.length > 0 ? conditions : undefined,
      nextSteps
    };
  }
}