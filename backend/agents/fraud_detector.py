from google.adk.agents import BaseAgent

class FraudDetectionAgent(BaseAgent):
    def run(self, claim_data):
        score = 0
        try:
            prev_claims = int(claim_data.get("Previous Claims", 0))
            if prev_claims >= 3:
                score += 0.4
            elif prev_claims >= 1:
                score += 0.1
        except:
            pass

        try:
            amount_str = claim_data.get("Claim Amount", "₹0")
            amount = int(amount_str.replace("₹", "").replace(",", "").replace("$", "").strip())
            if amount >= 500000:
                score += 0.4
        except:
            pass

        docs = claim_data.get("Supporting Documents", "").lower()
        if docs in ["", "none", "no", "false"]:
            score += 0.3

        claim_data["fraud_score"] = min(score, 1.0)
        return claim_data
