import React from 'react';
import { Navigation, ArrowLeft, CloudRain, Wind, Thermometer, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 relative overflow-x-hidden">
      <header className="fixed top-0 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50 z-50 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 bg-slate-800 group-hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
             <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Back to App</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
             <Navigation className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">SkyCast AI</span>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 mx-auto mb-6">
             <Navigation className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">About SkyCast AI</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Revolutionizing weather forecasting with artificial intelligence, providing hyper-local, accurate, and actionable meteorological insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-8 backdrop-blur-md">
            <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">AI-Powered Insights</h3>
            <p className="text-slate-400 leading-relaxed">
              We leverage advanced machine learning models, including Google's Gemini AI, to analyze complex meteorological data and provide easy-to-understand, actionable insights tailored to your specific location and needs.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-8 backdrop-blur-md">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
              <CloudRain className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Hyper-Local Accuracy</h3>
            <p className="text-slate-400 leading-relaxed">
              Our system utilizes high-resolution weather models to deliver forecasts that are accurate down to your specific neighborhood, ensuring you're always prepared for whatever the sky brings.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-8 backdrop-blur-md">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
              <Wind className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Real-Time Monitoring</h3>
            <p className="text-slate-400 leading-relaxed">
              Track severe weather events, air quality changes, and sudden atmospheric shifts as they happen with our interactive radar and live data streams.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-8 backdrop-blur-md">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
              <Thermometer className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Comprehensive Data</h3>
            <p className="text-slate-400 leading-relaxed">
              From basic temperature and precipitation forecasts to complex thermal flow charts and UV index tracking, we provide all the data you need in a beautifully designed interface.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-8 md:p-12 backdrop-blur-md text-center mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Why Trust SkyCast AI?</h2>
          <p className="text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8">
            Our platform combines data from the world's leading meteorological organizations, including NOAA, ECMWF, and EUMETSAT, with cutting-edge AI processing. By cross-referencing multiple global models, we minimize errors and provide the most reliable forecast available for your specific coordinates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
            <div className="bg-slate-800/30 p-6 rounded-2xl">
              <h4 className="text-sky-400 font-bold mb-2">Data Integrity</h4>
              <p className="text-xs text-slate-400">We use verified, real-time data streams from over 40,000 weather stations worldwide.</p>
            </div>
            <div className="bg-slate-800/30 p-6 rounded-2xl">
              <h4 className="text-indigo-400 font-bold mb-2">AI Verification</h4>
              <p className="text-xs text-slate-400">Our AI models are continuously trained on historical weather patterns to improve predictive accuracy.</p>
            </div>
            <div className="bg-slate-800/30 p-6 rounded-2xl">
              <h4 className="text-emerald-400 font-bold mb-2">Expert Review</h4>
              <p className="text-xs text-slate-400">Our automated insights are designed to align with standard meteorological reporting practices.</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-8 md:p-12 backdrop-blur-md text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8">
            SkyCast AI was built with a singular vision: to make complex meteorological data accessible, understandable, and useful for everyone. We believe that better weather information leads to better decisions, safer communities, and a deeper understanding of our natural environment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
            <div className="bg-slate-800/30 p-6 rounded-2xl">
              <h4 className="text-sky-400 font-bold mb-2">Transparency</h4>
              <p className="text-xs text-slate-400">We are open about our data sources and how our AI models interpret meteorological patterns.</p>
            </div>
            <div className="bg-slate-800/30 p-6 rounded-2xl">
              <h4 className="text-indigo-400 font-bold mb-2">Innovation</h4>
              <p className="text-xs text-slate-400">We constantly push the boundaries of what's possible in weather prediction using the latest AI research.</p>
            </div>
            <div className="bg-slate-800/30 p-6 rounded-2xl">
              <h4 className="text-emerald-400 font-bold mb-2">Accessibility</h4>
              <p className="text-xs text-slate-400">Our interface is designed to be intuitive for everyone, from casual users to weather enthusiasts.</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-slate-500 uppercase tracking-widest font-bold">
            <span>Developed by Eleandro Mangrich</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
            <span>2026</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
