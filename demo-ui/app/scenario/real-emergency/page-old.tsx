'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, AlertTriangle, Cloud, Map, Newspaper, 
  Users, Phone, FileText, Activity, Navigation,
  MapPin, Shield, ChevronRight, Radio, Zap, ArrowRight
} from 'lucide-react';

// URGENT EMERGENCY DATA
const EMERGENCY_DATA = {
  steps: [
    {
      number: 1,
      title: "Exit the Building Immediately",
      description: "You are in the SCU Library. Leave NOW through the east exit.",
      action: "Head to the east stairwell → Ground floor",
      time: "30 seconds",
      icon: AlertTriangle,
      warning: "Do NOT use elevators. Fire alarms active.",
    },
    {
      number: 2,
      title: "Navigate to Alviso Street",
      description: "From your location, exit through the main doors facing the quad.",
      action: "Turn right → Walk east on Alviso St",
      time: "1 minute",
      icon: Navigation,
      warning: "AVOID El Camino Real - Emergency vehicles blocking",
    },
    {
      number: 3,
      title: "Proceed North on Benton Street",
      description: "You'll see Benton Hall on your right. Stay on the sidewalk.",
      action: "Turn left on Benton St → Head north",
      time: "2 minutes",
      icon: MapPin,
      warning: "Thick smoke reported from west - stay on path",
    },
    {
      number: 4,
      title: "Turn onto Lafayette Street",
      description: "At the intersection, you'll see Franklin Hall ahead.",
      action: "Turn right on Lafayette St → Continue east",
      time: "1.5 minutes",
      icon: ArrowRight,
      warning: "Emergency responders may be on scene - follow instructions",
    },
    {
      number: 5,
      title: "Arrive at Campus Recreation Center",
      description: "The CRC is your designated emergency shelter.",
      action: "Enter CRC → Report to Safety Officer",
      time: "30 seconds",
      icon: Shield,
      warning: "Check in immediately - do not leave shelter area",
    },
  ],
  
  agents: [
    {
      name: 'Weather Monitor',
      query: 'Wind direction & fire spread conditions',
      data: 'Wind from west 12mph - Fire spreading east toward library',
    },
    {
      name: 'Traffic & Maps',
      query: 'Blocked routes & emergency vehicle locations',
      data: 'El Camino Real BLOCKED - Use Alviso St → Benton St route',
    },
    {
      name: 'News Feed',
      query: 'Active fire incident updates',
      data: 'Structure fire confirmed - SCU evacuating west campus',
    },
    {
      name: 'Social Pulse',
      query: 'Real-time student reports',
      data: '47 emergency posts - Heavy smoke west of library confirmed',
    },
    {
      name: 'Emergency Services',
      query: '911 dispatch & shelter locations',
      data: 'CRC shelter activated - All west campus evacuate immediately',
    },
    {
      name: 'Knowledge Base',
      query: 'Fire evacuation protocols for SCU',
      data: 'Route via Alviso → Benton → Lafayette to CRC shelter',
    },
  ],
};

export default function RealEmergencyScenario() {
  const [stage, setStage] = useState<'input' | 'analysis' | 'evacuation'>('input');
  const [currentStep, setCurrentStep] = useState(0);
  const [analyzingComplete, setAnalyzingComplete] = useState(false);
  const [showingSteps, setShowingSteps] = useState(false);

  const startEmergency = () => {
    setStage('analysis');
    
    // Quick analysis animation
    setTimeout(() => {
      setAnalyzingComplete(true);
      setTimeout(() => {
        setStage('evacuation');
        setShowingSteps(true);
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
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Input Stage */}
        {stage === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Urgent Status */}
            <div className="bg-gradient-to-br from-red-900/60 to-gray-900 rounded-3xl p-10 border-2 border-red-600">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-red-500">EMERGENCY DETECTED</h2>
                  <p className="text-gray-300 text-lg">Active fire near Santa Clara University Library</p>
                </div>
              </div>

              <div className="bg-black/40 rounded-2xl p-6 mb-6 border border-red-600/50">
                <p className="text-white text-xl leading-relaxed">
                  <strong className="text-red-400">URGENT:</strong> There is a confirmed structure fire west of the SCU Library. 
                  Heavy smoke and active flames reported. You need to evacuate immediately.
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
                  className="mt-6 bg-red-600 rounded-xl p-6 text-center"
                >
                  <AlertTriangle className="w-12 h-12 text-white mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-2">EVACUATE IMMEDIATELY</h3>
                  <p className="text-white">Generating fastest escape route...</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Evacuation Steps */}
        {stage === 'evacuation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Progress Indicator */}
            <div className="bg-red-900/40 rounded-2xl p-6 border-2 border-red-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-red-500">EVACUATION ROUTE</h3>
                <span className="text-lg text-gray-300">Step {currentStep + 1} of {EMERGENCY_DATA.steps.length}</span>
              </div>
              <div className="flex gap-2">
                {EMERGENCY_DATA.steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-2 rounded-full ${
                      idx <= currentStep ? 'bg-red-600' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-gradient-to-br from-red-900/60 to-gray-900 rounded-3xl p-8 border-2 border-red-600"
              >
                {EMERGENCY_DATA.steps.map((step, idx) => {
                  if (idx !== currentStep) return null;
                  
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.number}>
                      {/* Step Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center">
                          <Icon className="w-12 h-12 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-lg text-red-400 font-bold mb-1">STEP {step.number}</div>
                          <h2 className="text-3xl font-bold text-white">{step.title}</h2>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Estimated Time</div>
                          <div className="text-2xl font-bold text-red-500">{step.time}</div>
                        </div>
                      </div>

                      {/* Warning */}
                      <div className="bg-red-950/80 border-2 border-red-600 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1 animate-pulse" />
                        <div>
                          <div className="font-bold text-red-500 mb-1">⚠️ WARNING</div>
                          <div className="text-white">{step.warning}</div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-black/50 rounded-xl p-6 mb-6 border border-red-600/30">
                        <h3 className="text-xl font-bold text-white mb-3">Your Current Situation:</h3>
                        <p className="text-gray-300 text-lg leading-relaxed mb-4">{step.description}</p>
                        
                        <div className="bg-red-950/50 rounded-lg p-4 border border-red-600/50">
                          <div className="flex items-center gap-3">
                            <Navigation className="w-6 h-6 text-red-400" />
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Next Action:</div>
                              <div className="text-xl font-bold text-white">{step.action}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Map Placeholder */}
                      <div className="bg-gray-900 rounded-xl p-8 mb-6 border-2 border-dashed border-red-600/50 text-center">
                        <Map className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <div className="text-gray-400 text-lg">Interactive Map View</div>
                        <div className="text-sm text-gray-500 mt-2">
                          Showing: Your location → {step.title}
                        </div>
                        {step.number === 2 && (
                          <div className="mt-4 text-red-400 font-bold">
                            🚫 El Camino Real BLOCKED - Follow Alviso St
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {currentStep < EMERGENCY_DATA.steps.length - 1 ? (
                        <button
                          onClick={advanceStep}
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-6 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 text-xl shadow-xl shadow-red-600/50 group"
                        >
                          <span>I've Completed This Step</span>
                          <ChevronRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                        </button>
                      ) : (
                        <div className="bg-green-900/40 border-2 border-green-600 rounded-2xl p-6 text-center">
                          <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                          <h3 className="text-3xl font-bold text-green-500 mb-2">YOU ARE SAFE</h3>
                          <p className="text-gray-300 text-lg">You have arrived at the emergency shelter. Check in with the Safety Officer immediately.</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Quick Reference */}
            <div className="bg-black/50 rounded-xl p-4 border border-red-600/30">
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
