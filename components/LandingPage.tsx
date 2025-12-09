import React, { useState } from 'react';
import { Wallet, Shield, Zap, Layout, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = (provider: string) => {
    setIsLoading(true);
    // Simulate OAuth network delay
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Wallet size={24} />
          </div>
          <span className="text-xl font-bold text-slate-900">SubTrack</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#" className="hover:text-slate-900 transition-colors">About</a>
        </div>
        <button 
          onClick={() => handleAuth('generic')}
          className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
        >
          Log in
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Copy */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide border border-indigo-100">
              <Zap size={12} />
              <span>New: AI Budget Insights</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Stop overpaying for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">subscriptions</span>.
            </h1>
            
            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
              Track recurring expenses, analyze spending habits with Gemini AI, and never miss a payment date again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handleAuth('google')}
                disabled={isLoading}
                className="group relative flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-500/20 active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="animate-pulse">Connecting...</span>
                ) : (
                  <>
                    Get Started Free
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <button className="flex items-center justify-center gap-3 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-slate-50 hover:border-slate-300">
                View Demo
              </button>
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                <span>Secure encryption</span>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Abstract Background Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/50 to-violet-200/50 rounded-full blur-3xl animate-pulse"></div>
            
            {/* Auth Card Mockup */}
            <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 space-y-6 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Create account</h3>
                <p className="text-slate-500">Start tracking your wealth today</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleAuth('google')}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 p-3.5 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26c.47-1.5 1.5-2.53 2.53-2.53z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
                <button 
                  onClick={() => handleAuth('github')}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white p-3.5 rounded-xl hover:bg-slate-800 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>
              
              <div className="text-center text-xs text-slate-400 mt-4">
                By continuing you agree to our Terms of Service and Privacy Policy.
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Secure & Private</h3>
            <p className="text-slate-600 leading-relaxed">Your financial data is encrypted and stored locally. We never share your personal information.</p>
          </div>
          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-4">
              <Layout size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Visual Dashboard</h3>
            <p className="text-slate-600 leading-relaxed">See all your subscriptions in one place with beautiful charts and an interactive calendar.</p>
          </div>
          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Alerts</h3>
            <p className="text-slate-600 leading-relaxed">Get notified before payments happen and receive AI tips to save money.</p>
          </div>
        </div>
      </main>
    </div>
  );
};