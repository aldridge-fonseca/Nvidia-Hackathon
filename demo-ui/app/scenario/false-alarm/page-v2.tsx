'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, Cloud, Map, Newspaper, 
  Users, Phone, FileText, Activity,
  MapPin, Shield, Lightbulb, ChevronRight, MessageSquare, Brain
} from 'lucide-react';

// Hardcoded mock data for false alarm scenario
const MOCK_DATA = {
  finalPlan: `**No Emergency Detected - You're Safe**

The smoke you're seeing is from a **permitted BBQ event** at the student union. All systems confirm normal campus operations.

**Verified Data:**
✓ Campus Safety: No alerts active
✓ Fire Department: No incidents reported  
✓ Air Quality: Excellent (AQI 42)
✓ Social Media: Students posting about BBQ event

**You Can:**
• Continue your normal activities
• Call Campus Safety at (408) 554-4444 if concerned
• Move to a different area if smoke bothers you`,
  
  agents: [
    {
      name: 'Weather Monitor',
      icon: 'Cloud',
      query: 'Fire weather conditions & air quality near SCU Library',
      status: 'complete' as const,
      data: 'Clear, 72°F, AQI 42 (Good) - No fire indicators',
    },
    {
      name: 'Traffic & Maps',
      icon: 'Map',
      query: 'Emergency vehicle activity & road closures near campus',
      status: 'complete' as const,
      data: 'Normal traffic - No emergency response detected',
    },
    {
      name: 'News Feed',
      icon: 'Newspaper',
      query: 'Fire incidents from Santa Clara Fire Department',
      status: 'complete' as const,
      data: 'No incidents at SCU - Fire Dept confirms safe',
    },
    {
      name: 'Social Pulse',
      icon: 'Users',
      query: 'Real-time reports from SCU students on social media',
      status: 'complete' as const,
      data: 'BBQ event posts - Zero emergency mentions',
    },
    {
      name: 'Emergency Services',
      icon: 'Phone',
      query: '911 logs & Campus Safety alerts for SCU',
      status: 'complete' as const,
      data: 'Normal operations - Permitted BBQ event confirmed',
    },
    {
      name: 'Knowledge Base',
      icon: 'FileText',
      query: 'Fire safety protocols & false alarm patterns',
      status: 'complete' as const,
      data: 'Matches cooking smoke false alarm protocol',
    },
  ],
};

interface MCPStatus {
  name: string;
  icon: any;
  status: 'pending' | 'loading' | 'complete';
}

export default function FalseAlarmScenario() {
  const [stage, setStage] = useState<'input' | 'analysis' | 'complete'>('input');
  const [userInput, setUserInput] = useState("I think there's a fire near the SCU library! I can see some smoke and people seem worried.");
  const [showSafetyOptions, setShowSafetyOptions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const iconMap: { [key: string]: any } = {
    Cloud,
    Map,
    Newspaper,
    Users,
    Phone,
    FileText,
  };

  const mcpAgents: MCPStatus[] = MOCK_DATA.agents.map(agent => ({
    name: agent.name,
    icon: iconMap[agent.icon] || Cloud,
    status: 'pending' as const,
  }));

  const [agents, setAgents] = useState(mcpAgents);

  const startDemo = () => {
    setStage('analysis');
    runAnalysisSequence();
  };

  const runAnalysisSequence = () => {
    agents.forEach((agent, idx) => {
      setTimeout(() => {
        setAgents(prev => prev.map((a, i) => 
          i === idx ? { ...a, status: 'loading' as const } : a
        ));
        
        setTimeout(() => {
          setAgents(prev => prev.map((a, i) => 
            i === idx ? { ...a, status: 'complete' as const } : a
          ));
          
          if (idx === agents.length - 1) {
            setTimeout(() => setStage('complete'), 1000);
          }
        }, 1500);
      }, idx * 1800);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nvidia-darkGray via-black to-nvidia-gray text-white">
      {/* Header */}
      <div className="border-b border-nvidia-green/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-nvidia-green transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Scenarios</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Non-Emergency Demo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Input Stage */}
        {stage === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Status Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-900/40 to-nvidia-lightGray rounded-2xl p-6 border-2 border-green-500/50">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-7 h-7 text-green-400" />
                  <div className="text-sm text-gray-400">Threat Level</div>
                </div>
                <div className="text-5xl font-bold text-green-400 mb-1">LOW</div>
                <div className="text-xs text-gray-500">Analysis ready</div>
              </div>
              
              <div className="bg-nvidia-lightGray rounded-2xl p-6 border-2 border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-7 h-7 text-nvidia-green" />
                  <div className="text-sm text-gray-400">Location</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">SCU Library</div>
                <div className="text-xs text-gray-500">Santa Clara University</div>
              </div>
              
              <div className="bg-nvidia-lightGray rounded-2xl p-6 border-2 border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-7 h-7 text-nvidia-green" />
                  <div className="text-sm text-gray-400">AI Systems</div>
                </div>
                <div className="text-5xl font-bold text-nvidia-green mb-1">6</div>
                <div className="text-xs text-gray-500">Ready to deploy</div>
              </div>
            </div>

            {/* Quick Scenarios - Large & Prominent */}
            <div className="bg-gradient-to-br from-nvidia-lightGray to-nvidia-gray rounded-3xl p-10 border-2 border-nvidia-green/30">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-8 h-8 text-nvidia-green" />
                <h3 className="text-3xl font-bold text-white">Quick Emergency Scenarios</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <button
                  onClick={() => setUserInput("I think there's a fire near the SCU library! I can see some smoke and people seem worried.")}
                  className="group relative bg-gradient-to-br from-orange-900/30 to-black/50 hover:from-orange-900/50 hover:to-black/70 border-2 border-orange-500/30 hover:border-orange-500 rounded-3xl p-8 text-left transition-all overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-6xl mb-4">🔥</div>
                    <div className="font-bold text-white text-2xl mb-3">Fire nearby</div>
                    <div className="text-sm text-gray-400">Smoke and flames observed</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/0 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                <button
                  onClick={() => setUserInput("There's strange smoke coming from the library area. Not sure if it's dangerous.")}
                  className="group relative bg-gradient-to-br from-gray-700/30 to-black/50 hover:from-gray-700/50 hover:to-black/70 border-2 border-gray-500/30 hover:border-gray-400 rounded-3xl p-8 text-left transition-all overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-6xl mb-4">💨</div>
                    <div className="font-bold text-white text-2xl mb-3">Strange smoke</div>
                    <div className="text-sm text-gray-400">Unusual odor or haze</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-400/0 to-gray-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                <button
                  onClick={() => setUserInput("Hearing loud sirens and seeing emergency lights near campus. Should I be concerned?")}
                  className="group relative bg-gradient-to-br from-red-900/30 to-black/50 hover:from-red-900/50 hover:to-black/70 border-2 border-red-500/30 hover:border-red-500 rounded-3xl p-8 text-left transition-all overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-6xl mb-4">🚨</div>
                    <div className="font-bold text-white text-2xl mb-3">Emergency alert</div>
                    <div className="text-sm text-gray-400">Sirens and lights detected</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-red-500/0 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>

              {/* Situation Input */}
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400 mb-3 block font-semibold">Or describe your situation:</label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Describe what you're seeing, hearing, or experiencing... Be as detailed as possible."
                    className="w-full bg-black/50 border-2 border-gray-700 focus:border-nvidia-green rounded-2xl p-5 text-white text-lg placeholder-gray-600 min-h-[140px] resize-none focus:outline-none transition-colors"
                  />
                </div>
                
                <button
                  onClick={startDemo}
                  disabled={!userInput.trim()}
                  className="w-full bg-gradient-to-r from-nvidia-green to-nvidia-darkGreen hover:from-nvidia-darkGreen hover:to-nvidia-green disabled:from-gray-700 disabled:to-gray-800 text-black disabled:text-gray-500 font-bold py-6 px-8 rounded-2xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3 text-xl shadow-2xl shadow-nvidia-green/40 disabled:shadow-none group"
                >
                  <Activity className="w-7 h-7 group-hover:animate-pulse" />
                  Analyze Situation with AI
                  <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Secure • Confidential • Real-time Analysis</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analysis Stage - Chat Style */}
        {(stage === 'analysis' || stage === 'complete') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Data Sources - Chat Style */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-6 h-6 text-nvidia-green" />
                <h3 className="text-xl font-bold text-white">Real-Time Intelligence</h3>
                <span className="text-sm text-gray-500 ml-2">(6 Data Sources)</span>
              </div>

              {agents.map((agent, idx) => {
                const Icon = agent.icon;
                const mockAgent = MOCK_DATA.agents.find(a => a.name === agent.name);
                
                return (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className={`bg-nvidia-lightGray rounded-xl p-5 border transition-all ${
                      agent.status === 'loading' 
                        ? 'border-nvidia-green shadow-lg shadow-nvidia-green/20' 
                        : agent.status === 'complete'
                        ? 'border-green-500/30'
                        : 'border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        agent.status === 'loading' ? 'bg-nvidia-green/20 animate-pulse' :
                        agent.status === 'complete' ? 'bg-green-500/10' : 'bg-gray-700/50'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          agent.status === 'loading' ? 'text-nvidia-green' :
                          agent.status === 'complete' ? 'text-green-400' : 'text-gray-500'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-white">{agent.name}</h4>
                          {agent.status === 'complete' && <CheckCircle className="w-4 h-4 text-green-400" />}
                        </div>
                        
                        {agent.status === 'complete' && mockAgent && (
                          <div className="space-y-2 mt-3">
                            <div className="text-xs text-gray-500 italic">
                              Query: "{mockAgent.query}"
                            </div>
                            <div className="text-sm text-gray-200 bg-black/40 rounded-lg p-3 border border-green-500/20">
                              <CheckCircle className="w-4 h-4 text-green-400 inline mr-2" />
                              {mockAgent.data}
                            </div>
                          </div>
                        )}
                        
                        {agent.status === 'loading' && (
                          <p className="text-sm text-gray-400">Analyzing data...</p>
                        )}
                        
                        {agent.status === 'pending' && (
                          <p className="text-sm text-gray-500">Waiting...</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Final Assessment */}
            {stage === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 mt-8"
              >
                <div className="bg-gradient-to-br from-green-900/30 to-nvidia-lightGray rounded-2xl p-8 border-2 border-green-500/50">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                    <h3 className="text-3xl font-bold text-green-400">All Clear - No Emergency</h3>
                  </div>
                  <div className="prose prose-invert prose-green max-w-none text-gray-300 space-y-3">
                    {MOCK_DATA.finalPlan.split('\n').map((line, idx) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <h3 key={idx} className="text-xl font-bold text-white mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
                      } else if (line.startsWith('✓')) {
                        return <div key={idx} className="flex items-start gap-2 my-2"><CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" /><span className="text-base">{line.substring(2)}</span></div>;
                      } else if (line.startsWith('•')) {
                        return <div key={idx} className="flex items-start gap-2 my-1 ml-4"><span className="text-nvidia-green">•</span><span className="text-base">{line.substring(2)}</span></div>;
                      } else if (line.trim() === '') {
                        return <div key={idx} className="h-2"></div>;
                      } else {
                        return <p key={idx} className="text-gray-300 leading-relaxed text-base my-2">{line}</p>;
                      }
                    })}
                  </div>
                </div>

                {/* Next Steps - Compact */}
                <div className="bg-nvidia-lightGray rounded-2xl p-6 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-nvidia-green" />
                    <h4 className="text-lg font-bold text-nvidia-green">Suggested Next Steps</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedSuggestion('verify')}
                      className={`p-3 rounded-lg border transition-all text-left text-sm ${
                        selectedSuggestion === 'verify' 
                          ? 'bg-green-900/30 border-green-500' 
                          : 'bg-black/30 border-gray-700 hover:border-green-500/50'
                      }`}
                    >
                      <Phone className="w-4 h-4 text-green-400 mb-1" />
                      <div className="font-semibold text-white">Verify with Campus Safety</div>
                    </button>
                    
                    <button
                      onClick={() => setSelectedSuggestion('continue')}
                      className={`p-3 rounded-lg border transition-all text-left text-sm ${
                        selectedSuggestion === 'continue' 
                          ? 'bg-green-900/30 border-green-500' 
                          : 'bg-black/30 border-gray-700 hover:border-green-500/50'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-green-400 mb-1" />
                      <div className="font-semibold text-white">Continue Activities</div>
                    </button>
                    
                    <button
                      onClick={() => setSelectedSuggestion('learn')}
                      className={`p-3 rounded-lg border transition-all text-left text-sm ${
                        selectedSuggestion === 'learn' 
                          ? 'bg-green-900/30 border-green-500' 
                          : 'bg-black/30 border-gray-700 hover:border-green-500/50'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-green-400 mb-1" />
                      <div className="font-semibold text-white">Review Procedures</div>
                    </button>
                    
                    <button
                      onClick={() => setShowSafetyOptions(!showSafetyOptions)}
                      className={`p-3 rounded-lg border transition-all text-left text-sm ${
                        showSafetyOptions 
                          ? 'bg-green-900/30 border-green-500' 
                          : 'bg-black/30 border-gray-700 hover:border-green-500/50'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-green-400 mb-1" />
                      <div className="font-semibold text-white">Still Feel Unsafe?</div>
                    </button>
                  </div>
                </div>

                {/* Safety Options */}
                <AnimatePresence>
                  {showSafetyOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gradient-to-br from-yellow-900/20 to-nvidia-lightGray rounded-xl p-6 border-2 border-yellow-500/50"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-xl font-bold text-yellow-400">Additional Safety Options</h3>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div className="flex gap-2 p-2 bg-black/30 rounded-lg border border-yellow-500/30">
                          <span className="text-yellow-400 font-bold">1.</span>
                          <span className="text-gray-300">Contact Campus Safety: (408) 554-4444</span>
                        </div>
                        <div className="flex gap-2 p-2 bg-black/30 rounded-lg border border-yellow-500/30">
                          <span className="text-yellow-400 font-bold">2.</span>
                          <span className="text-gray-300">Move to a well-populated area</span>
                        </div>
                        <div className="flex gap-2 p-2 bg-black/30 rounded-lg border border-yellow-500/30">
                          <span className="text-yellow-400 font-bold">3.</span>
                          <span className="text-gray-300">Request a Campus Safety escort</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
