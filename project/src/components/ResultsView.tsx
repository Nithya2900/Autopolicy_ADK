import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Shield, DollarSign, FileText, ArrowRight } from 'lucide-react';
import { FinalDecision, AgentResult } from '../types';

interface ResultsViewProps {
  decision: FinalDecision;
  agentResults: AgentResult[];
  onNewClaim: () => void;
}

export default function ResultsView({ decision, agentResults, onNewClaim }: ResultsViewProps) {
  const getDecisionIcon = () => {
    if (decision.approved) {
      return <CheckCircle className="w-8 h-8 text-emerald-600" />;
    } else {
      return <XCircle className="w-8 h-8 text-red-600" />;
    }
  };

  const getDecisionColor = () => {
    return decision.approved ? 'emerald' : 'red';
  };

  const getFraudRiskLevel = () => {
    if (decision.fraudScore >= 70) return { level: 'HIGH', color: 'red' };
    if (decision.fraudScore >= 40) return { level: 'MEDIUM', color: 'amber' };
    return { level: 'LOW', color: 'emerald' };
  };

  const fraudRisk = getFraudRiskLevel();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Decision Header */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200">
        <div className={`px-8 py-6 border-b ${decision.approved ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center space-x-4">
            {getDecisionIcon()}
            <div>
              <h1 className={`text-2xl font-bold ${decision.approved ? 'text-emerald-900' : 'text-red-900'}`}>
                Claim {decision.approved ? 'Approved' : 'Denied'}
              </h1>
              <p className={`${decision.approved ? 'text-emerald-700' : 'text-red-700'} mt-1`}>
                {decision.reason}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fraud Risk */}
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className={`w-6 h-6 text-${fraudRisk.color}-600`} />
                <h3 className="font-semibold text-slate-900">Fraud Risk</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Risk Level</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium bg-${fraudRisk.color}-100 text-${fraudRisk.color}-800`}>
                    {fraudRisk.level}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Score</span>
                  <span className="font-medium text-slate-900">{decision.fraudScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                  <div 
                    className={`h-2 rounded-full bg-${fraudRisk.color}-500`}
                    style={{ width: `${Math.min(100, decision.fraudScore)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Policy Status */}
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <FileText className={`w-6 h-6 ${decision.policyValid ? 'text-emerald-600' : 'text-red-600'}`} />
                <h3 className="font-semibold text-slate-900">Policy Status</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Validity</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    decision.policyValid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {decision.policyValid ? 'VALID' : 'INVALID'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Coverage</span>
                  <span className="font-medium text-slate-900">Active</span>
                </div>
              </div>
            </div>

            {/* Estimated Payout */}
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <DollarSign className={`w-6 h-6 text-blue-600`} />
                <h3 className="font-semibold text-slate-900">Estimated Payout</h3>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-slate-900">
                  ${decision.estimatedPayout.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">
                  {decision.approved ? 'After deductible' : 'Not applicable'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditions & Next Steps */}
      {(decision.conditions || decision.nextSteps.length > 0) && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="px-8 py-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Additional Information</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {decision.conditions && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-slate-900">Conditions</h3>
                  </div>
                  <ul className="space-y-2">
                    {decision.conditions.map((condition, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-slate-700">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Next Steps</h3>
                </div>
                <ul className="space-y-2">
                  {decision.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-slate-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Results Summary */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="px-8 py-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Evaluation Summary</h2>
          <p className="text-slate-600 mt-1">Detailed results from each AI agent</p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agentResults.map((agent) => (
              <div key={agent.agentName} className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{agent.agentName}</h3>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-sm text-slate-600 mb-3">{agent.message}</p>
                {agent.score !== undefined && (
                  <div>
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
                      <span>Score</span>
                      <span>{agent.score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          agent.score >= 70 ? 'bg-emerald-500' :
                          agent.score >= 40 ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, agent.score))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Claim Button */}
      <div className="flex justify-center">
        <button
          onClick={onNewClaim}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit New Claim
        </button>
      </div>
    </div>
  );
}