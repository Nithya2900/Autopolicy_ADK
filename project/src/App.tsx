import React, { useState, useEffect } from 'react';
import { Shield, User, LogOut } from 'lucide-react';
import ClaimForm from './components/ClaimForm';
import ProcessingView from './components/ProcessingView';
import ResultsView from './components/ResultsView';
import AuthForm from './components/AuthForm';
import UserProfile from './components/UserProfile';
import { ClaimData, AgentResult, FinalDecision, ProcessingStage } from './types';
import { MockInsuranceAgents } from './mockAgents';
import { ClaimService } from './services/claimService';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import toast from 'react-hot-toast';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('idle');
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [finalDecision, setFinalDecision] = useState<FinalDecision | null>(null);
  const [currentAgent, setCurrentAgent] = useState<string>('');
  const [useBackend] = useState<boolean>(true);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const agents = new MockInsuranceAgents();
  const claimService = new ClaimService();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserEmail(user.email);
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
        setShowProfile(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const processClaimWithBackend = async (data: ClaimData) => {
    try {
      setCurrentAgent('Processing with Backend AI Agents...');
      
      const initialAgents: AgentResult[] = [
        { agentName: 'Intake Agent', status: 'processing' },
        { agentName: 'Document Verifier Agent', status: 'processing' },
        { agentName: 'Fraud Detection Agent', status: 'processing' },
        { agentName: 'Policy Matcher Agent', status: 'processing' },
        { agentName: 'Damage Estimator Agent', status: 'processing' },
      ];
      setAgentResults(initialAgents);

      const { decision, agentResults } = await claimService.processClaimWithBackend(data);
      
      setAgentResults(agentResults);
      setFinalDecision(decision);
      setCurrentAgent('');
      setStage('completed');
    } catch (error) {
      console.error('Backend processing failed, falling back to mock agents:', error);
      await processClaimAgents(data);
    }
  };

  const processClaimAgents = async (data: ClaimData) => {
    const agentPipeline = [
      { name: 'Intake Agent', processor: () => agents.intakeAgent(data) },
      { name: 'Document Verifier Agent', processor: () => agents.documentVerifierAgent(data) },
      { name: 'Fraud Detection Agent', processor: () => agents.fraudDetectionAgent(data) },
      { name: 'Policy Matcher Agent', processor: () => agents.policyMatcherAgent(data) },
      { name: 'Damage Estimator Agent', processor: () => agents.damageEstimatorAgent(data) }
    ];

    const initialAgents: AgentResult[] = agentPipeline.map(agent => ({
      agentName: agent.name,
      status: 'pending'
    }));
    setAgentResults(initialAgents);

    const results: AgentResult[] = [];

    for (let i = 0; i < agentPipeline.length; i++) {
      const agent = agentPipeline[i];
      setCurrentAgent(agent.name);
      
      setAgentResults(prev => prev.map(a => 
        a.agentName === agent.name 
          ? { ...a, status: 'processing' }
          : a
      ));

      try {
        const result = await agent.processor();
        results.push(result);
        
        setAgentResults(prev => prev.map(a => 
          a.agentName === agent.name 
            ? result
            : a
        ));
      } catch (error) {
        const failedResult: AgentResult = {
          agentName: agent.name,
          status: 'failed',
          message: 'Processing failed'
        };
        results.push(failedResult);
        
        setAgentResults(prev => prev.map(a => 
          a.agentName === agent.name 
            ? failedResult
            : a
        ));
      }
    }

    setCurrentAgent('Decision Summarizer Agent');
    
    const decision = await agents.decisionSummarizerAgent(results);
    setFinalDecision(decision);
    setCurrentAgent('');
    setStage('completed');
  };

  const handleClaimSubmit = async (data: ClaimData) => {
    setClaimData(data);
    setStage('processing');
    
    if (useBackend) {
      await processClaimWithBackend(data);
    } else {
      await processClaimAgents(data);
    }
  };

  const handleNewClaim = () => {
    setStage('idle');
    setClaimData(null);
    setAgentResults([]);
    setFinalDecision(null);
    setCurrentAgent('');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setShowProfile(false);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-center" />
        <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />
      </>
    );
  }

  if (showProfile) {
    return (
      <>
        <Toaster position="top-center" />
        <UserProfile 
          onLogout={handleLogout}
          onBack={() => setShowProfile(false)}
        />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AutoPolicy</h1>
                  <p className="text-sm text-gray-600">AI-Powered Insurance Claim Evaluator</p>
                </div>
              </div>

              {/* Top-right Controls */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden sm:block">
                  {userEmail}
                </span>
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-rose-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-md"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {stage === 'idle' ? (
              <ClaimForm onSubmit={handleClaimSubmit} />
            ) : stage === 'processing' ? (
              <ProcessingView agents={agentResults} currentAgent={currentAgent} />
            ) : stage === 'completed' && finalDecision ? (
              <ResultsView decision={finalDecision} agentResults={agentResults} onNewClaim={handleNewClaim} />
            ) : null}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center text-gray-600">
              <p className="text-sm">
                © 2025 <strong>AutoPolicy</strong>. AI-powered insurance claim processing system.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;