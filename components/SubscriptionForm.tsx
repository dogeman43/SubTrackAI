import React, { useState } from 'react';
import { Plus, X, DollarSign, Calendar, Tag, Layout } from 'lucide-react';
import { Subscription, Category } from '../types';

interface SubscriptionFormProps {
  onAdd: (sub: Omit<Subscription, 'id'>) => void;
  onClose: () => void;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [category, setCategory] = useState<Category>(Category.ENTERTAINMENT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !dayOfMonth) return;

    onAdd({
      name,
      price: parseFloat(price),
      dayOfMonth: parseInt(dayOfMonth, 10),
      category,
      color: generateColor(category)
    });
    onClose();
  };

  const generateColor = (cat: Category): string => {
    switch(cat) {
      case Category.ENTERTAINMENT: return '#8b5cf6'; // Violet
      case Category.UTILITIES: return '#f59e0b'; // Amber
      case Category.SOFTWARE: return '#3b82f6'; // Blue
      case Category.FITNESS: return '#10b981'; // Emerald
      default: return '#64748b'; // Slate
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">New Subscription</h3>
            <p className="text-sm text-slate-500">Track a new recurring expense</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-2 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Service Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Layout size={16} />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Netflix, Spotify"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Cost</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <DollarSign size={14} />
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Day of Month</label>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar size={16} />
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  max="31"
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag size={16} />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white text-slate-900 font-medium appearance-none"
              >
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-slate-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};