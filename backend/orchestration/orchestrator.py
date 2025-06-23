
from agents.intake_agent import IntakeAgent
from agents.document_verifier import DocumentVerifierAgent
from agents.fraud_detector import FraudDetectionAgent
from agents.policy_matcher import PolicyMatcherAgent
from agents.damage_estimator import DamageEstimatorAgent
from agents.decision_summarizer import DecisionSummarizerAgent

def run_pipeline(user_input):
    intake = IntakeAgent(name="Intake_Agent")
    doc_verify = DocumentVerifierAgent(name="Document_Verifier_Agent")
    fraud = FraudDetectionAgent(name="Fraud_Detection_Agent")
    policy = PolicyMatcherAgent(name="Policy_Matcher_Agent")
    damage = DamageEstimatorAgent(name="Damage_Estimator_Agent")
    decision = DecisionSummarizerAgent(name="Decision_Summarizer_Agent")

    data = intake.run(user_input)
    data = doc_verify.run(data)
    data = fraud.run(data)
    data = policy.run(data)
    data = damage.run(data)
    result = decision.run(data)

    return result
