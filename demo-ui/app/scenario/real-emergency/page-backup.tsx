'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, AlertTriangle, Cloud, Map, Newspaper, 
  Radio, Package, Database, Brain, FileText, Flame, Check
} from 'lucide-react';

// Hardcoded mock data for real emergency scenario
const MOCK_DATA = {
  userQuery: "Emergency! There's a wildfire approaching SCU campus from three sides. I'm in the library and don't know what to do!",
  
  routerPlan: {
    tasks: [
      { tool: "weather", query: "Santa Clara University wildfire conditions" },
      { tool: "maps", query: "SCU evacuation routes and blocked roads" },
      { tool: "news", query: "Santa Clara wildfire emergency alerts" },
      { tool: "social", query: "SCU campus wildfire social media" },
      { tool: "resource", query: "Emergency shelters Santa Clara" },
      { tool: "nemo_retriever", query: "wildfire evacuation procedures SCU" }
    ]
  },
  
  mcpResults: {
    weather: {
      source: "OpenWeatherMap API + Fire Weather Monitor",
      location: "Santa Clara University Library",
      temperature: "88°F (31°C)",
      condition: "Very Dry, Smoky, Unhealthy Air Quality",
      humidity: "18%",
      wind: "22 mph from NW (gusting to 34 mph)",
      airQuality: "AQI 178 (Unhealthy - Red Flag Warning)",
      alerts: "⚠️ RED FLAG WARNING: Critical fire weather until 8 AM tomorrow",
      visibility: "5 miles (heavy smoke haze)",
      notes: "Flames visible on western and southern campus perimeter. East and northeast corridors most navigable."
    },
    maps: {
      source: "Emergency Maps & Traffic Monitor",
      evacuation_routes: [
        "Route A – East via Alviso St → Benton St → Lafayette St (2.4 km to Downtown Assembly Plaza)",
        "Route B – Northeast via Franklin St → Lafayette St (3.1 km to safe zone)",
        "Route C – Southeast via Benton St → Kiely Blvd → CRC Shelter (3.6 km)"
      ],
      blocked_routes: [
        "El Camino Real (US-82) — CLOSED: Smoke and firefighting",
        "Franklin St between Alviso & The Alameda — CLOSED: Debris",
        "Palm Dr Campus — CLOSED except pedestrian evacuation"
      ],
      fire_perimeters: [
        "West Front: The Alameda to El Camino — Active, moderate intensity",
        "South Front: Homestead Rd area — Active, HIGH intensity, moving NE",
        "North Front: Benton St area — Contained, monitoring"
      ],
      safe_zones: [
        "Leavey Center Parking Lot (500 El Camino) — Open, 600 capacity",
        "Downtown Assembly Plaza (1500 Lafayette St) — Open, 800 capacity",
        "Community Recreation Center (969 Kiely Blvd) — Primary shelter, 1500 capacity"
      ]
    },
    news: {
      source: "Emergency Alert System & Local News",
      breaking: "SCU CAMPUS EVACUATION ORDERED — Fire threatens western, southern, and northern perimeters",
      official_alerts: [
        "Santa Clara Fire Dept: Level 3 GO NOW evacuation for campus west of Alviso St",
        "Campus Safety: All students evacuate east toward Benton St and Lafayette St corridors",
        "City of Santa Clara: CRC shelter open at 969 Kiely Blvd"
      ],
      latest_update: "2:30 PM — Fire has grown to 450 acres, 0% contained. Gusty winds spreading embers.",
      recommended_action: "Immediate evacuation required. Do not delay."
    },
    social: {
      source: "Social Media Emergency Monitor",
      sentiment: "HIGH ALERT — Urgent evacuation messages",
      trending: ["#SCUFire", "#SantaClaraEvacuate", "#RedFlagWarning"],
      emergency_mentions: 847,
      recent_posts: [
        "@SCUSafety: EVACUATION ORDER — Leave campus NOW via east gates. Head to CRC shelter.",
        "@SantaClaraFire: Crews battling fire on 3 fronts. Avoid west campus. Follow official evacuation routes.",
        "Student: Can see flames from library windows. Everyone leaving through east side.",
        "@CityofSantaClara: CRC shelter NOW OPEN — 969 Kiely Blvd. Medical and supplies available."
      ],
      notes: "Multiple eyewitness reports confirm fire visibility from campus. Official channels broadcasting evacuation orders."
    },
    resource: {
      source: "Emergency Resource Coordination",
      active_shelters: [
        "Community Recreation Center (CRC) — PRIMARY SHELTER — 969 Kiely Blvd — Open Now",
        "Downtown Assembly Plaza — 1500 Lafayette St — Staging area"
      ],
      emergency_contacts: {
        campus_safety: "(408) 554-4444",
        fire_emergency: "9-1-1",
        shelter_info: "(408) 615-2260"
      },
      medical: "First aid and respiratory support available at CRC shelter",
      supplies: "N95 masks, water, food at evacuation points",
      accessibility: "Assistive evacuation routes via Leavey Center. Areas of Refuge staffed."
    },
    nemo_retriever: {
      source: "Wildfire SOP — Santa Clara University",
      evacuation_protocol: [
        "Exit building via nearest stairwell (NO elevators)",
        "Move in groups with headcount tracking",
        "Use east/northeast corridors when west/south compromised",
        "Primary routes: Alviso St → Benton St → Lafayette St OR Franklin St → Lafayette St",
        "Assembly point: Leavey Center Lot first, then proceed to CRC shelter if safe",
        "Bring: ID, phone, essentials only. Use N95 mask for smoke protection.",
        "Check in at shelter for accountability"
      ],
      smoke_guidance: "Cover mouth/nose. Move low if heavy smoke. Seek medical help for breathing difficulty.",
      special_needs: "Contact Campus Safety for assistive evacuation. Use Areas of Refuge if needed."
    }
  },
  
  severity: "URGENT",
  
  thoughtProcess: `1. Weather Data [Source: weather]: 88°F with 18% humidity and 22 mph NW winds gusting to 34 mph. RED FLAG WARNING active indicating critical fire weather. AQI 178 (Unhealthy). Visibility reduced to 5 miles due to smoke. These are extreme fire conditions requiring immediate action.

2. Infrastructure Status [Source: maps]: Three fire perimeters confirmed (west, south, north). El Camino Real and Franklin St CLOSED. Multiple blocked routes. However, east and southeast corridors (Alviso St, Benton St, Lafayette St, Kiely Blvd) remain passable. Three safe zones identified with shelter at CRC (969 Kiely Blvd) as primary destination.

3. Official Communications [Source: news]: Level 3 "GO NOW" evacuation order issued by Santa Clara Fire Dept for campus. Campus Safety confirms evacuation order. Fire is 450 acres, 0% contained, actively spreading. This is a confirmed, active emergency requiring immediate response.

4. Social Intelligence [Source: social]: 847 emergency mentions. Official @SCUSafety and @SantaClaraFire accounts broadcasting evacuation orders. Eyewitness reports confirm fire visibility from campus buildings. Social sentiment confirms this is real and urgent.

5. Emergency Resources [Source: resource]: CRC shelter at 969 Kiely Blvd is open and accepting evacuees. N95 masks and medical support available. Emergency contacts verified and active.

6. SOP Guidance [Source: nemo_retriever]: Wildfire SOP provides clear evacuation steps: exit via stairwells, use east/NE corridors, move to Leavey Center then CRC shelter, use smoke protection, maintain groups with headcount.

CRITICAL ASSESSMENT: All six sources confirm an ACTIVE WILDFIRE EMERGENCY with official evacuation orders. Three sides of campus are threatened. East and northeast routes remain safe. User is inside the library and needs immediate, clear evacuation guidance.

SEVERITY: URGENT — Immediate evacuation required.`,
  
  finalPlan: `**URGENT EVACUATION — You Must Leave NOW**

Do not worry — I'll guide you step by step. You are in a serious situation, but there is a safe way out and help is coordinated ahead.

**Current Situation:**

A wildfire is actively threatening Santa Clara University campus from the west, south, and north sides. An official Level 3 "GO NOW" evacuation order is in effect. You must evacuate immediately.

**✓ SAFE EVACUATION ROUTE (East Corridor):**

The EAST and NORTHEAST sides of campus are clear and safe for evacuation.

**YOUR STEP-BY-STEP EVACUATION PLAN:**

**STEP 1: Leave the Library Building NOW**
• Exit via the nearest stairwell (DO NOT use elevators)
• If with others, stay together and do a quick headcount
• Bring: ID, phone, keys, essentials only (do not waste time gathering belongings)

**STEP 2: Smoke Protection**
• If N95 mask available, put it on immediately
• If not available, cover nose and mouth with cloth/shirt
• Stay low if smoke is heavy; move quickly but safely

**STEP 3: Exit Campus via EAST Gates**

Choose one of these safe routes:

🟢 **Route A (RECOMMENDED):**
• Exit library heading EAST toward Alviso Street
• Follow Alviso St → turn onto Benton St → proceed to Lafayette St
• Distance: 2.4 km (15-20 min walk)
• Destination: Downtown Assembly Plaza (1500 Lafayette St)

🟢 **Route B (Alternative):**
• Exit heading NORTHEAST via Franklin Street
• Follow Franklin St → Lafayette St → toward University Ave
• Distance: 3.1 km
• Destination: Safe zone north of campus

🟢 **Route C (If medical support needed):**
• Exit via Benton St → head SOUTHEAST to Kiely Blvd
• Distance: 3.6 km
• Destination: Community Recreation Center (CRC) — PRIMARY SHELTER — 969 Kiely Blvd

**STEP 4: First Assembly Point**
• Meet initially at **Leavey Center Parking Lot** (500 El Camino Real)
• Do headcount if in a group
• Receive instructions from Campus Safety staff present
• Then proceed to CRC shelter

**STEP 5: Reach the Shelter**
• **Community Recreation Center (CRC)**
• Address: **969 Kiely Blvd, Santa Clara, CA 95051**
• Status: **OPEN NOW** — accepting evacuees
• Capacity: 1,500 people
• Available: Medical support, N95 masks, water, food, restrooms

**⚠️ AVOID THESE AREAS (BLOCKED/DANGEROUS):**
• ❌ El Camino Real (US-82) — CLOSED for firefighting
• ❌ Western campus gates — Active fire perimeter
• ❌ Southern gates near Homestead Rd — High-intensity fire zone
• ❌ Franklin St between Alviso & The Alameda — Debris/low visibility

**IMPORTANT REMINDERS:**

✓ **Do NOT panic** — East and northeast routes are CLEAR and SAFE
✓ **Move quickly but carefully** — Do not run; maintain awareness
✓ **Stay in groups if possible** — Keep track of people with you
✓ **Follow official instructions** — Campus Safety and fire personnel are on-site
✓ **Check in at shelter** — Let staff know you've arrived for accountability

**EMERGENCY CONTACTS:**

🚨 **Immediate danger (flames/injury):** 9-1-1
📞 **Campus Safety Emergency:** (408) 554-4444
🏥 **Shelter Info:** (408) 615-2260

**ACCESSIBILITY NOTE:**
If you or someone with you needs assistive evacuation:
• Contact Campus Safety at (408) 554-4444 immediately
• Use designated Areas of Refuge (marked in stairwells)
• Assistive evacuation routes are available via Leavey Center

**SMOKE/BREATHING ISSUES:**
• If anyone has difficulty breathing, seek medical attention at CRC shelter
• First aid and respiratory support are available
• Do not delay evacuation due to minor symptoms — help is at the shelter

**MINI EVACUATION CHECKLIST:**

**Before you move:**
☑ N95 mask on (or cloth covering)
☑ ID and phone in pocket
☑ Know your route (EAST via Alviso or Franklin)
☑ If in group: headcount done

**While evacuating:**
☑ Stay calm and move steadily
☑ Follow Campus Safety instructions
☑ Keep heading EAST/NORTHEAST
☑ Check in at Leavey Center Lot first

**On arrival at shelter:**
☑ Check in with staff for accountability
☑ Receive supplies (water, food, masks)
☑ Get medical check if needed
☑ Follow shelter instructions

**YOU ARE DOING GREAT:**

This is a serious situation, but you are not alone. Campus Safety, Santa Clara Fire Department, and emergency personnel are actively managing this incident. The shelter is ready for you with supplies and support. The east route is clear and safe.

**Start moving NOW. Head EAST. You've got this. Help is coordinated ahead.**

Stay safe, stay calm, and follow this plan. You will be okay.`
};

interface MCPStatus {
  name: string;
  icon: any;
  status: 'pending' | 'loading' | 'complete';
  color: string;
}

export default function RealEmergencyScenario() {
  const [stage, setStage] = useState<'input' | 'routing' | 'mcp' | 'evaluation' | 'synthesis' | 'complete'>('input');
  const [currentMCP, setCurrentMCP] = useState(0);
  const [showThoughtProcess, setShowThoughtProcess] = useState(false);
  
  const mcpAgents: MCPStatus[] = [
    { name: 'Weather Monitor', icon: Cloud, status: 'pending', color: 'blue' },
    { name: 'Traffic & Maps', icon: Map, status: 'pending', color: 'green' },
    { name: 'News Feed', icon: Newspaper, status: 'pending', color: 'orange' },
    { name: 'Social Pulse', icon: Radio, status: 'pending', color: 'purple' },
    { name: 'Emergency Services', icon: Package, status: 'pending', color: 'pink' },
    { name: 'Knowledge Base', icon: Database, status: 'pending', color: 'cyan' },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-nvidia-gray text-white">
      {/* Header */}
      <header className="border-b border-red-500/30 backdrop-blur-sm sticky top-0 z-50 bg-black/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-red-500 animate-pulse" />
              <div>
                <h1 className="text-xl font-bold">Active Emergency Response</h1>
                <p className="text-xs text-gray-400">Critical Threat Assessment</p>
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
            className="max-w-3xl mx-auto"
          >
            <div className="bg-nvidia-lightGray rounded-2xl p-8 border-2 border-red-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-red-500">URGENT: Emergency Report</h2>
                  <p className="text-sm text-gray-400">Critical Alert • Santa Clara University</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-950/40 to-black/50 rounded-xl p-6 mb-6 border-2 border-red-500/50">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <span className="text-sm">👤</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-red-400 mb-1 font-semibold">⚠️ CRITICAL REPORT • 2:15 PM</div>
                    <p className="text-lg text-gray-100 leading-relaxed font-medium">
                      "{MOCK_DATA.userQuery}"
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={startDemo}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-xl shadow-red-500/30 flex items-center justify-center gap-3 animate-pulse"
              >
                <Brain className="w-5 h-5" />
                <span>🚨 ACTIVATE EMERGENCY RESPONSE</span>
                <span className="text-lg">→</span>
              </button>
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
                  <p className="text-sm text-gray-400">Deploying emergency intelligence gathering...</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {MOCK_DATA.routerPlan.tasks.map((task, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="bg-black/50 rounded-lg p-4 border border-red-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="font-semibold text-red-400">{task.tool}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-300">{task.query}</span>
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
                return (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-nvidia-lightGray rounded-xl p-6 border-2 transition-all ${
                      agent.status === 'loading' 
                        ? 'border-red-500 shadow-lg shadow-red-500/30' 
                        : agent.status === 'complete'
                        ? 'border-nvidia-green/50'
                        : 'border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        agent.status === 'loading' ? 'bg-red-500/20 animate-pulse' :
                        agent.status === 'complete' ? 'bg-nvidia-green/20' : 'bg-gray-700'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          agent.status === 'loading' ? 'text-red-500' :
                          agent.status === 'complete' ? 'text-nvidia-green' : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{agent.name}</h3>
                        <p className="text-xs text-gray-400">
                          {agent.status === 'loading' && 'Gathering intel...'}
                          {agent.status === 'complete' && 'Data received ✓'}
                          {agent.status === 'pending' && 'Standby...'}
                        </p>
                      </div>
                    </div>
                    
                    {agent.status === 'complete' && stage !== 'mcp' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs pt-3 border-t border-gray-700 space-y-2"
                      >
                        <div className="text-gray-500">
                          <span className="font-semibold">Query:</span> "{
                            agent.name === 'Weather Monitor' ? 'Santa Clara University wildfire conditions' :
                            agent.name === 'Traffic & Maps' ? 'SCU evacuation routes and blocked roads' :
                            agent.name === 'News Feed' ? 'Santa Clara wildfire emergency alerts' :
                            agent.name === 'Social Pulse' ? 'SCU campus wildfire social media' :
                            agent.name === 'Emergency Services' ? 'Emergency shelters Santa Clara' :
                            'wildfire evacuation procedures SCU'
                          }"
                        </div>
                        <div className="text-red-400 font-medium">
                          {agent.name === 'Weather Monitor' && '⚠️ Red Flag Warning, AQI 178'}
                          {agent.name === 'Traffic & Maps' && '🚨 3 blocked routes, east clear'}
                          {agent.name === 'News Feed' && '📢 Level 3 evacuation order'}
                          {agent.name === 'Social Pulse' && '🔥 847 emergency mentions'}
                          {agent.name === 'Emergency Services' && '🏥 CRC shelter open now'}
                          {agent.name === 'Knowledge Base' && '📋 Evacuation SOP retrieved'}
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
                className="bg-nvidia-lightGray rounded-2xl p-8 border-2 border-red-500/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-red-500">Evaluator Agent</h2>
                    <p className="text-sm text-gray-400">Assessing threat severity...</p>
                  </div>
                </div>
                <div className="bg-red-950/50 rounded-xl p-6 border-2 border-red-500/50">
                  <div className="flex items-center gap-3">
                    <Flame className="w-8 h-8 text-red-500 animate-pulse" />
                    <div>
                      <p className="text-3xl font-bold text-red-500">URGENT</p>
                      <p className="text-sm text-gray-300">Immediate evacuation required</p>
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
                    <p className="text-sm text-gray-400">Generating evacuation plan...</p>
                  </div>
                </div>
                {stage === 'complete' && (
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowThoughtProcess(!showThoughtProcess)}
                      className="w-full bg-black/50 hover:bg-black/70 border border-nvidia-green/30 rounded-lg p-4 text-left transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-nvidia-green">View AI Thought Process & Data Analysis</span>
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

                    <div className="bg-gradient-to-br from-red-950/30 to-nvidia-lightGray rounded-xl p-6 border-2 border-red-500/50">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
                        <h3 className="text-2xl font-bold text-red-500">🚨 URGENT EVACUATION PLAN</h3>
                      </div>
                      <div className="prose prose-invert prose-red max-w-none">
                        {MOCK_DATA.finalPlan.split('\n').map((line, idx) => {
                          if (line.startsWith('**') && line.endsWith('**')) {
                            const text = line.replace(/\*\*/g, '');
                            if (text.includes('URGENT') || text.includes('EVACUATION')) {
                              return <h2 key={idx} className="text-2xl font-bold text-red-500 mt-6 mb-3">{text}</h2>;
                            }
                            return <h3 key={idx} className="text-lg font-bold text-white mt-4 mb-2">{text}</h3>;
                          } else if (line.startsWith('✓')) {
                            return <div key={idx} className="flex items-start gap-2 text-gray-300 my-1"><span className="text-green-400">✓</span><span>{line.substring(2)}</span></div>;
                          } else if (line.startsWith('☑')) {
                            return <div key={idx} className="flex items-start gap-2 text-gray-300 my-1"><span className="text-nvidia-green">☑</span><span>{line.substring(2)}</span></div>;
                          } else if (line.startsWith('•')) {
                            return <div key={idx} className="flex items-start gap-2 text-gray-300 my-1 ml-4"><span className="text-red-400">•</span><span>{line.substring(2)}</span></div>;
                          } else if (line.startsWith('❌')) {
                            return <div key={idx} className="flex items-start gap-2 text-red-400 my-1 font-semibold"><span>❌</span><span>{line.substring(2)}</span></div>;
                          } else if (line.startsWith('🟢')) {
                            return <div key={idx} className="flex items-start gap-2 text-green-400 my-1 font-semibold"><span>🟢</span><span>{line.substring(3)}</span></div>;
                          } else if (line.startsWith('🚨') || line.startsWith('📞') || line.startsWith('🏥')) {
                            return <div key={idx} className="flex items-start gap-2 text-gray-200 my-1 font-semibold bg-red-950/30 p-2 rounded"><span>{line.substring(0, 2)}</span><span>{line.substring(3)}</span></div>;
                          } else if (line.match(/^(STEP|Step) \d+:/)) {
                            return <h4 key={idx} className="text-base font-bold text-nvidia-green mt-4 mb-2">{line}</h4>;
                          } else if (line.trim() === '') {
                            return <div key={idx} className="h-2"></div>;
                          } else {
                            return <p key={idx} className="text-gray-300 leading-relaxed my-2">{line}</p>;
                          }
                        })}
                      </div>
                    </div>
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
