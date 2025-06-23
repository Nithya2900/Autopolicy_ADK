from google.adk.agents import BaseAgent

class DamageEstimatorAgent(BaseAgent):
    def run(self, claim_data):
        try:
            print(f"[DamageEstimatorAgent] 🔍 Received claim_data: {claim_data}")  # ✅ Debug log

            # Fallback to flat structure if needed
            details = claim_data.get("claim_details", claim_data)
            amount_str = details.get("Claim Amount", "₹0")

            amount = float(
                amount_str
                .replace("₹", "")
                .replace(",", "")
                .replace("$", "")
                .strip()
            )

            claim_data["estimated_damage"] = amount
            claim_data["estimated_payout"] = amount * 0.9
            claim_data["damage_summary"] = f"Estimated damage: ₹{amount:,.0f}"

        except Exception as e:
            print(f"[DamageEstimator Error] ⚠️ {e}")
            claim_data["estimated_damage"] = 0
            claim_data["estimated_payout"] = 0
            claim_data["damage_summary"] = "Unable to estimate damage."

        return claim_data
