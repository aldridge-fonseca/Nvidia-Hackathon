'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, Cloud, Map, Newspaper, 
  Users, Phone, Database, Brain, FileText, AlertCircle, Check, Activity,
  MapPin, Shield, Lightbulb, ChevronRight, User, MessageSquare
} from 'lucide-react';

// Hardcoded mock data for false alarm scenario
const MOCK_DATA = {
  userQuery: "I think there's a fire near the SCU library! I can see some smoke and people seem worried.",
  
  routerPlan: {
    tasks: [
      { tool: "weather", query: "Santa Clara University current conditions" },
      { tool: "maps", query: "Santa Clara University evacuation routes" },
      { tool: "news", query: "Santa Clara fire incidents" },
      { tool: "social", query: "Santa Clara University emergency" },
      { tool: "resource", query: "Santa Clara emergency resources" },
      { tool: "nemo_retriever", query: "fire SOP Santa Clara University" }
    ]
  },
  
  mcpResults: {
    weather: {
      source: "OpenWeatherMap API",
      location: "Santa Clara University",
      temperature: "72°F (22°C)",
      condition: "Clear skies, excellent visibility",
      humidity: "45%",
      wind: "5 mph from west (gentle breeze)",
      alerts: "✓ No weather warnings or alerts active",
      airQuality: "Good (AQI 42)",
      notes: "Normal weather conditions. No fire-related environmental indicators detected."
    },
    maps: {
      source: "Maps Data — Santa Clara University",
      trafficConditions: "Normal flow on all major routes",
      blockedRoutes: [],
      emergencyVehicles: "No emergency vehicle activity detected near campus",
      campusStatus: "All gates and routes are open and accessible",
      notes: "No unusual traffic patterns or road closures that would indicate an emergency."
    },
    news: {
      source: "Local News Aggregator",
      recentIncidents: [],
      latestUpdate: "No emergency alerts or fire incidents reported in Santa Clara area in the last 24 hours",
      officialStatements: "Santa Clara Fire Department: No active incidents at SCU campus",
      notes: "Checked multiple news sources — no reports of fires or emergencies at or near Santa Clara University."
    },
    social: {
      source: "Social Media Monitor",
      sentiment: "Neutral — typical campus activity",
      trendingTopics: ["#SCUGames", "#StudySession", "#CampusLife"],
      emergencyMentions: 0,
      notes: "Social media shows normal campus activity. Some users mentioned controlled barbecue smoke from the student union patio event (permitted activity).",
      relatedPosts: [
        "BBQ event at student union is lit! 🔥😋 #SCU",
        "Great weather for studying outside today!"
      ]
    },
    resource: {
      source: "Campus Emergency Resources",
      campusSafetyStatus: "Normal operations",
      nearestShelter: "Not activated — no emergency shelters currently open",
      emergencyContacts: {
        campusSafety: "(408) 554-4444",
        santaClaraFire: "9-1-1"
      },
      notes: "Campus Safety confirms no active emergency. Student union has a permitted outdoor cooking event today."
    },
    nemo_retriever: {
      source: "Fire SOP Knowledge Base",
      relevantGuidelines: "In case of suspected fire: verify with Campus Safety before taking action. Common false alarms include: cooking smoke, fog machines at events, steam from facilities.",
      verificationSteps: [
        "Contact Campus Safety at (408) 554-4444 to verify",
        "Look for fire alarm activation (none reported)",
        "Check for emergency vehicle response (none present)"
      ]
    }
  },
  
  severity: "CALM",
  
  thoughtProcess: `1. Weather Analysis [Source: weather]: Current conditions show 72°F with clear skies and excellent visibility. AQI is good (42), with no smoke or fire-related air quality issues. Wind is light (5 mph gentle breeze). No Red Flag Warnings or fire weather alerts active. This strongly suggests no active fire.

2. Traffic & Infrastructure [Source: maps]: All routes around SCU campus are open with normal traffic flow. No emergency vehicle staging areas or road closures. No unusual patterns that would indicate emergency response activity.

3. Official News [Source: news]: Checked multiple local news sources and Santa Clara Fire Department statements — no reports of fires or emergencies at SCU in the last 24 hours. Fire Department explicitly states "No active incidents at SCU campus."

4. Social Media Intelligence [Source: social]: Social sentiment is neutral with typical campus activity hashtags. Zero emergency-related mentions. Some posts reference "BBQ at student union" and "smoke from patio event" — this appears to be permitted outdoor cooking, not a fire emergency.

5. Campus Resources [Source: resource]: Campus Safety confirms normal operations. No emergency shelters activated. They note there is a permitted student union outdoor cooking event today, which likely explains the smoke the user observed.

6. SOP Guidance [Source: nemo_retriever]: Fire SOP indicates common false alarms include cooking smoke and event-related smoke. Recommends verifying with Campus Safety before escalation.

Conclusion: All six data sources consistently indicate NO EMERGENCY. The smoke observed is from a permitted outdoor cooking event at the student union. People appearing "worried" is likely normal student behavior or unrelated to any emergency. Weather conditions, official statements, and social media all confirm safe, normal campus conditions.`,
  
  finalPlan: `**FALSE ALARM - You're Safe**

The smoke is from a **permitted BBQ event** at the student union. All systems confirm normal operations.

**Verified:**
• Fire Department: No incidents at SCU
• Campus Safety: Normal operations  
• Air Quality: Excellent (AQI 42)
• Social Media: Students posting about BBQ

**You Can:**
• Continue normal activities
• Call Campus Safety: (408) 554-4444
• Move to quieter area if smoke bothers you`,
  
  agents: [
    {
      name: 'Weather Monitor',
      icon: 'Cloud',
      query: 'Checking for fire weather conditions, smoke patterns, and air quality near Santa Clara University Library...',
      status: 'complete' as const,
      data: 'Clear skies, 72°F, excellent visibility - AQI 42 (Good) - No fire-related air quality issues',
    },
    {
      name: 'Traffic & Maps',
      icon: 'Map',
      query: 'Analyzing emergency vehicle activity, road closures, and crowd movement patterns near campus...',
      status: 'complete' as const,
      data: 'Normal flow on El Camino Real, Alviso St, Benton St - No emergency vehicles or road closures',
    },
    {
      name: 'News Feed',
      icon: 'Newspaper',
      query: 'Searching for fire incidents, emergency reports, and official statements from Santa Clara Fire Department...',
      status: 'complete' as const,
      data: 'No fire incidents reported at SCU - Fire Department confirms "No active incidents at SCU campus"',
    },
    {
      name: 'Social Pulse',
      icon: 'Users',
      query: 'Monitoring Twitter, Instagram, Reddit for real-time fire or smoke reports from SCU students...',
      status: 'complete' as const,
      data: 'Students posting about BBQ event at student union - "BBQ is lit! 🔥" - Zero emergency mentions',
    },
    {
      name: 'Emergency Services',
      icon: 'Phone',
      query: 'Checking 911 dispatch logs, Campus Safety status, and emergency shelter activation for Santa Clara University...',
      status: 'complete' as const,
      data: 'Campus Safety confirms normal operations - No shelters activated - Permitted BBQ event at student union',
    },
    {
      name: 'Knowledge Base',
      icon: 'FileText',
      query: 'Retrieving SCU fire safety protocols, false alarm patterns, and verification procedures...',
      status: 'complete' as const,
      data: 'Fire SOP: Common false alarms include cooking smoke and event smoke - Verification recommended',
    },
  ],
};

interface MCPStatus {
  name: string;
  icon: any;
  status: 'pending' | 'loading' | 'complete';
  color: string;
}

export default function FalseAlarmScenario() {
  const [stage, setStage] = useState<'input' | 'routing' | 'mcp' | 'evaluation' | 'synthesis' | 'complete'>('input');
  const [currentMCP, setCurrentMCP] = useState(0);
  const [showThoughtProcess, setShowThoughtProcess] = useState(false);
  const [userInput, setUserInput] = useState(MOCK_DATA.userQuery);
  const [detectedThreat, setDetectedThreat] = useState('Low');
  const [showSafetyOptions, setShowSafetyOptions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  
  // Map icon names to actual icon components
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
    color: agent.name.includes('Weather') ? 'blue' : 
           agent.name.includes('Traffic') ? 'green' :
           agent.name.includes('News') ? 'orange' :
           agent.name.includes('Social') ? 'purple' :
           agent.name.includes('Emergency') ? 'pink' : 'cyan',
  }));

  const [agents, setAgents] = useState(mcpAgents);

  const startDemo = () => {
    setStage('routing');
    setTimeout(() => {
      setStage('mcp');
      runMCPSequence();
    }, 2000);
  };

  const runMCPSequence = () => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < agents.length) {
        setAgents(prev => prev.map((agent, i) => ({
          ...agent,
          status: i === index ? 'loading' : i < index ? 'complete' : 'pending'
        })));
        setCurrentMCP(index);
        index++;
      } else {
        clearInterval(interval);
        setAgents(prev => prev.map(agent => ({ ...agent, status: 'complete' })));
        setTimeout(() => {
          setStage('evaluation');
          setTimeout(() => {
            setStage('synthesis');
            setTimeout(() => {
              setStage('complete');
            }, 3000);
          }, 2000);
        }, 1000);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-nvidia-gray to-nvidia-lightGray text-white">
      {/* Header */}
      <header className="border-b border-nvidia-green/20 backdrop-blur-sm sticky top-0 z-50 bg-black/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-nvidia-green hover:text-nvidia-darkGreen transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <h1 className="text-xl font-bold">Emergency Analysis</h1>
                <p className="text-xs text-gray-400">AI-Powered Threat Assessment</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Stage 1: Input */}
        {stage === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Threat Detection Panel */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-900/20 to-nvidia-lightGray border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-semibold text-green-400">Threat Level</span>
                </div>
                <div className="text-2xl font-bold text-green-400">LOW</div>
                <div className="text-xs text-gray-400 mt-1">Analysis ready</div>
              </div>
              
              <div className="bg-nvidia-lightGray border border-nvidia-green/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-nvidia-green" />
                  <span className="text-sm font-semibold text-gray-300">Location</span>
                </div>
                <div className="text-lg font-bold text-white">SCU Library</div>
                <div className="text-xs text-gray-400 mt-1">Santa Clara University</div>
              </div>
              
              <div className="bg-nvidia-lightGray border border-nvidia-green/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-nvidia-green" />
                  <span className="text-sm font-semibold text-gray-300">AI Agents</span>
                </div>
                <div className="text-2xl font-bold text-nvidia-green">6</div>
                <div className="text-xs text-gray-400 mt-1">Ready to deploy</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-nvidia-lightGray to-nvidia-gray rounded-2xl p-8 border border-green-500/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Situation Report</h2>
                  <p className="text-sm text-gray-400">AI-powered emergency analysis • Real-time assessment</p>
                </div>
              </div>
              
              {/* User Input Area */}
              <div className="space-y-6 mb-6">
                {/* Quick Scenarios - Now at Top & Bigger */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-400 block">Quick scenarios:</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button className="px-5 py-4 bg-green-900/20 border-2 border-green-500/40 rounded-xl text-green-400 hover:bg-green-900/40 hover:border-green-500/60 transition-all font-semibold text-base flex items-center justify-center gap-2 hover:scale-[1.02] transform">
                      <span className="text-2xl">🔥</span>
                      <span>Wildfire</span>
                    </button>
                    <button className="px-5 py-4 bg-green-900/20 border-2 border-green-500/40 rounded-xl text-green-400 hover:bg-green-900/40 hover:border-green-500/60 transition-all font-semibold text-base flex items-center justify-center gap-2 hover:scale-[1.02] transform">
                      <span className="text-2xl">🌪️</span>
                      <span>Hurricane</span>
                    </button>
                    <button className="px-5 py-4 bg-green-900/20 border-2 border-green-500/40 rounded-xl text-green-400 hover:bg-green-900/40 hover:border-green-500/60 transition-all font-semibold text-base flex items-center justify-center gap-2 hover:scale-[1.02] transform">
                      <span className="text-2xl">🌊</span>
                      <span>Flood Warning</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">What's happening?</label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full bg-black/50 border border-green-500/30 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 min-h-[120px] resize-none"
                    placeholder="Describe the situation you're observing..."
                  />
                </div>
              </div>
              
              {/* Action Button */}
              <button
                onClick={startDemo}
                className="w-full bg-gradient-to-r from-green-600 to-nvidia-green hover:from-green-700 hover:to-nvidia-darkGreen text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-green-500/30 flex items-center justify-center gap-3"
              >
                <Brain className="w-5 h-5" />
                <span>Analyze Situation with AI</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                <Shield className="w-3 h-3 inline mr-1" />
                Secure • Confidential • Real-time Analysis
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage 2: Router Planning */}
        {stage === 'routing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-nvidia-lightGray rounded-2xl p-8 border border-nvidia-green/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-nvidia-green/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-nvidia-green animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-nvidia-green">Router Agent</h2>
                  <p className="text-sm text-gray-400">Planning data collection strategy...</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {MOCK_DATA.routerPlan.tasks.map((task, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="bg-black/50 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-nvidia-green animate-pulse"></div>
                      <span className="font-semibold text-nvidia-green">{task.tool}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{task.query}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage 3: MCP Execution */}
        {(stage === 'mcp' || stage === 'evaluation' || stage === 'synthesis' || stage === 'complete') && (
          <div className="space-y-8">
            {/* MCP Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {agents.map((agent, idx) => {
                const Icon = agent.icon;
                const mockAgent = MOCK_DATA.agents.find(a => a.name === agent.name);
                
                return (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-nvidia-lightGray rounded-xl p-6 border-2 transition-all ${
                      agent.status === 'loading' 
                        ? 'border-nvidia-green shadow-lg shadow-nvidia-green/30' 
                        : agent.status === 'complete'
                        ? 'border-green-500/50'
                        : 'border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        agent.status === 'loading' ? 'bg-nvidia-green/20 animate-pulse' :
                        agent.status === 'complete' ? 'bg-green-500/20' : 'bg-gray-700'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          agent.status === 'loading' ? 'text-nvidia-green' :
                          agent.status === 'complete' ? 'text-green-400' : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{agent.name}</h3>
                        <p className="text-xs text-gray-400">
                          {agent.status === 'loading' && 'Fetching data...'}
                          {agent.status === 'complete' && 'Complete ✓'}
                          {agent.status === 'pending' && 'Waiting...'}
                        </p>
                      </div>
                    </div>
                    
                    {agent.status === 'complete' && stage !== 'mcp' && mockAgent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs pt-3 border-t border-gray-700 space-y-2"
                      >
                        <div className="text-gray-500">
                          <span className="font-semibold">Query:</span> "{mockAgent.query}"
                        </div>
                        <div className="text-gray-400 font-medium">
                          ✓ {mockAgent.data}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Evaluation Stage */}
            {(stage === 'evaluation' || stage === 'synthesis' || stage === 'complete') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-nvidia-lightGray rounded-2xl p-8 border border-green-500/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-green-400">Evaluator Agent</h2>
                    <p className="text-sm text-gray-400">Analyzing threat level...</p>
                  </div>
                </div>
                <div className="bg-black/50 rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-center gap-3">
                    <Check className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-2xl font-bold text-green-400">CALM</p>
                      <p className="text-sm text-gray-400">No immediate danger detected</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Synthesis Stage */}
            {(stage === 'synthesis' || stage === 'complete') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-nvidia-lightGray rounded-2xl p-8 border border-nvidia-green/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-nvidia-green/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-nvidia-green animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-nvidia-green">Synthesizer Agent</h2>
                    <p className="text-sm text-gray-400">Generating response plan...</p>
                  </div>
                </div>
                {stage === 'complete' && (
                  <div className="space-y-6">
                    <button
                      onClick={() => setShowThoughtProcess(!showThoughtProcess)}
                      className="w-full bg-black/50 hover:bg-black/70 border border-nvidia-green/30 rounded-lg p-4 text-left transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-nvidia-green">View AI Thought Process & Analysis</span>
                        <span className="text-nvidia-green">{showThoughtProcess ? '−' : '+'}</span>
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {showThoughtProcess && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-black/50 rounded-xl p-6 border border-nvidia-green/30"
                        >
                          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                            {MOCK_DATA.thoughtProcess}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="bg-gradient-to-br from-green-900/20 to-nvidia-lightGray rounded-xl p-6 border-2 border-green-500/50">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-7 h-7 text-green-400" />
                        <h3 className="text-xl font-bold text-green-400">✓ Situation Assessment</h3>
                      </div>
                      <div className="space-y-3 text-sm">
                        {MOCK_DATA.finalPlan.split('\n').map((line, idx) => {
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <h4 key={idx} className="text-base font-bold text-white mt-3 mb-2">{line.replace(/\*\*/g, '')}</h4>;
                          } else if (line.startsWith('•')) {
                            return <div key={idx} className="flex items-start gap-2 text-gray-300 my-1"><span className="text-green-400">•</span><span className="text-sm">{line.substring(2)}</span></div>;
                          } else if (line.trim() === '') {
                            return <div key={idx} className="h-1"></div>;
                          } else if (line.includes('**')) {
                            const parts = line.split('**');
                            return <p key={idx} className="text-gray-300 text-sm my-1.5">
                              {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part)}
                            </p>;
                          } else {
                            return <p key={idx} className="text-gray-300 text-sm my-1.5">{line}</p>;
                          }
                        })}
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="bg-gradient-to-br from-nvidia-lightGray to-nvidia-gray rounded-xl p-6 border border-green-500/30">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-nvidia-green" />
                        <h4 className="text-lg font-bold text-nvidia-green">Suggested Next Steps</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          onClick={() => setSelectedSuggestion('verify')}
                          className={`p-4 rounded-lg border transition-all text-left ${
                            selectedSuggestion === 'verify' 
                              ? 'bg-green-900/30 border-green-500' 
                              : 'bg-black/30 border-gray-700 hover:border-green-500/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                            <div>
                              <div className="font-semibold text-white mb-1">Verify with Campus Safety</div>
                              <div className="text-xs text-gray-400">Call (408) 554-4444 for confirmation</div>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setSelectedSuggestion('observe')}
                          className={`p-4 rounded-lg border transition-all text-left ${
                            selectedSuggestion === 'observe' 
                              ? 'bg-green-900/30 border-green-500' 
                              : 'bg-black/30 border-gray-700 hover:border-green-500/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                            <div>
                              <div className="font-semibold text-white mb-1">Continue Normal Activities</div>
                              <div className="text-xs text-gray-400">Campus is safe, no action needed</div>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setSelectedSuggestion('learn')}
                          className={`p-4 rounded-lg border transition-all text-left ${
                            selectedSuggestion === 'learn' 
                              ? 'bg-green-900/30 border-green-500' 
                              : 'bg-black/30 border-gray-700 hover:border-green-500/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                            <div>
                              <div className="font-semibold text-white mb-1">Review Safety Procedures</div>
                              <div className="text-xs text-gray-400">Learn about real emergency protocols</div>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setShowSafetyOptions(!showSafetyOptions)}
                          className={`p-4 rounded-lg border transition-all text-left ${
                            showSafetyOptions 
                              ? 'bg-green-900/30 border-green-500' 
                              : 'bg-black/30 border-gray-700 hover:border-green-500/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                            <div>
                              <div className="font-semibold text-white mb-1">Still Feel Unsafe?</div>
                              <div className="text-xs text-gray-400">View additional safety options</div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Safety Fallback Options - Separate UI */}
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
                            <h3 className="text-xl font-bold text-yellow-400">If You Still Feel Unsafe</h3>
                          </div>
                          <div className="text-gray-300 space-y-4">
                            <p className="text-sm">Even though our analysis shows no danger, your safety and comfort matter most. If you still feel worried or uncertain:</p>
                            
                            <div className="grid gap-3">
                              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-yellow-500/30">
                                <span className="text-yellow-400 font-bold">1.</span>
                                <div>
                                  <div className="font-semibold text-white">Contact Campus Safety</div>
                                  <div className="text-sm text-gray-400">Call (408) 554-4444 to request in-person verification</div>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-yellow-500/30">
                                <span className="text-yellow-400 font-bold">2.</span>
                                <div>
                                  <div className="font-semibold text-white">Move to a Different Location</div>
                                  <div className="text-sm text-gray-400">Go somewhere you feel more comfortable</div>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-yellow-500/30">
                                <span className="text-yellow-400 font-bold">3.</span>
                                <div>
                                  <div className="font-semibold text-white">Stay with Friends</div>
                                  <div className="text-sm text-gray-400">Go to a well-populated area like the library or student center</div>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-yellow-500/30">
                                <span className="text-yellow-400 font-bold">4.</span>
                                <div>
                                  <div className="font-semibold text-white">Trust Your Instincts</div>
                                  <div className="text-sm text-gray-400">It's always better to be cautious when it comes to your safety</div>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-yellow-500/30">
                                <span className="text-yellow-400 font-bold">5.</span>
                                <div>
                                  <div className="font-semibold text-white">Request an Escort</div>
                                  <div className="text-sm text-gray-400">Campus Safety can escort you to another building</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/50 mt-4">
                              <Phone className="w-5 h-5 text-yellow-400" />
                              <div>
                                <div className="font-semibold text-white">Emergency Contacts</div>
                                <div className="text-sm text-gray-300">Campus Safety: (408) 554-4444 • Emergency: 9-1-1</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
