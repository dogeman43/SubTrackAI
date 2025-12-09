import React, { useState } from 'react';
import { ArrowRight, Check, DollarSign, User } from 'lucide-react';
import { OnboardingData } from '../types';

interface OnboardingTourProps {
  onComplete: (data: OnboardingData) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');

  const handleNext = () => {
    if (step === 1 && name) {
      setStep(2);
    } else if (step === 2 && budget) {
      onComplete({ name, budget: parseFloat(budget) });
    }
  };

  const handleSkip = () => {
     onComplete({ name: name || 'User', budget: 0 });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
          ></div>
        </div>

        <div className="p-8 flex-1 flex flex-col">
          {step === 1 ? (
            <div className="flex-1 flex flex-col justify-center animate-fade-in">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                <User size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Let's get introduced</h2>
              <p className="text-slate-500 mb-8">We'll use your name to personalize your dashboard and insights.</p>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">First Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  placeholder="Enter your name"
                  className="w-full p-4 text-lg border-b-2 border-slate-200 focus:border-indigo-600 outline-none bg-transparent transition-colors placeholder:text-slate-300"
                  autoFocus
                />
              </div>
            </div>
          ) : (
             <div className="flex-1 flex flex-col justify-center animate-fade-in">
               <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
                <DollarSign size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Set a monthly goal</h2>
              <p className="text-slate-500 mb-8">How much do you want to limit your subscription spending to per month?</p>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Monthly Budget ($)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  placeholder="e.g. 50"
                  className="w-full p-4 text-lg border-b-2 border-slate-200 focus:border-emerald-500 outline-none bg-transparent transition-colors placeholder:text-slate-300"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button 
              onClick={handleSkip}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleNext}
              disabled={(step === 1 && !name) || (step === 2 && !budget)}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg active:scale-95"
            >
              {step === 1 ? (
                <>Next Step <ArrowRight size={18} /></>
              ) : (
                <>Get Started <Check size={18} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};