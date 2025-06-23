import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { AgentResult } from '../types';

interface ProcessingViewProps {
  agents: AgentResult[];
  currentAgent: string;
}

export default function ProcessingView({ agents, currentAgent }: ProcessingViewProps) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="px-8 py-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Processing Your Claim</h1>
          <p className="text-slate-600 mt-1">Our AI agents are evaluating your claim submission</p>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            {agents.map((agent, index) => (
              <div key={agent.agentName} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {agent.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  ) : agent.status === 'processing' ? (
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  ) : agent.status === 'failed' ? (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  ) : (
                    <Clock className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-medium ${
                      agent.status === 'completed' ? 'text-slate-900' :
                      agent.status === 'processing' ? 'text-blue-900' :
                      agent.status === 'failed' ? 'text-red-900' :
                      'text-slate-500'
                    }`}>
                      {agent.agentName}
                    </h3>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      agent.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      agent.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {agent.status === 'processing' ? 'Processing...' : 
                       agent.status === 'completed' ? 'Completed' :
                       agent.status === 'failed' ? 'Failed' : 'Pending'}
                    </span>
                  </div>
                  
                  {agent.message && (
                    <p className={`mt-2 text-sm ${
                      agent.status === 'completed' ? 'text-slate-600' :
                      agent.status === 'processing' ? 'text-blue-600' :
                      agent.status === 'failed' ? 'text-red-600' :
                      'text-slate-500'
                    }`}>
                      {agent.message}
                    </p>
                  )}
                  
                  {agent.score !== undefined && agent.status === 'completed' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
                        <span>Score</span>
                        <span>{agent.score}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
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
              </div>
            ))}
          </div>

          {currentAgent && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <p className="text-blue-900 font-medium">Currently processing: {currentAgent}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}