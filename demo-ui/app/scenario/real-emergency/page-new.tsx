'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, AlertTriangle, Cloud, Map, Newspaper, 
  Users, Phone, FileText, Activity, Navigation,
  MapPin, Shield, ChevronRight, Zap, ArrowRight, CheckCircle,
  Flame, Wind, Eye, Route
} from 'lucide-react';

// URGENT EMERGENCY DATA
const EMERGENCY_DATA = {
  llmThought: `[EMERGENCY PROTOCOL ACTIVATED]

I've cross-referenced real-time data from 6 independent sources and detected a critical pattern indicating an active structure fire:

1. **Fire Progression Analysis**: Wind speed 12mph from west is pushing flames eastward at approximately 15 feet per minute. Your current location (SCU Library) is directly in the projected fire path. Smoke density measurements indicate you have a 5-8 minute safe evacuation window.

2. **Optimal Route Calculation**: Running simultaneous path analysis through campus topology, I've identified that El Camino Real is blocked by emergency responders. The Alviso→Benton→Lafayette corridor provides the fastest route (5.5 min) with lowest smoke exposure (<15% vs 60% on alternate routes).

3. **Real-Time Validation**: 47 social media posts in the last 3 minutes confirm heavy smoke west of library. Emergency services have activated the CRC shelter and are directing all west campus occupants there. 911 dispatch logs show 12 active fire units responding.

4. **Decision Confidence**: 99.7% confidence this is a REAL EMERGENCY requiring immediate evacuation. All data points converge on the same conclusion. Time is critical - execute evacuation protocol now.

Your safety depends on following this route precisely. I'll guide you step-by-step.`,

  steps: [
    {
      number: 1,
      title: "Exit Library Building Immediately",
      description: "You are currently on the 2nd floor of the SCU Library, near the study area. The fire is approaching from the west side of campus, approximately 300 meters from your location.",
      details: [
        "Exit through the EAST stairwell (near the computer lab)",
        "Do NOT use elevators - fire alarms have disabled them",
        "Keep low if you see smoke - breathable air is near the floor",
        "If stairwell is blocked, use the north emergency exit"
      ],
      action: "East stairwell → Ground floor → Main exit",
      time: "30 seconds",
      distance: "50 meters",
      icon: AlertTriangle,
      warning: "Fire alarms are active. Stay calm and move quickly.",
      mapData: {
        lat: 37.3496,
        lng: -121.9390,
        zoom: 18,
        markerTitle: "Your Location: SCU Library"
      }
    },
    {
      number: 2,
      title: "Navigate to Alviso Street",
      description: "Once outside, you'll be facing the main quad. Emergency vehicles are blocking El Camino Real to your right. Turn left and head toward Alviso Street.",
      details: [
        "Turn RIGHT as you exit the library main doors",
        "Walk EAST along the quad pathway for 100 meters",
        "You'll see Benson Memorial Center on your left",
        "Alviso Street is the first street crossing - clear of smoke"
      ],
      action: "Turn right → Walk east on Alviso St (100m)",
      time: "1 minute",
      distance: "100 meters",
      icon: Navigation,
      warning: "⚠️ CRITICAL: Do NOT go toward El Camino Real - emergency vehicles blocking and smoke thick",
      mapData: {
        lat: 37.3498,
        lng: -121.9385,
        zoom: 17,
        markerTitle: "Alviso Street Route"
      }
    },
    {
      number: 3,
      title: "Proceed North on Benton Street",
      description: "You're now on Alviso Street. Look for the intersection with Benton Street ahead. You'll see Benton Hall (brick building) on your right side as a visual landmark.",
      details: [
        "Continue straight for 50 meters until you reach Benton St",
        "Turn LEFT onto Benton Street at the intersection",
        "Stay on the RIGHT sidewalk for visibility",
        "You'll pass Kenna Hall (chapel with cross) on your left",
        "Keep moving north - this takes you away from the fire zone"
      ],
      action: "Turn left on Benton St → Head north (200m)",
      time: "2 minutes",
      distance: "200 meters",
      icon: MapPin,
      warning: "Smoke may be visible to your west (behind you) - do not turn back, continue forward",
      mapData: {
        lat: 37.3505,
        lng: -121.9383,
        zoom: 17,
        markerTitle: "Benton Street North"
      }
    },
    {
      number: 4,
      title: "Turn onto Lafayette Street",
      description: "You're almost at the safe zone. At the next intersection, you'll see Franklin Street to your left. Turn right onto Lafayette Street - you'll see Franklin Hall directly ahead (large academic building).",
      details: [
        "Continue on Benton St until you reach Lafayette intersection",
        "Turn RIGHT onto Lafayette Street",
        "The CRC (Campus Recreation Center) will be visible ahead",
        "You'll see emergency personnel with reflective vests directing people",
        "Follow their hand signals if they're directing traffic"
      ],
      action: "Turn right on Lafayette St → Continue east (150m)",
      time: "1.5 minutes",
      distance: "150 meters",
      icon: ArrowRight,
      warning: "Emergency responders are on scene - follow any instructions they give you immediately",
      mapData: {
        lat: 37.3510,
        lng: -121.9375,
        zoom: 17,
        markerTitle: "Lafayette Street to CRC"
      }
    },
    {
      number: 5,
      title: "Arrive at Campus Recreation Center (CRC)",
      description: "You've reached the designated emergency shelter. The CRC is a large modern building with glass doors. You'll see a Green Cross symbol and emergency personnel stationed outside.",
      details: [
        "Enter through the MAIN entrance (automatic sliding doors)",
        "Look for Safety Officers with yellow vests inside",
        "Report your name and that you evacuated from the library",
        "They will check you in and provide further instructions",
        "Stay in designated safe areas - do NOT leave without permission",
        "Medical assistance is available if you inhaled smoke"
      ],
      action: "Enter CRC → Find Safety Officer → Check in",
      time: "30 seconds",
      distance: "Final 20 meters",
      icon: Shield,
      warning: "Check in IMMEDIATELY - they need to account for all evacuees. Do not leave shelter area.",
      mapData: {
        lat: 37.3512,
        lng: -121.9370,
        zoom: 18,
        markerTitle: "CRC Emergency Shelter"
      }
    },
  ],
  
  agents: [
    {
      name: 'Weather Monitor',
      query: 'Wind direction & fire spread conditions',
      data: 'Wind from west 12mph - Fire spreading east toward library at ~15ft/min',
    },
    {
      name: 'Traffic & Maps',
      query: 'Blocked routes & emergency vehicle locations',
      data: 'El Camino Real BLOCKED - Use Alviso St → Benton St route - ETA 5.5min',
    },
    {
      name: 'News Feed',
      query: 'Active fire incident updates',
      data: 'Structure fire confirmed at 2:47pm - SCU evacuating west campus - 12 fire units responding',
    },
    {
      name: 'Social Pulse',
      query: 'Real-time student reports',
      data: '47 emergency posts in 3min - Heavy smoke west of library - Students reporting flames',
    },
    {
      name: 'Emergency Services',
      query: '911 dispatch & shelter locations',
      data: 'CRC shelter activated 2:45pm - All west campus evacuate immediately - Safety officers on-site',
    },
    {
      name: 'Knowledge Base',
      query: 'Fire evacuation protocols for SCU',
      data: 'Protocol EV-04: Library to CRC via Alviso → Benton → Lafayette - Designated safe route',
    },
  ],
};

export default function RealEmergencyScenario() {
  const [stage, setStage] = useState<'input' | 'analysis' | 'evacuation'>('input');
  const [currentStep, setCurrentStep] = useState(0);
  const [analyzingComplete, setAnalyzingComplete] = useState(false);
  const [showLLMThought, setShowLLMThought] = useState(false);

  const startEmergency = () => {
    setStage('analysis');
    
    setTimeout(() => {
      setAnalyzingComplete(true);
      setTimeout(() => {
        setStage('evacuation');
      }, 1500);
    }, 4000);
  };

  const advanceStep = () => {
    if (currentStep < EMERGENCY_DATA.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-gray-900 text-white">
      {/* Urgent Header */}
      <div className="border-b-2 border-red-600 bg-red-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-3 animate-pulse">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <span className="text-lg font-bold text-red-500">ACTIVE EMERGENCY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Input Stage */}
        {stage === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-red-900/60 to-gray-900 rounded-3xl p-10 border-2 border-red-600">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center animate-pulse">
                  <Flame className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-red-500">EMERGENCY DETECTED</h2>
                  <p className="text-gray-300 text-lg">Active structure fire near SCU Library</p>
                </div>
              </div>

              <div className="bg-black/40 rounded-2xl p-6 mb-6 border border-red-600/50">
                <p className="text-white text-xl leading-relaxed">
                  <strong className="text-red-400">URGENT:</strong> Confirmed structure fire west of SCU Library. 
                  Heavy smoke and active flames reported. Wind conditions pushing fire eastward. Immediate evacuation required.
                </p>
              </div>

              <button
                onClick={startEmergency}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-6 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 text-2xl shadow-2xl shadow-red-600/50 group"
              >
                <Zap className="w-8 h-8 group-hover:animate-bounce" />
                Get Evacuation Route NOW
                <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Analysis Stage */}
        {stage === 'analysis' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-red-900/40 rounded-2xl p-6 border-2 border-red-600">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-8 h-8 text-red-500 animate-pulse" />
                <h3 className="text-2xl font-bold text-red-500">ANALYZING EMERGENCY SITUATION</h3>
              </div>

              <div className="space-y-3">
                {EMERGENCY_DATA.agents.map((agent, idx) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.5 }}
                    className="bg-black/50 rounded-xl p-4 border border-red-600/30"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <h4 className="font-bold text-white">{agent.name}</h4>
                    </div>
                    <div className="text-xs text-gray-400 mb-2 italic">Query: "{agent.query}"</div>
                    <div className="text-sm text-red-300 bg-red-950/50 rounded-lg p-2 border border-red-600/20">
                      ⚠️ {agent.data}
                    </div>
                  </motion.div>
                ))}
              </div>

              {analyzingComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6"
                >
                  <button
                    onClick={() => setShowLLMThought(!showLLMThought)}
                    className="w-full bg-black/50 hover:bg-black/70 border border-red-600/30 rounded-xl p-4 text-left transition-all mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-red-400">🧠 View AI Reasoning & Threat Analysis</span>
                      <span className="text-red-400">{showLLMThought ? '−' : '+'}</span>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {showLLMThought && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black/50 rounded-xl p-5 border border-red-600/30 mb-4"
                      >
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                          {EMERGENCY_DATA.llmThought}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="bg-red-600 rounded-xl p-6 text-center">
                    <AlertTriangle className="w-12 h-12 text-white mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-white mb-2">EVACUATE IMMEDIATELY</h3>
                    <p className="text-white">Optimal route calculated - 5.5 minutes to safety</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Evacuation Steps - ALL VISIBLE */}
        {stage === 'evacuation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Progress Overview */}
            <div className="bg-red-900/40 rounded-2xl p-6 border-2 border-red-600 sticky top-24 z-40">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-red-500">EVACUATION ROUTE</h3>
                  <p className="text-gray-300 text-sm">Step {currentStep + 1} of {EMERGENCY_DATA.steps.length} • Total Time: 5.5 minutes</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-500">
                    {EMERGENCY_DATA.steps.slice(0, currentStep + 1).reduce((sum, step) => sum + parseFloat(step.time), 0).toFixed(1)} min
                  </div>
                  <div className="text-xs text-gray-400">Elapsed</div>
                </div>
              </div>
              <div className="flex gap-2">
                {EMERGENCY_DATA.steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      idx <= currentStep ? 'bg-red-600' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* All Steps Visible */}
            <div className="space-y-4">
              {EMERGENCY_DATA.steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx === currentStep;
                const isCompleted = idx < currentStep;
                
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`rounded-3xl p-6 border-2 transition-all ${
                      isActive 
                        ? 'bg-gradient-to-br from-red-900/60 to-gray-900 border-red-600 shadow-2xl shadow-red-600/50' 
                        : isCompleted
                        ? 'bg-gray-900/50 border-green-600/50'
                        : 'bg-gray-900/30 border-gray-700/50'
                    }`}
                  >
                    {/* Step Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        isActive ? 'bg-red-600 animate-pulse' : isCompleted ? 'bg-green-600' : 'bg-gray-700'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-10 h-10 text-white" /> : <Icon className="w-10 h-10 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-bold mb-1 ${isActive ? 'text-red-400' : isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
                          {isCompleted ? '✓ COMPLETED' : isActive ? '→ CURRENT STEP' : `STEP ${step.number}`}
                        </div>
                        <h2 className={`text-2xl font-bold ${isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                          {step.title}
                        </h2>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>Time</div>
                        <div className={`text-xl font-bold ${isActive ? 'text-red-500' : isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
                          {step.time}
                        </div>
                      </div>
                    </div>

                    {/* Warning (if active) */}
                    {isActive && (
                      <div className="bg-red-950/80 border-2 border-red-600 rounded-xl p-4 mb-4 flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1 animate-pulse" />
                        <div>
                          <div className="font-bold text-red-500 mb-1">⚠️ WARNING</div>
                          <div className="text-white text-sm">{step.warning}</div>
                        </div>
                      </div>
                    )}

                    {/* Details */}
                    {isActive && (
                      <>
                        <div className="bg-black/50 rounded-xl p-5 mb-4 border border-red-600/30">
                          <h3 className="text-lg font-bold text-white mb-3">Your Current Situation:</h3>
                          <p className="text-gray-300 text-sm leading-relaxed mb-4">{step.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            {step.details.map((detail, dIdx) => (
                              <div key={dIdx} className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-300 text-sm">{detail}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="bg-red-950/50 rounded-lg p-4 border border-red-600/50">
                            <div className="flex items-center gap-3">
                              <Navigation className="w-6 h-6 text-red-400" />
                              <div>
                                <div className="text-xs text-gray-400 mb-1">Next Action:</div>
                                <div className="text-lg font-bold text-white">{step.action}</div>
                                <div className="text-xs text-gray-400 mt-1">Distance: {step.distance}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Map */}
                        <div className="bg-gray-900 rounded-xl p-6 mb-4 border-2 border-red-600/50">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Map className="w-5 h-5 text-red-500" />
                              <span className="font-bold text-white">Interactive Route Map</span>
                            </div>
                            <span className="text-xs text-gray-400">Real-time GPS tracking</span>
                          </div>
                          
                          {/* Map Container */}
                          <div className="relative aspect-video bg-gray-800 rounded-lg border border-red-600/30 overflow-hidden">
                            {/* Simulated Map with markers */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <MapPin className="w-16 h-16 text-red-500 mx-auto mb-3 animate-bounce" />
                                <div className="text-white font-bold mb-2">{step.mapData.markerTitle}</div>
                                <div className="text-sm text-gray-400">Lat: {step.mapData.lat} | Lng: {step.mapData.lng}</div>
                                <div className="text-xs text-gray-500 mt-2">Map coordinates for GPS integration</div>
                              </div>
                            </div>
                            
                            {/* Route overlay */}
                            {step.number < 5 && (
                              <div className="absolute bottom-4 left-4 bg-red-950/90 border border-red-600 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Route className="w-4 h-4 text-red-400" />
                                  <span className="text-white font-semibold">Next: {EMERGENCY_DATA.steps[step.number].title}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {step.number === 2 && (
                            <div className="mt-4 bg-red-950/90 border-2 border-red-600 rounded-lg p-4 text-center">
                              <div className="font-bold text-red-400 text-lg mb-1">🚫 ROAD BLOCKED</div>
                              <div className="text-white text-sm">El Camino Real - Emergency vehicles present</div>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        {currentStep < EMERGENCY_DATA.steps.length - 1 ? (
                          <button
                            onClick={advanceStep}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-5 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-xl shadow-red-600/50 group"
                          >
                            <CheckCircle className="w-6 h-6" />
                            <span>I've Completed This Step</span>
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                          </button>
                        ) : (
                          <div className="bg-green-900/40 border-2 border-green-600 rounded-2xl p-6 text-center">
                            <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-3xl font-bold text-green-500 mb-2">YOU ARE SAFE</h3>
                            <p className="text-gray-300 text-lg">You have arrived at the emergency shelter. Check in with the Safety Officer immediately.</p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Compact view for non-active steps */}
                    {!isActive && (
                      <div className="text-sm text-gray-400">
                        {step.action} • {step.distance}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Reference */}
            <div className="bg-black/50 rounded-xl p-4 border border-red-600/30 sticky bottom-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500" />
                  <span className="text-gray-400">Emergency: <span className="text-white font-bold">9-1-1</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500" />
                  <span className="text-gray-400">Campus Safety: <span className="text-white font-bold">(408) 554-4444</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-gray-400">Shelter: <span className="text-white font-bold">CRC Building</span></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
