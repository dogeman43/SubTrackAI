import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Wallet, TrendingUp, Calendar as CalendarIcon, Trash2, BrainCircuit, Sparkles, AlertCircle, ArrowRight, CreditCard, PieChart } from 'lucide-react';
import { Subscription, AIAnalysisResponse } from './types';
import { SubscriptionForm } from './components/SubscriptionForm';
import { DashboardCharts } from './components/DashboardCharts';
import { CalendarView } from './components/CalendarView';
import { analyzeSubscriptions } from './services/geminiService';

const App: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('subscriptions');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIAnalysisResponse | null>(null);

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  // Derived State
  const totalMonthly = useMemo(() => 
    subscriptions.reduce((sum, sub) => sum + sub.price, 0),
  [subscriptions]);

  const totalYearly = totalMonthly * 12;

  const nextPayment = useMemo(() => {
    if (subscriptions.length === 0) return null;
    const today = new Date().getDate();
    
    // Sort logic to find the closest upcoming date
    const sorted = [...subscriptions].sort((a, b) => a.dayOfMonth - b.dayOfMonth);
    const upcoming = sorted.find(s => s.dayOfMonth >= today);
    const nextMonth = sorted[0]; // Wraps around to next month
    
    const payment = upcoming || nextMonth;
    if (!payment) return null;

    let daysUntil = payment.dayOfMonth - today;
    if (daysUntil < 0) {
      // Get days in current month to add to calculation for next month
      const daysInThisMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      daysUntil += daysInThisMonth;
    }

    return { ...payment, daysUntil };
  }, [subscriptions]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Handlers
  const handleAddSubscription = (sub: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...sub,
      id: crypto.randomUUID()
    };
    setSubscriptions(prev => [...prev, newSub]);
    setAiInsights(null); // Clear stale insights
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      setAiInsights(null);
    }
  };

  const handleAIAnalysis = async () => {
    if (subscriptions.length === 0) return;
    setIsAnalyzing(true);
    const result = await analyzeSubscriptions(subscriptions);
    setAiInsights(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Wallet size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              SubTrack
            </span>
          </div>
          <div className="flex items-center gap-4">
             <button
              onClick={() => setIsFormOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-slate-500/20 active:scale-95"
            >
              <Plus size={18} />
              Add Subscription
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="sm:hidden bg-slate-900 text-white p-2 rounded-xl"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
              {greeting}, User
            </h1>
            <p className="text-slate-500 font-medium">
              Here's what's happening with your recurring expenses today.
            </p>
          </div>
          {subscriptions.length > 0 && (
             <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                <CalendarIcon size={16} className="text-indigo-500" />
                <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
             </div>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Monthly Spend Card */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CreditCard size={80} className="text-indigo-600 transform rotate-12" />
            </div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Monthly Cost</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900">${totalMonthly.toFixed(2)}</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">
                ${totalYearly.toFixed(0)}
              </span>
              <span>projected yearly</span>
            </div>
          </div>

          {/* Active Subs Card */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Active Subscriptions</p>
                <span className="text-4xl font-bold text-slate-900">{subscriptions.length}</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp size={24} />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Across {new Set(subscriptions.map(s => s.category)).size} categories
            </p>
          </div>

          {/* Next Payment Alert - High Retention Item */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
             <div className="absolute -right-6 -bottom-6 opacity-20">
               <CalendarIcon size={120} />
             </div>
             
             {nextPayment ? (
               <>
                 <p className="text-indigo-100 font-medium text-sm mb-2 flex items-center gap-2">
                   <AlertCircle size={14} /> Upcoming Bill
                 </p>
                 <div className="relative z-10">
                   <h3 className="text-2xl font-bold mb-1">{nextPayment.name}</h3>
                   <div className="flex items-baseline gap-2 mb-4">
                     <span className="text-3xl font-bold">${nextPayment.price.toFixed(2)}</span>
                     <span className="text-indigo-200">
                       {nextPayment.daysUntil === 0 ? 'Today' : nextPayment.daysUntil === 1 ? 'Tomorrow' : `in ${nextPayment.daysUntil} days`}
                     </span>
                   </div>
                   <div className="w-full bg-indigo-900/30 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-white/90 h-full rounded-full" style={{ width: `${Math.max(5, 100 - (nextPayment.daysUntil * 3))}%` }}></div>
                   </div>
                 </div>
               </>
             ) : (
               <div className="flex flex-col h-full justify-center relative z-10">
                 <h3 className="text-xl font-bold">All clear!</h3>
                 <p className="text-indigo-200 text-sm">No upcoming payments found.</p>
               </div>
             )}
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          
          {/* Left Column: Visuals */}
          <div className="lg:col-span-2 space-y-8">
            <DashboardCharts subscriptions={subscriptions} />
            <CalendarView subscriptions={subscriptions} />
          </div>

          {/* Right Column: AI & List */}
          <div className="space-y-8">
            
            {/* AI Insights Module */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <BrainCircuit size={20} />
                  </div>
                  <h2 className="font-bold text-slate-800">Smart Insights</h2>
                </div>
                {subscriptions.length > 0 && (
                   <button 
                   onClick={handleAIAnalysis}
                   disabled={isAnalyzing}
                   className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                 >
                   {isAnalyzing ? 'Analyzing...' : 'Refresh'}
                 </button>
                )}
               
              </div>

              {!aiInsights && !isAnalyzing ? (
                <div className="text-center py-8 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <Sparkles className="mx-auto text-slate-300 mb-2" size={24} />
                  <p className="text-sm text-slate-500 mb-3">Get AI-powered tips on how to optimize your spending.</p>
                  <button 
                    onClick={handleAIAnalysis}
                    disabled={subscriptions.length === 0}
                    className="text-sm bg-white border border-slate-200 shadow-sm text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate Insights
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {isAnalyzing ? (
                    [1,2,3].map(i => (
                      <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
                    ))
                  ) : (
                    aiInsights?.insights.map((insight, idx) => (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                          insight.type === 'saving' ? 'bg-emerald-50/50 border-emerald-100/50' :
                          insight.type === 'warning' ? 'bg-amber-50/50 border-amber-100/50' :
                          'bg-indigo-50/50 border-indigo-100/50'
                        }`}
                      >
                        <h4 className={`font-semibold text-xs uppercase tracking-wider mb-1 ${
                           insight.type === 'saving' ? 'text-emerald-600' :
                           insight.type === 'warning' ? 'text-amber-600' :
                           'text-indigo-600'
                        }`}>
                          {insight.title}
                        </h4>
                        <p className="text-sm text-slate-700 leading-snug">{insight.description}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Subscription List */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col max-h-[600px]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 rounded-t-2xl">
                <h3 className="font-bold text-slate-800">Your Subscriptions</h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{subscriptions.length}</span>
              </div>
              
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {subscriptions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Plus className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-slate-900 font-medium mb-1">No subscriptions yet</h3>
                    <p className="text-slate-500 text-sm mb-4">Add your first recurring expense to start tracking.</p>
                    <button 
                      onClick={() => setIsFormOpen(true)}
                      className="text-indigo-600 text-sm font-semibold hover:underline"
                    >
                      Add now
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {subscriptions.map((sub) => (
                      <div key={sub.id} className="p-4 hover:bg-slate-50 transition-colors group flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                            style={{ backgroundColor: sub.color || '#94a3b8' }}
                          >
                            {sub.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 text-sm">{sub.name}</h4>
                            <p className="text-xs text-slate-500">{sub.category} • Day {sub.dayOfMonth}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="font-bold text-slate-900 text-sm">${sub.price.toFixed(2)}</span>
                           <button 
                            onClick={() => handleDelete(sub.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {subscriptions.length > 0 && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                  <button 
                    onClick={() => setIsFormOpen(true)}
                    className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm"
                  >
                    <Plus size={16} /> Add Another
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {isFormOpen && (
        <SubscriptionForm 
          onAdd={handleAddSubscription} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;