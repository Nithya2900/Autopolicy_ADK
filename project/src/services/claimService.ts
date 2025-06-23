import { ClaimData, BackendResponse, FinalDecision, AgentResult } from '../types';
import { transformToBackendFormat } from '../utils/dataTransform';

const BACKEND_URL = 'http://localhost:8000';

export class ClaimService {
  async processClaimWithBackend(claimData: ClaimData): Promise<{
    decision: FinalDecision;
    agentResults: AgentResult[];
  }> {
    try {
      const backendPayload = transformToBackendFormat(claimData);
      console.log("📦 Payload:", backendPayload);


      
      const response = await fetch(`${BACKEND_URL}/process-claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload)
      });

      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.status}`);
      }

      const backendResult: BackendResponse = await response.json();
      
      // Transform backend response to frontend format
      const decision = this.transformBackendResponse(backendResult);
      const agentResults = this.createAgentResults(backendResult);

      return { decision, agentResults };
    } catch (error) {
      console.error('Backend processing failed:', error);
      throw error;
    }
  }

  private transformBackendResponse(backendResult: BackendResponse): FinalDecision {
    const approved = backendResult.decision === "Approved";
    const fraudScore = Math.round((backendResult.details.fraud_score || 0) * 100);
    const policyValid = backendResult.details.policy_matched || false;
    
    // Extract estimated damage amount
    const damageStr = backendResult.details.estimated_damage || "₹0";
    const estimatedPayout = this.parseAmount(damageStr);

    let reason = approved 
      ? "Claim approved based on comprehensive AI evaluation"
      : "Claim denied due to policy or fraud concerns";

    if (!policyValid) {
      reason = "Policy was not active on the incident date";
    } else if (fraudScore > 50) {
      reason = "High fraud risk detected - requires manual investigation";
    }

    const conditions: string[] = [];
    const nextSteps: string[] = [];

    if (approved) {
      if (fraudScore > 30) {
        conditions.push("Subject to additional verification");
      }
      if (!backendResult.details.documents_verified) {
        conditions.push("Must provide additional supporting documents");
      }
      
      nextSteps.push("Schedule vehicle inspection within 5 business days");
      nextSteps.push("Contact approved repair facilities");
      nextSteps.push("Upload final repair estimates for approval");
    } else {
      nextSteps.push("Contact claims adjuster for manual review");
      nextSteps.push("Provide additional documentation if available");
    }

    return {
      approved,
      reason,
      fraudScore,
      policyValid,
      estimatedPayout: approved ? Math.max(0, estimatedPayout - 500): estimatedPayout,
      conditions: conditions.length > 0 ? conditions : undefined,
      nextSteps
    };
  }

  private createAgentResults(backendResult: BackendResponse): AgentResult[] {
    const details = backendResult.details;
    const fraudScore = Math.round((details.fraud_score || 0) * 100);
    
    return [
      {
        agentName: 'Intake Agent',
        status: 'completed',
        message: 'Successfully parsed and structured claim data',
        score: 100
      },
      {
        agentName: 'Document Verifier Agent',
        status: 'completed',
        message: details.documents_verified 
          ? 'Documents verified successfully' 
          : 'Insufficient documentation provided',
        score: details.documents_verified ? 85 : 30
      },
      {
        agentName: 'Fraud Detection Agent',
        status: 'completed',
        message: `Fraud risk: ${fraudScore > 60 ? 'HIGH' : fraudScore > 30 ? 'MEDIUM' : 'LOW'} (${fraudScore}% risk score)`,
        score: fraudScore
      },
      {
        agentName: 'Policy Matcher Agent',
        status: 'completed',
        message: details.policy_matched 
          ? 'Policy is active and covers the incident date'
          : 'Policy was not active on the incident date',
        score: details.policy_matched ? 100 : 0
      },
      {
      agentName: 'Damage Estimator Agent',
      status: 'completed',
      message: details.damage_summary || `Estimated damage: ₹${details.estimated_damage || 0}`,
      score: 90
    }
    ];
  }

  private parseAmount(amountStr: string): number {
    return parseInt(amountStr.replace(/[₹$,]/g, '').trim()) || 0;
  }
}