/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from 'recharts';

interface ReportsViewProps {
  reportData: any;
  setReportFilter: (filter: any) => void;
  reportFilter: any;
}

const ReportsView = React.memo(({ 
  reportData, 
  setReportFilter, 
  reportFilter 
}: ReportsViewProps) => (
  <div className="space-y-8 pb-20">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Status Distribution */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Task Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={reportData.pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                onClick={(data) => setReportFilter({ type: 'status', value: data.name })}
                className="cursor-pointer"
              >
                {reportData.pieData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {reportData.pieData.map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Performance */}
      <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Team Lead Workload</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData.leadTaskCounts}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                dataKey="tasks" 
                fill="#4f46e5" 
                radius={[8, 8, 0, 0]} 
                onClick={(data) => setReportFilter({ type: 'lead', value: data.name })}
                className="cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Filtered Details Table */}
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900">Detailed Report</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {reportFilter.type ? `Filtering by ${reportFilter.type}: ${reportFilter.value}` : 'Showing all tasks'}
          </p>
        </div>
        {reportFilter.type && (
          <button 
            onClick={() => setReportFilter({ type: null, value: null })}
            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
          >
            Clear Filter
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Task</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reportData.filteredDetails.length > 0 ? (
              reportData.filteredDetails.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50 transition-all">
                  <td className="px-8 py-4 text-sm font-bold text-slate-900">{row.resource}</td>
                  <td className="px-8 py-4 text-sm font-bold text-slate-500">{row.lead}</td>
                  <td className="px-8 py-4 text-sm font-medium text-slate-700">{row.task}</td>
                  <td className="px-8 py-4 text-xs font-bold text-slate-400">{row.date}</td>
                  <td className="px-8 py-4 text-right">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${row.status === 'done' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : row.status === 'stuck' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-300 font-black uppercase tracking-widest italic">
                  Select a chart element to see details
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
));

export default ReportsView;
