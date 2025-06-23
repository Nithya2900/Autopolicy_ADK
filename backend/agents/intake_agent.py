from google.adk.agents import BaseAgent

class IntakeAgent(BaseAgent):
    def run(self, user_input):
        # If input is already structured JSON (from React frontend), return as-is
        if isinstance(user_input, dict):
            return user_input

        # Optional fallback: parse raw multiline string input (e.g., from CLI/testing)
        claim_data = {}
        for line in user_input.strip().split("\n"):
            if ":" in line:
                key, value = line.split(":", 1)
                claim_data[key.strip()] = value.strip()

        return claim_data
