'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, Cloud, Map, Newspaper, 
  Users, Phone, Database, Brain, AlertTriangle, 
  MapPin, Shield, Loader2, Activity, TrendingUp,
  Navigation, Home, Clock, Phone as PhoneIcon
} from 'lucide-react';
import Link from 'next/link';

interface AnalysisResult {
  is_emergency: boolean;
  severity?: string;
  assessment?: string;
  confidence?: number;
  reasoning?: string;
  evacuation_steps?: Array<{
    step: number;
    title: string;
    description: string;
    coordinates: { lat: number; lng: number };
    distance: string;
    time: string;
    warning: string;
  }>;
  safe_shelter?: {
    name: string;
    coordinates: { lat: number; lng: number };
    distance: string;
  };
  emergency_contacts?: Array<{
    service: string;
    number: string;
  }>;
  suggested_actions?: string[];
  data_sources?: Array<{
    source: string;
    query: string;
    response: string;
  }>;
}

const agentInfo = [
  { id: 'weather', icon: Cloud, name: 'Weather', color: 'from-blue-500 to-cyan-500' },
  { id: 'maps', icon: Map, name: 'Maps', color: 'from-green-500 to-emerald-500' },
  { id: 'news', icon: Newspaper, name: 'News', color: 'from-orange-500 to-red-500' },
  { id: 'social', icon: Users, name: 'Social', color: 'from-purple-500 to-pink-500' },
  { id: 'resource', icon: Phone, name: 'Resource', color: 'from-yellow-500 to-orange-500' },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentAgent, setCurrentAgent] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get query and location from sessionStorage
    const storedQuery = sessionStorage.getItem('emergencyQuery');
    const storedLocation = sessionStorage.getItem('emergencyLocation');

    if (!storedQuery || !storedLocation) {
      router.push('/');
      return;
    }

    setQuery(storedQuery);
    setLocation(storedLocation);

    // Simulate agent execution
    const agentInterval = setInterval(() => {
      setCurrentAgent((prev) => {
        if (prev < agentInfo.length - 1) {
          return prev + 1;
        } else {
          clearInterval(agentInterval);
          return prev;
        }
      });
    }, 800);

    // Call the backend API
    analyzeEmergency(storedQuery, storedLocation);

    return () => clearInterval(agentInterval);
  }, [router]);

  const analyzeEmergency = async (userQuery: string, userLocation: string) => {
    try {
      // Determine emergency type from query
      const emergencyType = detectEmergencyType(userQuery);

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: userQuery,
          location: userLocation,
          emergency_type: emergencyType,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      
      // Wait for all agents to finish animating
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, agentInfo.length * 800 + 1000);

    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to analyze situation. Please make sure the backend is running.');
      setLoading(false);
    }
  };

  const detectEmergencyType = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('fire') || lowerQuery.includes('smoke') || lowerQuery.includes('burn')) {
      return 'fire';
    } else if (lowerQuery.includes('hurricane') || lowerQuery.includes('storm') || lowerQuery.includes('wind')) {
      return 'hurricane';
    } else if (lowerQuery.includes('flood') || lowerQuery.includes('water') || lowerQuery.includes('rain')) {
      return 'flood';
    }
    return 'none';
  };

  const isEmergency = result?.is_emergency || false;
  const severityColor = isEmergency ? 'from-red-600 to-red-700' : 'from-nvidia-green to-green-400';
  const severityText = isEmergency ? 'URGENT' : 'CALM';
  const SeverityIcon = isEmergency ? AlertTriangle : CheckCircle;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-nvidia-gray to-black text-white">
      {/* Header */}
      <header className="border-b border-nvidia-green/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-5">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-semibold">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Query Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-nvidia-lightGray border border-nvidia-green/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-nvidia-green rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Analyzing Situation</h3>
                <p className="text-xl font-semibold text-white mb-2">{query}</p>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{location}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Agents Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Brain className="w-7 h-7 text-nvidia-green" />
            AI Agents Gathering Intelligence
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentInfo.map((agent, index) => {
              const Icon = agent.icon;
              const isActive = currentAgent >= index;
              const isComplete = loading ? currentAgent > index : true;

              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-gradient-to-br from-nvidia-lightGray to-nvidia-gray border rounded-xl p-6 transition-all duration-500 ${
                    isActive ? 'border-nvidia-green/60 shadow-lg shadow-nvidia-green/20' : 'border-nvidia-green/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {isComplete ? (
                      <CheckCircle className="w-6 h-6 text-nvidia-green" />
                    ) : isActive ? (
                      <Loader2 className="w-6 h-6 text-nvidia-green animate-spin" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-600" />
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-white mb-1">{agent.name} Agent</h3>
                  <p className="text-sm text-gray-400">
                    {isComplete ? 'Data collected' : isActive ? 'Analyzing...' : 'Waiting'}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* LLM Processing */}
        {currentAgent === agentInfo.length - 1 && loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-nvidia-green/10 to-green-400/10 border border-nvidia-green/30 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <Loader2 className="w-8 h-8 text-nvidia-green animate-spin" />
                <div>
                  <h3 className="text-xl font-bold text-white">NVIDIA AI Processing</h3>
                  <p className="text-gray-400">Analyzing all data sources and generating response...</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/20 border border-red-500/50 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-500 mb-2">Analysis Failed</h3>
                <p className="text-gray-300">{error}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Make sure the backend is running: <code className="bg-black/30 px-2 py-1 rounded">cd backend && ./start.ps1</code>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Severity Banner */}
              <div className={`bg-gradient-to-r ${severityColor} rounded-2xl p-8 shadow-2xl`}>
                <div className="flex items-center gap-4 mb-4">
                  <SeverityIcon className="w-12 h-12 text-white" />
                  <div>
                    <div className="text-sm font-medium text-white/80 mb-1">Assessment Result</div>
                    <h2 className="text-4xl font-black text-white">{severityText}</h2>
                  </div>
                </div>
                <p className="text-xl text-white/90 leading-relaxed">
                  {result.assessment || result.reasoning}
                </p>
                {result.confidence && (
                  <div className="mt-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-white/80" />
                    <span className="text-white/80">Confidence: {(result.confidence * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>

              {/* Evacuation Steps (for emergencies) */}
              {isEmergency && result.evacuation_steps && (
                <div className="bg-nvidia-lightGray border border-red-500/30 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Navigation className="w-7 h-7 text-red-500" />
                    Evacuation Plan
                  </h3>
                  <div className="space-y-4">
                    {result.evacuation_steps.map((step) => (
                      <div
                        key={step.step}
                        className="bg-nvidia-gray border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-lg mb-2">{step.title}</h4>
                            <p className="text-gray-300 mb-3">{step.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span>{step.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span>{step.distance}</span>
                              </div>
                            </div>
                            {step.warning && (
                              <div className="mt-3 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                                <p className="text-sm text-red-400 flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                  <span>{step.warning}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Safe Shelter */}
                  {result.safe_shelter && (
                    <div className="mt-6 bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <Home className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-white mb-2">Safe Shelter Location</h4>
                          <p className="text-gray-300 mb-2">{result.safe_shelter.name}</p>
                          <p className="text-sm text-gray-400">Distance: {result.safe_shelter.distance}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Suggested Actions (for false alarms) */}
              {!isEmergency && result.suggested_actions && (
                <div className="bg-nvidia-lightGray border border-nvidia-green/30 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Shield className="w-7 h-7 text-nvidia-green" />
                    Recommended Actions
                  </h3>
                  <ul className="space-y-3">
                    {result.suggested_actions.map((action, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-nvidia-green flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Emergency Contacts */}
              {result.emergency_contacts && result.emergency_contacts.length > 0 && (
                <div className="bg-nvidia-lightGray border border-nvidia-green/30 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <PhoneIcon className="w-7 h-7 text-nvidia-green" />
                    Emergency Contacts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.emergency_contacts.map((contact, index) => (
                      <div key={index} className="bg-nvidia-gray border border-nvidia-green/20 rounded-xl p-4">
                        <div className="font-semibold text-white mb-1">{contact.service}</div>
                        <div className="text-nvidia-green text-lg font-mono">{contact.number}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
