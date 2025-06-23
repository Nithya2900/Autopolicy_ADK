
from google.adk.agents import BaseAgent

class DocumentVerifierAgent(BaseAgent):
    def run(self, claim_data):
        details = claim_data.get("claim_details", {})
        docs = details.get("Supporting Documents", "").lower()
        claim_data["documents_verified"] = docs not in ["", "none", "no", "false"]
        return claim_data
