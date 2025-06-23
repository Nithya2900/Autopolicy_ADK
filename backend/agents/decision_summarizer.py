from google.adk.agents import BaseAgent

class DecisionSummarizerAgent(BaseAgent):
    def run(self, claim_data):
        fraud_score = claim_data.get("fraud_score", 0)
        policy_matched = claim_data.get("policy_matched", False)

        approved = fraud_score < 0.5 and policy_matched
        decision = "Approved" if approved else "Rejected"

        # ✅ Flatten structure so frontend can directly access values
        return {
            "decision": decision,
            "summary": f"Claim for {claim_data.get('Claimant Name', 'Unknown')} has been {decision.lower()}.",
            "details": {
                **claim_data,
                "fraud_score": fraud_score,
                "policy_matched": policy_matched,
                "documents_verified": claim_data.get("documents_verified", False),
            }
        }
