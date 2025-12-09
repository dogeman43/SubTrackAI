import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Subscription } from '../types';

interface DashboardChartsProps {
  subscriptions: Subscription[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ subscriptions }) => {
  const totalCost = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

  // Aggregate data by category
  const dataByCategory = subscriptions.reduce((acc, sub) => {
    const existing = acc.find(item => item.name === sub.category);
    if (existing) {
      existing.value += sub.price;
    } else {
      acc.push({ name: sub.category, value: sub.price, color: sub.color });
    }
    return acc;
  }, [] as { name: string; value: number; color?: string }[]);

  // Calculate upcoming payments
  const dataByDay = subscriptions
    .sort((a, b) => a.dayOfMonth - b.dayOfMonth)
    .map(sub => ({
      name: `Day ${sub.dayOfMonth}`,
      amount: sub.price,
      shortName: `${sub.dayOfMonth}`
    }));

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col items-center justify-center h-80 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <PieChart className="text-slate-300" size={32} />
        </div>
        <h3 className="text-slate-900 font-medium">No data to visualize</h3>
        <p className="text-slate-500 text-sm mt-1">Add subscriptions to see your spending breakdown.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 text-white text-xs p-2 rounded-lg shadow-xl border border-slate-700">
          <p className="font-semibold mb-1">{label || payload[0].name}</p>
          <p className="text-slate-300">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Spend by Category */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col">
        <h3 className="text-base font-bold text-slate-800 mb-6">Spend by Category</h3>
        <div className="flex-1 min-h-[250px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataByCategory}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {dataByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#94a3b8'} className="outline-none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total</span>
            <span className="text-2xl font-bold text-slate-900">${totalCost.toFixed(0)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {dataByCategory.map(cat => (
            <div key={cat.name} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
              {cat.name}
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Timeline */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col">
        <h3 className="text-base font-bold text-slate-800 mb-6">Payment Timeline</h3>
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataByDay} barSize={20}>
              <XAxis 
                dataKey="shortName" 
                tick={{fontSize: 10, fill: '#64748b'}} 
                axisLine={false} 
                tickLine={false} 
                tickMargin={10}
              />
              <YAxis hide />
              <Tooltip cursor={{fill: '#f8fafc'}} content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="#6366f1" 
                radius={[4, 4, 4, 4]} 
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">Amounts due by day of month</p>
      </div>
    </div>
  );
};