from google.adk.agents import BaseAgent
from datetime import datetime

class PolicyMatcherAgent(BaseAgent):

    def run(self, claim_data):
        print("\n[PolicyMatcherAgent] 🔍 Raw claim_data received:")
        for k, v in claim_data.items():
            print(f"  {k}: {v}")

        try:
            policy_validity = claim_data.get("Policy Validity", "").strip()
            incident_date_str = claim_data.get("Incident Date", "").strip()

            if not policy_validity or not incident_date_str:
                raise ValueError("Missing policy validity or incident date.")

            # Parse "YYYY-MM-DD to YYYY-MM-DD"
            start_str, end_str = [s.strip() for s in policy_validity.split("to")]
            start_date = datetime.strptime(start_str, "%Y-%m-%d")
            end_date = datetime.strptime(end_str, "%Y-%m-%d")
            incident_date = datetime.strptime(incident_date_str, "%Y-%m-%d")

            valid = start_date <= incident_date <= end_date

            if valid:
                print(f"[PolicyMatcherAgent ✅] Incident on {incident_date.date()} is within policy window.")
            else:
                print(f"[PolicyMatcherAgent ❌] Incident on {incident_date.date()} is outside the policy window.")
        except Exception as e:
            print(f"[PolicyMatcherAgent ❌ ERROR] {e}")
            valid = False

        claim_data["policy_matched"] = valid
        return claim_data
