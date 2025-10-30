'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Brain, Shield, Activity, Globe, Sparkles, ArrowRight, Github, Linkedin, ExternalLink, AlertTriangle, CheckCircle, Send, Loader2 } from 'lucide-react';

function EmergencyInput() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !location.trim()) return;

    setLoading(true);

    // Store the query and location in sessionStorage for the analysis page
    sessionStorage.setItem('emergencyQuery', query);
    sessionStorage.setItem('emergencyLocation', location);

    // Simulate brief processing
    setTimeout(() => {
      router.push('/analyze');
    }, 500);
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Your Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Santa Clara University, San Francisco, etc."
          className="w-full px-4 py-3 bg-nvidia-gray border border-nvidia-green/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-nvidia-green focus:ring-2 focus:ring-nvidia-green/20 transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">What's happening?</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe the situation in detail... (e.g., 'I see smoke near the library', 'Heavy flooding on campus', etc.)"
          rows={4}
          className="w-full px-4 py-3 bg-nvidia-gray border border-nvidia-green/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-nvidia-green focus:ring-2 focus:ring-nvidia-green/20 transition-all resize-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || !query.trim() || !location.trim()}
        className="w-full px-6 py-4 bg-gradient-to-r from-nvidia-green to-green-400 hover:from-green-400 hover:to-nvidia-green text-black font-bold text-lg rounded-xl shadow-lg shadow-nvidia-green/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing Situation...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Analyze Emergency</span>
          </>
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            handleExampleClick("I see smoke coming from the building near campus and people seem worried");
            setLocation("Santa Clara University");
          }}
          className="text-sm text-nvidia-green hover:text-green-400 transition-colors"
        >
          Try an example query →
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            handleExampleClick("I see smoke coming from the building and people are evacuating");
            setLocation("Santa Clara University");
          }}
          className="px-4 py-3 bg-nvidia-lightGray hover:bg-nvidia-gray border border-nvidia-green/20 hover:border-nvidia-green/40 rounded-xl text-sm text-gray-300 transition-all text-left"
        >
          <div className="font-semibold text-white mb-1">💨 Example: Fire/Smoke</div>
          "I see smoke coming from the building..."
        </button>
        <button
          type="button"
          onClick={() => {
            handleExampleClick("Heavy winds and flooding in the area, water rising quickly");
            setLocation("San Francisco Bay Area");
          }}
          className="px-4 py-3 bg-nvidia-lightGray hover:bg-nvidia-gray border border-nvidia-green/20 hover:border-nvidia-green/40 rounded-xl text-sm text-gray-300 transition-all text-left"
        >
          <div className="font-semibold text-white mb-1">🌪️ Example: Storm</div>
          "Heavy winds and flooding in the area..."
        </button>
      </div>
    </form>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-nvidia-gray to-black text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(118,185,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(118,185,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      {/* Header */}
      <header className="relative border-b border-nvidia-green/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-nvidia-green to-green-400 rounded-xl flex items-center justify-center shadow-lg shadow-nvidia-green/50">
                <Zap className="w-7 h-7 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-nvidia-green">CrisisVision</h1>
                <p className="text-xs text-gray-400">AI-Powered Emergency Response</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" className="text-gray-400 hover:text-nvidia-green transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" className="text-gray-400 hover:text-nvidia-green transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-5xl mx-auto mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-nvidia-green/10 border-2 border-nvidia-green/30 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-nvidia-green" />
            <span className="text-nvidia-green font-bold text-sm tracking-wide">POWERED BY NVIDIA AI</span>
          </motion.div>
          
          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Saving Lives with
            </span>
            <br />
            <span className="bg-gradient-to-r from-nvidia-green via-green-400 to-nvidia-green bg-clip-text text-transparent animate-pulse">
              AI Intelligence
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto mb-6 font-light leading-relaxed">
            Real-time emergency response orchestration powered by NVIDIA NIM, analyzing 6 data sources simultaneously to deliver life-saving guidance in seconds.
          </p>
          
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-12">
            Multi-agent AI system leveraging RAG, real-time intelligence from weather, maps, news, social media, and emergency protocols.
          </p>
          
          {/* Emergency Input Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gradient-to-br from-nvidia-lightGray to-nvidia-gray border border-nvidia-green/30 rounded-2xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Describe Your Emergency Situation</h2>
              <p className="text-gray-400 text-center mb-6">Enter what you're seeing or experiencing, and our AI will analyze the situation</p>
              
              <EmergencyInput />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-24"
        >
          {[
            { icon: Brain, value: '6', label: 'AI Data Sources', color: 'from-nvidia-green to-green-400' },
            { icon: Zap, value: '<5s', label: 'Response Time', color: 'from-green-400 to-nvidia-green' },
            { icon: Activity, value: '3', label: 'Active Agents', color: 'from-nvidia-green to-green-300' },
            { icon: Globe, value: '24/7', label: 'Monitoring', color: 'from-green-300 to-nvidia-green' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" 
                   style={{ background: `linear-gradient(135deg, #76B900 0%, #5F9400 100%)` }}></div>
              <div className="relative bg-gradient-to-br from-nvidia-lightGray to-nvidia-gray border border-nvidia-green/20 group-hover:border-nvidia-green/60 rounded-2xl p-6 transition-all duration-300">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                  <stat.icon className="w-6 h-6 text-black" />
                </div>
                <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Powered By NVIDIA Technology</h2>
            <p className="text-gray-400 text-lg">Advanced AI models and infrastructure for real-time crisis response</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'NVIDIA NIM', desc: 'Inference Microservices' },
              { name: 'Nemotron-Nano-9B', desc: 'Small Language Model' },
              { name: 'Llama-3.3-Nemotron-49B', desc: 'Large Language Model' },
              { name: 'NeMo Retriever', desc: 'RAG Framework' },
              { name: 'FAISS Vector DB', desc: 'Similarity Search' },
              { name: 'Multi-Agent Orchestration', desc: 'Intelligent Coordination' },
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="bg-gradient-to-br from-nvidia-lightGray to-nvidia-gray border border-nvidia-green/20 hover:border-nvidia-green/60 rounded-xl p-5 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-white text-sm group-hover:text-nvidia-green transition-colors">{tech.name}</h3>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-nvidia-green transition-colors" />
                </div>
                <p className="text-xs text-gray-500">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-nvidia-green/20 mt-24 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-nvidia-green rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-nvidia-green">CrisisVision</span>
              </div>
              <p className="text-gray-500 text-sm">© 2025 • Built with NVIDIA AI Technology</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="px-4 py-2 bg-nvidia-lightGray border border-nvidia-green/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-nvidia-green rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">System Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
