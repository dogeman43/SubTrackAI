import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { Subscription } from '../types';

interface CalendarViewProps {
  subscriptions: Subscription[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ subscriptions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleResetDate = () => {
    setCurrentDate(new Date());
  };

  // Create array of days to render
  const days = useMemo(() => {
    const daysArray = [];
    // Empty slots for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(null);
    }
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    return daysArray;
  }, [daysInMonth, firstDayOfMonth]);

  const getSubscriptionsForDay = (day: number) => {
    return subscriptions.filter(sub => sub.dayOfMonth === day);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-base font-bold text-slate-800">Payment Calendar</h3>
        
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <button 
            onClick={handleResetDate}
            className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            title="Return to today"
          >
            Today
          </button>
          
          <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-white rounded text-slate-500 hover:text-slate-800 transition-all hover:shadow-sm">
              <ChevronLeft size={16} />
            </button>
            <span className="min-w-[100px] text-center text-sm font-semibold text-slate-700 select-none">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-white rounded text-slate-500 hover:text-slate-800 transition-all hover:shadow-sm">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50">
        {/* Header */}
        <div className="grid grid-cols-7 bg-white border-b border-slate-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px">
          {days.map((day, idx) => {
            if (day === null) {
               return <div key={`empty-${idx}`} className="bg-white/50 min-h-[100px]" />;
            }
            
            const daySubs = getSubscriptionsForDay(day);
            const totalDayCost = daySubs.reduce((sum, s) => sum + s.price, 0);
            const isCurrentDay = isToday(day);
            
            return (
              <div 
                key={`day-${day}`} 
                className={`bg-white min-h-[100px] p-2 transition-all hover:bg-slate-50 flex flex-col relative group
                  ${isCurrentDay ? 'bg-indigo-50/10' : ''}`}
              >
                {isCurrentDay && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500"></div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <span 
                    className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-colors
                      ${isCurrentDay 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                        : 'text-slate-700 group-hover:bg-slate-200'}`}
                  >
                    {day}
                  </span>
                  {totalDayCost > 0 && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                      ${totalDayCost.toFixed(0)}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1.5 overflow-y-auto max-h-[80px] custom-scrollbar">
                  {daySubs.map(sub => (
                    <div 
                      key={sub.id} 
                      className="text-[10px] px-1.5 py-1 rounded-md border flex items-center gap-1.5 transition-transform hover:-translate-y-0.5 hover:shadow-sm"
                      style={{ 
                        backgroundColor: 'white', 
                        borderColor: `${sub.color}40`,
                        color: '#334155'
                      }}
                      title={`${sub.name} - $${sub.price}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sub.color }} />
                      <span className="truncate font-medium">{sub.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};